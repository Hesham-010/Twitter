import { Inject, Injectable } from '@nestjs/common';
import { CreateSessionInput } from '../inputs/create-session.input';
import { Session } from '../models/session.model';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IRepository } from 'src/_common/database/buildRepository.interface';

@Injectable()
export class SessionService {
  constructor(
    @Inject(Repositories.SessionsRepository)
    private sessionRepo: IRepository<Session>,
  ) {}

  async create(createSessionInput: CreateSessionInput) {
    const session = await this.sessionRepo.createOne({
      fcmToken: createSessionInput.fcmToken,
      device: createSessionInput.device,
      expireDate: new Date(Date.now() + 24 * 3600000),
      userId: createSessionInput.userId,
      refreshToken: createSessionInput.refreshToken,
    });

    return session;
  }

  async getAllSessions() {
    return await this.sessionRepo.findAll();
  }
}
