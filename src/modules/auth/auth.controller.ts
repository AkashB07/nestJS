import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RefreshTokenDTO } from '../users/dto/user-token.dto';
import { AuthService } from './auth.service';
import { UserEmailForgotPasswordDTO } from './dto/user-email-forgot-password.dto';
import { UserEmailLoginDTO } from './dto/user-email-login.dto';
import { UserEmailResetPasswordDTO } from './dto/user-email-set-password.dto';
import { JwtRefreshTokenGuard } from './passport/jwt/jwt-refresh.guard';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('user/email/login')
  async userEmailLogin(
    @Res() res,
    @Body() userEmailLoginDTO: UserEmailLoginDTO,
  ) {
    const loginInfo = await this.authService.userEmailLogin(userEmailLoginDTO);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Login Successful',
      data: loginInfo,
    });
  }

  @Post('user/email/forgot-password')
  async userEmailForgotPassword(
    @Res() res,
    @Body()
    userEmailForgotPasswordDTO: UserEmailForgotPasswordDTO,
  ) {
    await this.authService.userEmailForgotPassword(userEmailForgotPasswordDTO);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Password Reset Link Sent To Email',
      data: {},
    });
  }

  @Post('user/email/set-password')
  async userEmailSetPassword(
    @Res() res,
    @Body()
    userEmailResetPasswordDTO: UserEmailResetPasswordDTO,
  ) {
    await this.authService.userEmailSetPassword(userEmailResetPasswordDTO);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Password Set Successfully',
      data: {},
    });
  }

  //only for internal purpose to create admin user
  @Post('user/super-user')
  async createSuperUser(
    @Res() res,
    @Body()
    userData: any,
  ) {
    // try {
    const user = await this.authService.createSuperUser(userData);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Created User Successfully',
      data: user,
    });
    // } catch (error) {
    //   console.log(error)
    // }
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Delete('user/logout')
  async userLogout(@Res() res, @Body() logoutDto: RefreshTokenDTO) {
    await this.authService.userLogout(logoutDto);
    return res.status(HttpStatus.NO_CONTENT).json();
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('user/refresh')
  async getAccessTokenByRefreshToken(
    @Res() res,
    @Body() createAccessTokenDTO: RefreshTokenDTO,
  ) {
    const accessToken = await this.authService.getAccessTokenByRefreshToken(
      createAccessTokenDTO,
    );
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Created Successfully', data: accessToken });
  }
}
