// chat.service.ts
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

const API_URL = 'http://localhost:5291';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  async sendMessage(channel: any, message: string): Promise<void> {
    try {
      await channel.sendMessage({
        text: message
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  getResponse(message: string){
    return this.http.get<any>(`${API_URL}/${message}`)
  }
}
