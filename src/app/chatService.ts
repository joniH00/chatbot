// chat.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MessageDto} from "./dto/message.dto";

const API_URL = 'http://localhost:5291/api';
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

  initializeChat(){
    return this.http.get<any>(`${API_URL}/initialize-chat`)
  }

  messageManagement(message: MessageDto){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${API_URL}/Message-Management`, message, {headers})
  }
}
