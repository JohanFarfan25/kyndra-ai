/**
 * Entidad de mensaje
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
export class Message {
  id?: string;
  content: string;
  role: 'user' | 'assistant';
  userId: string;
  createdAt: Date;

  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
  }
}