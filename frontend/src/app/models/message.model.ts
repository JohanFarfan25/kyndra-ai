export interface Message {
    id?: string;
    content: string;
    role: 'user' | 'assistant';
    userId: string;
    createdAt: Date;
}