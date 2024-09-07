import { AuthCodeVerificationTypeEnum } from '../constants/auth.enum';

export interface IJwtAccessToken {
  id: string;
  is_super_user: boolean;
}

export interface IResetTokenPayload {
  type: AuthCodeVerificationTypeEnum;
  code: string;
  user_id: string;
}

export interface IJwtRefreshToken {
  id: string;
  email: string;
}
