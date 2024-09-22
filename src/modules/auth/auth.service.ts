import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  generateEmailResetCode,
  hashData,
  verifyHashedData,
} from './utils/auth.util';
import { UserEmailLoginDTO } from './dto/user-email-login.dto';
import {
  IJwtAccessToken,
  IJwtRefreshToken,
  IResetTokenPayload,
} from './interfaces/auth.interface';
import { AuthCodeVerificationTypeEnum } from './constants/auth.enum';
import base64url from 'base64url';
import { UserEmailResetPasswordDTO } from './dto/user-email-set-password.dto';
import { UserEmailForgotPasswordDTO } from './dto/user-email-forgot-password.dto';
import { setPasswordTokenDataValidator } from './validators/auth.validator';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailManagerService } from 'src/email-manager/email-manager.service';
import { USER_RESET_PASSWORD_TEMPLATE } from 'src/email-manager/templates/user-reset-password.template';
import { toTitleCase } from 'src/common/utils/name.util';
import { USER_SET_PASSWORD_TEMPLATE } from 'src/email-manager/templates/user-set-password.template';
import { RefreshTokenDTO } from '../users/dto/user-token.dto';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthCodeVerificationType } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private emailManagerService: EmailManagerService,
    private redisService: CacheManagerService,
    private usersService: UsersService,
  ) { }

  private async generateJWTAccessToken(user) {
    const payload: IJwtAccessToken = {
      id: user.id,
      is_super_user: user.is_super_user,
    };
    return await this.jwtService.signAsync(payload);
  }

  async userEmailChangePasswordLink(
    user,
    verificationType: AuthCodeVerificationTypeEnum,
  ) {
    let authData: any = {
      user_id: user.id,
      type: AuthCodeVerificationTypeEnum.SET_PASSWORD,
    };
    const authCode = await this.prisma.authCodeVerification.findFirst({
      where: authData,
    });
    if (authCode) {
      await this.prisma.authCodeVerification.delete({
        where: {
          id: authCode.id, // Specify the ID for deletion
        },
      });
    }
    const setPasswordCode = generateEmailResetCode();

    const setPasswordCodeHash = await hashData(setPasswordCode);
    const authCodeData = {
      type: AuthCodeVerificationTypeEnum.SET_PASSWORD as AuthCodeVerificationType,
      code_hash: setPasswordCodeHash,
      user_id: user.id,
    };
    // await this.authCodeVerificationRepository.save(authCodeData);
    await this.prisma.authCodeVerification.create({
      data: authCodeData,
    });

    const tokenPayload: IResetTokenPayload = {
      type: AuthCodeVerificationTypeEnum.SET_PASSWORD,
      code: setPasswordCode,
      user_id: user.id,
    };
    const token = base64url(JSON.stringify(tokenPayload));
    const setPasswordLink = `${this.configService.get<string>(
      'APP_FRONTEND_URL',
    )}/auth/set-password?token=${token}`;
    const template =
      verificationType === AuthCodeVerificationTypeEnum.SET_PASSWORD
        ? USER_SET_PASSWORD_TEMPLATE
        : USER_RESET_PASSWORD_TEMPLATE;

    this.emailManagerService
      .sendTemplateEmail({
        template,
        to_emails: [user.email],
        data: {
          fullName: `${toTitleCase(user.name)}`,
          setPasswordLink,
        },
      })
      .catch((err) => {
        this.logger.error(err);
      });
    return true;
  }

  @OnEvent('user.created', { async: true })
  handleUserCreatedEvent({ user }) {
    this.userEmailChangePasswordLink(
      user,
      AuthCodeVerificationTypeEnum.SET_PASSWORD,
    );
  }

  async userEmailForgotPassword(
    userEmailForgotPasswordDTO: UserEmailForgotPasswordDTO,
  ) {
    const user = await this.usersService.validateAndFindOneUserByEmail(
      userEmailForgotPasswordDTO.email,
    );
    return await this.userEmailChangePasswordLink(
      user,
      AuthCodeVerificationTypeEnum.RESET_PASSWORD,
    );
  }

  async userEmailSetPassword(
    userEmailResetPasswordDTO: UserEmailResetPasswordDTO,
  ) {
    let tokenData: IResetTokenPayload;
    try {
      tokenData = JSON.parse(base64url.decode(userEmailResetPasswordDTO.token));
      await setPasswordTokenDataValidator.validateAsync(tokenData);
    } catch (err) {
      throw new HttpException('Reset Token Invalid', HttpStatus.BAD_REQUEST);
    }

    const { type, code, user_id } = tokenData;
    const resetPasswordTokenExpiryDays = this.configService.get<number>('RESET_PASSWORD_TOKEN_EXPIRY_DAYS');

    // Use Prisma's $queryRaw to execute a custom SQL query
    const authCode = await this.prisma.$queryRaw`
     SELECT id, code_hash AS "code_hash", user_id AS "user_id",
     ("created_at" + interval '${resetPasswordTokenExpiryDays} days') <= now() AS "isExpired"
     FROM "auth_code_verification"
     WHERE type = ${type}::"AuthCodeVerificationType" AND user_id = ${user_id}
     LIMIT 1;
    `;

    if (authCode && authCode[0].isExpired) {
      await this.prisma.authCodeVerification.delete({ where: { id: authCode[0].id } });
      throw new HttpException('Reset Token Expired', HttpStatus.BAD_REQUEST);
    }

    const isValidCode = await verifyHashedData(code, authCode[0].code_hash);
    if (!isValidCode) {
      throw new HttpException('Reset Token Invalid', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await hashData(userEmailResetPasswordDTO.password);
    const updatedUser = await this.usersService.updatePassword(
      authCode[0].user_id,
      passwordHash,
    );

    await this.prisma.authCodeVerification.delete({ where: { id: authCode[0].id } });
    if (updatedUser) {
      return true;
    } else {
      throw new HttpException('Password Reset Failed', HttpStatus.BAD_REQUEST);
    }
  }

  async userEmailLogin(userEmailLoginDTO: UserEmailLoginDTO) {
    const user = await this.usersService.validateAndFindOneUserByEmail(
      userEmailLoginDTO.email,
    );

    const isValidPassword = await verifyHashedData(
      userEmailLoginDTO.password,
      user.password_hash,
    );

    if (!isValidPassword) {
      throw new HttpException('Password Is Incorrect', HttpStatus.BAD_REQUEST);
    }
    return await this.setupToken(user);
  }

  async setupToken(user) {
    const accessToken = await this.generateJWTAccessToken(user);

    const refreshTokenPayload: IJwtRefreshToken = {
      id: user.id,
      email: user.email,
    };

    const refreshToken = await this.generateJWTRefreshToken(
      refreshTokenPayload,
    );
    if (refreshToken)
      this.usersService.updateRefreshToken(user.id, refreshToken);

    await this.redisService.setVal(
      'auth',
      user.id,
      refreshToken,
      this.configService.get<number>('REDIS_EXPIRY'),
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  private async generateJWTRefreshToken(payload: IJwtRefreshToken) {
    const expiresIn = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_EXPIRY',
    );
    const secret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
    return await this.jwtService.sign(payload, {
      expiresIn,
      secret,
    });
  }

  // async updateRefreshToken(id: string, refresh_token: string) {
  //   if (refresh_token) refresh_token = await hashData(refresh_token);
  //   this.usersService.updateOne(id, { refresh_token });
  //   return;
  // }

  async createSuperUser(userData: any) {
    if (userData.is_super_user) {
      const { password, ...rest } = userData;
      const userObj: any = {
        ...rest,
      };
      const passwordHash = await hashData(password);
      userObj.password_hash = passwordHash;
      return await this.usersService.createSuperUser(userObj);
    } else {
      throw new HttpException(
        'Super User Creation Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

    async userLogout(userLogoutDTO: RefreshTokenDTO) {
      const { refresh_token } = userLogoutDTO;
      const payload = await this.decodeRefreshToken(refresh_token);
      if (!payload)
        throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);

      const { id } = payload;
      const user = await this.usersService.findById(id);
      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const value = await this.redisService.getVal('auth', id);
      if (!value) throw new UnauthorizedException();
      await this.redisService.deleteVal('auth', id);
      await this.usersService.updateRefreshToken(user.id, null);
      return;
    }

    async getAccessTokenByRefreshToken(createAccessTokenDTO: RefreshTokenDTO) {
      const { refresh_token } = createAccessTokenDTO;
      const payload = await this.decodeRefreshToken(refresh_token);
      if (!payload)
        throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);

      const { email, id } = payload;

      const value = await this.redisService.getVal('auth', id);
      if (!value) throw new UnauthorizedException();

      const user: any = await this.usersService.validateAndFindOneUserByEmail(
        email,
      );

      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const isRefreshTokenMatch = await verifyHashedData(
        refresh_token,
        user.refresh_token,
      );

      if (!isRefreshTokenMatch)
        throw new UnauthorizedException('Invalid refresh token');

      const res = await this.setupToken(user);
      return res;
    }

    async decodeRefreshToken(refresh_token: string) {
      return await this.jwtService.verifyAsync(refresh_token);
    }
}
