import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateMessageUseCase } from '../services/create-message.use-case';
import { FindMessagesQuery } from '../services/find-messages.query';
import { DeleteMessagesUseCase } from '../services/delete-messages.use-case';
import { CreateMessageDto } from '../dto/create-message.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

/**
 * Controlador de mensajes
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly findMessagesQuery: FindMessagesQuery,
    private readonly deleteMessagesUseCase: DeleteMessagesUseCase,
  ) { }

  /**
   * Crea un nuevo mensaje
   * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateMessageDto, @CurrentUser() user: any) {
    const result = await this.createMessageUseCase.execute(dto.content, user.userId);
    return { message: 'Mensaje procesado', data: result };
  }

  /**
   * Obtiene todos los mensajes
   * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
   */
  @Get()
  async findAll(@CurrentUser() user: any) {
    const messages = await this.findMessagesQuery.execute(user.userId);
    return messages;
  }

  // quiero que se eliminen todos los mensaje sde este usuario 
  @Delete()
  async delete(@CurrentUser() user: any) {
    const messages = await this.deleteMessagesUseCase.execute(user.userId);
    return messages;
  }
}