import { Injectable, Inject } from '@nestjs/common';
import type { IMessageRepository } from '../domain/repositories/message.repository.interface';

/**
 * Caso de uso para eliminar mensajes
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Injectable()
export class DeleteMessagesUseCase {
    constructor(
        @Inject('IMessageRepository')
        private readonly messageRepo: IMessageRepository,
    ) { }

    /**
     * Ejecuta la eliminación de mensajes de un usuario
     * @param userId ID del usuario
     */
    async execute(userId: string): Promise<void> {
        await this.messageRepo.deleteAllByUser(userId);
    }
}
