import { Injectable, Inject } from '@nestjs/common';
import type { IMessageRepository } from '../domain/repositories/message.repository.interface';
import type { IAiService } from '../../ai/ai.service.interface';
import { Message } from '../domain/message.entity';

/**
 * Caso de uso de creación de mensaje
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Injectable()
export class CreateMessageUseCase {
  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepo: IMessageRepository,
    @Inject('IAiService')
    private readonly aiService: IAiService,
  ) { }

  /**
   * Crea un nuevo mensaje
   * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
   */
  async execute(content: string, userId: string) {
    //Crear y guardar mensaje del usuario
    const userMessage = new Message({
      content,
      role: 'user',
      userId,
    });
    await this.messageRepo.save(userMessage);

    // Obtener respuesta de IA
    const aiResponse = await this.aiService.generateResponse(content);

    // Crear y guardar mensaje del asistente
    const assistantMessage = new Message({
      content: aiResponse,
      role: 'assistant',
      userId,
    });
    const savedAssistant = await this.messageRepo.save(assistantMessage);

    // Retornar ambos mensajes (último es la respuesta)
    return savedAssistant;
  }
}