// chatgpt.service.ts
import { Injectable } from '@angular/core';
import { OpenAI } from 'openai';

@Injectable({
  providedIn: 'root'
})
export class ChatGptService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: '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',// Assume the API Key is stored securely in the environment settings
      dangerouslyAllowBrowser: true
    });
  }

  async sendMessage(message: string){
    try {
      const openai = new OpenAI({
        apiKey: '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',
        dangerouslyAllowBrowser: true// defaults to process.env["OPENAI_API_KEY"]
      });
        const params: OpenAI.Chat.ChatCompletionCreateParams = {
          messages: [{ role: 'user', content: 'Say this is a test' }],
          model: 'gpt-3.5-turbo',
        };
        const completion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
        return '';
    } catch (error) {
      console.error('Error calling ChatGPT:', error);
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'I\'m sorry, I couldn\'t understand that.';
    }
  }
}
