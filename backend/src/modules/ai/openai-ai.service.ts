import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAiService } from './ai.service.interface';

/**
 * Servicio de IA que utiliza OpenAI
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Injectable()
export class OpenAiAiService implements IAiService {
  private readonly logger = new Logger(OpenAiAiService.name);
  private apiKey?: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  async generateResponse(prompt: string): Promise<string> {
    // Si no hay API key es decir no hay integración con OpenAI, usamos mock estructurado
    if (!this.apiKey) {
      this.logger.warn('OPENAI_API_KEY no configurada, usando respuestas mock');
      return this.mockResponse(prompt);
    }

    try {
      // Integración real con OpenAI
      const { Configuration, OpenAIApi } = require('openai');
      const configuration = new Configuration({ apiKey: this.apiKey });
      const openai = new OpenAIApi(configuration);

      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error('Error llamando a OpenAI', error);
      return this.mockResponse(prompt); // fallback a mock
    }
  }

  /**
   * Genera una respuesta (aleatoria) mock para pruebas
   * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
   */
  private mockResponse(prompt: string): string {
    const responses = [
      '¡Hola! Soy Kyndra AI. ¿En qué puedo ayudarte?',
      'Entiendo tu pregunta. Déjame pensar...',
      'Eso es interesante. Cuéntame más.',
      'No tengo una respuesta para eso ahora mismo.',
      'Estoy aprendiendo constantemente. Gracias por tu mensaje.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}