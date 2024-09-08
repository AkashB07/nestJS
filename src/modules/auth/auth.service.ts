// import {
//   HttpException,
//   HttpStatus,
//   Injectable,
//   Logger,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
// import {
//   generateEmailResetCode,
//   hashData,
//   verifyHashedData,
// } from './utils/auth.util';
// import { UserEmailLoginDTO } from './dto/user-email-login.dto';
// import {
//   IJwtAccessToken,
//   IJwtRefreshToken,
//   IResetTokenPayload,
// } from './interfaces/auth.interface';
// import { AuthCodeVerificationTypeEnum } from './constants/auth.enum';
// import { InjectRepository } from '@nestjs/typeorm';
// import base64url from 'base64url';
// import { UserEmailResetPasswordDTO } from './dto/user-email-set-password.dto';
// import { UserEmailForgotPasswordDTO } from './dto/user-email-forgot-password.dto';
// import { setPasswordTokenDataValidator } from './validators/auth.validator';
// import { ConfigService } from '@nestjs/config';
// import { OnEvent } from '@nestjs/event-emitter';
// import { EmailManagerService } from 'src/email-manager/email-manager.service';
// import { USER_RESET_PASSWORD_TEMPLATE } from 'src/email-manager/templates/user-reset-password.template';
// import { toTitleCase } from 'src/common/utils/name.util';
// import { USER_SET_PASSWORD_TEMPLATE } from 'src/email-manager/templates/user-set-password.template';
// import { Repository } from 'typeorm';
// import { AuthCodeVerification } from './entities/auth-code-verification.entity';
// import { RefreshTokenDTO } from '../users/dto/user-token.dto';
// import { CacheManagerService } from 'src/cache-manager/cache-manager.service';

// @Injectable()
// export class AuthService {
//   private readonly logger = new Logger(AuthService.name);
//   constructor(
//     @InjectRepository(AuthCodeVerification)
//     private readonly authCodeVerificationRepository: Repository<AuthCodeVerification>,
//     private configService: ConfigService,
//     private jwtService: JwtService,
//     private emailManagerService: EmailManagerService,
//     private redisService: CacheManagerService,
//     private usersService: UsersService,
//   ) {}

//   private async generateJWTAccessToken(user) {
//     const payload: IJwtAccessToken = {
//       id: user.id,
//       is_super_user: user.is_super_user,
//     };
//     return await this.jwtService.signAsync(payload);
//   }

//   async userEmailChangePasswordLink(
//     user,
//     verificationType: AuthCodeVerificationTypeEnum,
//   ) {
//     let authData: any = {
//       user_id: user.id,
//       type: AuthCodeVerificationTypeEnum.SET_PASSWORD,
//     };
//     const authCode = await this.authCodeVerificationRepository.findOne({
//       where: authData,
//     });
//     if (authCode) {
//       await this.authCodeVerificationRepository.delete(authCode.id);
//     }
//     const setPasswordCode = generateEmailResetCode();

//     const setPasswordCodeHash = await hashData(setPasswordCode);
//     const authCodeData = {
//       type: AuthCodeVerificationTypeEnum.SET_PASSWORD,
//       code_hash: setPasswordCodeHash,
//       user_id: user.id,
//     };
//     await this.authCodeVerificationRepository.save(authCodeData);

//     const tokenPayload: IResetTokenPayload = {
//       type: AuthCodeVerificationTypeEnum.SET_PASSWORD,
//       code: setPasswordCode,
//       user_id: user.id,
//     };
//     const token = base64url(JSON.stringify(tokenPayload));
//     const setPasswordLink = `${this.configService.get<string>(
//       'APP_FRONTEND_URL',
//     )}/auth/set-password?token=${token}`;
//     const template =
//       verificationType === AuthCodeVerificationTypeEnum.SET_PASSWORD
//         ? USER_SET_PASSWORD_TEMPLATE
//         : USER_RESET_PASSWORD_TEMPLATE;
// console.log(88, setPasswordLink)
//     this.emailManagerService
//       .sendTemplateEmail({
//         template,
//         to_emails: [user.email],
//         data: {
//           fullName: `${toTitleCase(user.name)}`,
//           setPasswordLink,
//         },
//       })
//       .catch((err) => {
//         this.logger.error(err);
//       });
//     return true;
//   }

//   @OnEvent('user.created', { async: true })
//   handleUserCreatedEvent({ user }) {
//     this.userEmailChangePasswordLink(
//       user,
//       AuthCodeVerificationTypeEnum.SET_PASSWORD,
//     );
//   }

//   async userEmailForgotPassword(
//     userEmailForgotPasswordDTO: UserEmailForgotPasswordDTO,
//   ) {
//     const user = await this.usersService.validateAndFindOneUserByEmail(
//       userEmailForgotPasswordDTO.email,
//     );
//     return await this.userEmailChangePasswordLink(
//       user,
//       AuthCodeVerificationTypeEnum.RESET_PASSWORD,
//     );
//   }

//   async userEmailSetPassword(
//     userEmailResetPasswordDTO: UserEmailResetPasswordDTO,
//   ) {
//     let tokenData: IResetTokenPayload;
//     try {
//       tokenData = JSON.parse(base64url.decode(userEmailResetPasswordDTO.token));
//       await setPasswordTokenDataValidator.validateAsync(tokenData);
//     } catch (err) {
//       throw new HttpException('Reset Token Invalid', HttpStatus.BAD_REQUEST);
//     }
//     const { type, code, user_id } = tokenData;
//     const authCode = await this.authCodeVerificationRepository
//       .createQueryBuilder('auth_code_verification')
//       .select([
//         'id',
//         `auth_code_verification.code_hash as "code_hash"`,
//         `auth_code_verification.user_id as "user_id"`,
//       ])
//       .addSelect(
//         `("created_at" + interval '${this.configService.get<number>(
//           'RESET_PASSWORD_TOKEN_EXPIRY_DAYS',
//         )} days') <= now()  as "isExpired"`,
//       )
//       .where('auth_code_verification.type = :type', { type })
//       .andWhere('auth_code_verification.user_id = :user_id', { user_id })
//       .getRawOne();

//     if (!authCode) {
//       throw new HttpException('Reset Token Invalid', HttpStatus.BAD_REQUEST);
//     }
//     if (authCode.isExpired) {
//       await this.authCodeVerificationRepository.delete(authCode.id);
//       throw new HttpException('Reset Token Expired', HttpStatus.BAD_REQUEST);
//     }

//     const isValidCode = await verifyHashedData(code, authCode.code_hash);
//     if (!isValidCode) {
//       throw new HttpException('Reset Token Invalid', HttpStatus.BAD_REQUEST);
//     }
//     const passwordHash = await hashData(userEmailResetPasswordDTO.password);
//     const updatedUser = await this.usersService.updatePassword(
//       authCode.user_id,
//       passwordHash,
//     );
//     await this.authCodeVerificationRepository.delete(authCode.id);
//     if (updatedUser.affected) {
//       return true;
//     } else {
//       throw new HttpException('Password Reset Failed', HttpStatus.BAD_REQUEST);
//     }
//   }

//   async userEmailLogin(userEmailLoginDTO: UserEmailLoginDTO) {
//     const user = await this.usersService.validateAndFindOneUserByEmail(
//       userEmailLoginDTO.email,
//     );

//     const isValidPassword = await verifyHashedData(
//       userEmailLoginDTO.password,
//       user.password_hash,
//     );

//     if (!isValidPassword) {
//       throw new HttpException('Password Is Incorrect', HttpStatus.BAD_REQUEST);
//     }
//     return await this.setupToken(user);
//   }

//   async setupToken(user) {
//     const accessToken = await this.generateJWTAccessToken(user);

//     const refreshTokenPayload: IJwtRefreshToken = {
//       id: user.id,
//       email: user.email,
//     };

//     const refreshToken = await this.generateJWTRefreshToken(
//       refreshTokenPayload,
//     );
//     if (refreshToken)
//       this.usersService.updateRefreshToken(user.id, refreshToken);

//     await this.redisService.setVal(
//       'auth',
//       user.id,
//       refreshToken,
//       this.configService.get<number>('REDIS_EXPIRY'),
//     );

//     return {
//       accessToken,
//       refreshToken,
//       user: {
//         id: user.id,
//         email: user.email,
//       },
//     };
//   }

//   private async generateJWTRefreshToken(payload: IJwtRefreshToken) {
//     const expiresIn = this.configService.get<string>(
//       'JWT_REFRESH_TOKEN_EXPIRY',
//     );
//     const secret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
//     return await this.jwtService.sign(payload, {
//       expiresIn,
//       secret,
//     });
//   }

//   async updateRefreshToken(id: string, refresh_token: string) {
//     if (refresh_token) refresh_token = await hashData(refresh_token);
//     this.usersService.updateOne(id, { refresh_token });
//     return;
//   }

//   async createSuperUser(userData: any) {
//     if (userData.is_super_user) {
//       let userObj: any = {
//         ...userData,
//       };
//       const passwordHash = await hashData(userData.password);
//       userObj.password_hash = passwordHash;
//       return await this.usersService.createSuperUser(userObj);
//     } else {
//       throw new HttpException(
//         'Super User Creation Failed',
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }

//   async userLogout(userLogoutDTO: RefreshTokenDTO) {
//     const { refresh_token } = userLogoutDTO;
//     const payload = await this.decodeRefreshToken(refresh_token);
//     if (!payload)
//       throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);

//     const { id } = payload;
//     const user = await this.usersService.findById(id);
//     if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

//     const value = await this.redisService.getVal('auth', id);
//     if (!value) throw new UnauthorizedException();
//     await this.redisService.deleteVal('auth', id);
//     await this.usersService.updateRefreshToken(user.id, null);
//     return;
//   }

//   async getAccessTokenByRefreshToken(createAccessTokenDTO: RefreshTokenDTO) {
//     const { refresh_token } = createAccessTokenDTO;
//     const payload = await this.decodeRefreshToken(refresh_token);
//     if (!payload)
//       throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);

//     const { email, id } = payload;

//     const value = await this.redisService.getVal('auth', id);
//     if (!value) throw new UnauthorizedException();

//     const user: any = await this.usersService.validateAndFindOneUserByEmail(
//       email,
//     );

//     if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

//     const isRefreshTokenMatch = await verifyHashedData(
//       refresh_token,
//       user.refresh_token,
//     );

//     if (!isRefreshTokenMatch)
//       throw new UnauthorizedException('Invalid refresh token');

//     const res = await this.setupToken(user);
//     return res;
//   }

//   async decodeRefreshToken(refresh_token: string) {
//     return await this.jwtService.verifyAsync(refresh_token);
//   }
// }
