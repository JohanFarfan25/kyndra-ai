import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Esquema de mensaje
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
export type MessageDocument = MessageModel & Document;

@Schema({ collection: 'messages', timestamps: true })
export class MessageModel {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, enum: ['user', 'assistant'] })
  role: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(MessageModel);