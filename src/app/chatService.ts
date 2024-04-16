// chat.service.ts
import { Injectable } from '@angular/core';
import {StreamChatModule as StreamChatService } from 'stream-chat-angular';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private streamChatService: StreamChatService) {}

  async sendMessage(channel: any, message: string): Promise<void> {
    try {
      await channel.sendMessage({
        text: message
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
