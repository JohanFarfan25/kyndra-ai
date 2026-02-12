import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './controllers/messages.controller';
import { CreateMessageUseCase } from './services/create-message.use-case';
import { FindMessagesQuery } from './services/find-messages.query';
import { DeleteMessagesUseCase } from './services/delete-messages.use-case';
import { MongooseMessageRepository } from './infrastructure/mongoose-message.repository';
import { MessageModel, MessageSchema } from './infrastructure/message.schema';
import { OpenAiAiService } from '../ai/openai-ai.service';
import { IAiService } from '../ai/ai.service.interface';

/**
 * Modulo de mensajes
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: MessageModel.name, schema: MessageSchema }]),
  ],
  controllers: [MessagesController],
  providers: [
    CreateMessageUseCase,
    FindMessagesQuery,
    DeleteMessagesUseCase,
    {
      provide: 'IMessageRepository',
      useClass: MongooseMessageRepository,
    },
    {
      provide: 'IAiService',
      useClass: OpenAiAiService,
    },
  ],
})
export class MessagesModule { }