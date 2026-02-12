import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { IAiService } from './ai.service.interface';

/**
 * Servicio de IA que utiliza OpenAI
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Injectable()
export class OpenAiAiService implements IAiService {
  private readonly logger = new Logger(OpenAiAiService.name);
  private apiKey?: string;
  private openai?: OpenAI;
  private model?: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.model = this.configService.get<string>('OPENAI_MODEL');
    if (this.apiKey) {
      this.openai = new OpenAI({
        apiKey: this.apiKey,
      });
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    // Si no hay API key o cliente inicializado, usamos mock
    if (!this.openai) {
      this.logger.warn('OPENAI_API_KEY no configurada, usando respuestas mock');
      return this.mockResponse(prompt);
    } else if (!this.model) {
      this.logger.warn('OPENAI_MODEL no configurada, usando respuestas mock');
      return this.mockResponse(prompt);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'Eres un asistente útil. Responde siempre en español.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.choices[0].message.content || 'Sin respuesta';
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
      'Esa es una excelente pregunta, déjame analizarla.',
      'Por favor, dame un momento para procesar tu solicitud.',
      'Interesante punto de vista. Aquí tienes más información...',
      'Lo siento, mi capacidad de respuesta es limitada en este momento, pero sigo aprendiendo.',
      '¿Podrías elaborar un poco más sobre ese tema?',
      '¡Qué buen día para aprender algo nuevo!',
      'Estoy aquí para asistirte en lo que necesites.',
      'Esa información es clave para entender el contexto.',
      'Gracias por compartir eso conmigo.',
      '¡Vaya! No había considerado eso antes.',
      'Mi base de conocimientos se está actualizando.',
      'Por favor, intenta preguntar de otra manera si no fui claro.',
      '¡Claro! Puedo ayudarte con eso.',
      'Me parece fascinante.',
      '¿Hay algo más en lo que pueda ayudarte hoy?',
      'Recuerda que soy una IA en desarrollo, ¡pero hago lo mejor que puedo!',
      'Esa consulta es muy popular últimamente.',
      'He registrado tu pregunta para futuras mejoras.',
      '¡Excelente elección de tema!',
      'Dame un segundo, estoy buscando la mejor respuesta...',
      'A veces las respuestas más simples son las correctas.',
      'Me encanta interactuar contigo.',
      '¿Te gustaría saber más sobre un tema específico?',
      'La creatividad es una de mis características favoritas.',
      'Siempre es un placer conversar contigo.',
      '¡Qué pregunta tan perspicaz!',
      'Estoy procesando millones de datos para responderte...',
      '¡Listo! Aquí estoy para ti.',
      'Curiosa pregunta. Déjame ver qué encuentro.',
      '¡Absolutamente! Continuemos.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}