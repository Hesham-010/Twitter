import { registerEnumType } from '@nestjs/graphql';

export enum FileModelEnum {
  USERS = 'users',
  EXPERTISE_LEVELS = 'expertise-levels',
  PROFILE_PICTURE = 'profile-picture',
  CONSULTATIONS_ATTACHMENTS = 'consultations-attachments',
  APPOINTMENT_MESSAGES = 'appointment-messages',
}
registerEnumType(FileModelEnum, { name: 'FileModelEnum' });
