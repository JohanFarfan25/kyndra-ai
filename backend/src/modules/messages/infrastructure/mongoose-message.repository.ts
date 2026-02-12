import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMessageRepository } from '../domain/repositories/message.repository.interface';
import { Message } from '../domain/message.entity';
import { MessageDocument, MessageModel } from './message.schema';

/**
 * Repositorio de mensajes
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Injectable()
export class MongooseMessageRepository implements IMessageRepository {
  constructor(
    @InjectModel(MessageModel.name) private messageModel: Model<MessageDocument>,
  ) { }

  /**
   * Guarda un mensaje
   * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
   */
  async save(message: Message): Promise<Message> {
    const created = new this.messageModel({
      content: message.content,
      role: message.role,
      userId: message.userId,
      createdAt: message.createdAt,
    });
    const saved = await created.save();
    return new Message({
      id: saved._id.toString(),
      content: saved.content,
      role: saved.role as any,
      userId: saved.userId,
      createdAt: saved.createdAt,
    });
  }

  /**
   * Obtiene todos los mensajes de un usuario
   * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
   */
  async findAllByUser(userId: string): Promise<Message[]> {
    const docs = await this.messageModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return docs.map(doc => new Message({
      id: doc._id.toString(),
      content: doc.content,
      role: doc.role as any,
      userId: doc.userId,
      createdAt: doc.createdAt,
    }));
  }
}