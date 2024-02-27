import { User } from './models/user.model';
import { DeviceEnum, UserVerificationCodeUseCaseEnum } from './user.enums';

export interface LastLoginDetailsTransformerInput {
  device?: DeviceEnum;
  platformDetails?: object;
}

export interface LongLatTransformerInput {
  long?: number;
  lat?: number;
}

export interface VerificationCodeAndExpirationDate {
  verificationCode: string;
  expiryDateAfterOneHour: Date;
}

export interface ValidVerificationCodeOrErrorInput {
  user?: User;
  verificationCode: string;
  useCase: UserVerificationCodeUseCaseEnum;
}

export interface DeleteVerificationCodeAndUpdateUserModelInput {
  user: User;
  useCase: UserVerificationCodeUseCaseEnum;
}

export interface UserByPhoneBasedOnUseCaseOrErrorInput {
  phone: string;
  useCase: UserVerificationCodeUseCaseEnum;
}
