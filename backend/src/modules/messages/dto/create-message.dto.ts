import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO para crear un mensaje
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;
}