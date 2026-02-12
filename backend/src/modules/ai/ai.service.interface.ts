export interface IAiService {
  generateResponse(prompt: string): Promise<string>;
}