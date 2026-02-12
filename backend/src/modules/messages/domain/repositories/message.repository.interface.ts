import { Message } from '../message.entity';

/**
 * Repositorio de mensajes
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
export interface IMessageRepository {
  save(message: Message): Promise<Message>;
  findAllByUser(userId: string): Promise<Message[]>;
  deleteAllByUser(userId: string): Promise<void>;
}