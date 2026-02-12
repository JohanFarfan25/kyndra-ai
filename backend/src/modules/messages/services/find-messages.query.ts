import { Injectable, Inject } from '@nestjs/common';
import type { IMessageRepository } from '../domain/repositories/message.repository.interface';
import { Message } from '../domain/message.entity';

@Injectable()
export class FindMessagesQuery {
  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepo: IMessageRepository,
  ) { }

  async execute(userId: string): Promise<Message[]> {
    return this.messageRepo.findAllByUser(userId);
  }
}