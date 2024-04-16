import { Component, OnInit} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {
  ChatClientService,
  ChannelService,
  StreamI18nService,
  StreamAutocompleteTextareaModule,
  StreamChatModule,
} from 'stream-chat-angular';
import {ChatService} from "./chatService";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import { StreamChat } from 'stream-chat';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    TranslateModule,
    StreamAutocompleteTextareaModule,
    HttpClientModule,
    StreamChatModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ChatService]
})
export class AppComponent implements OnInit {
  messages: any[] = [];
  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private beChatService: ChatService
  ) {
    const apiKey = 'h5y3ytpvzcyn';
    const userId = 'crimson-hat-9';
    const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY3JpbXNvbi1oYXQtOSJ9.g1RkDXtd5F_7grvvGsD7XZvEQTLbfM-gTaaF1-kw4xs';
    this.chatService.init(apiKey, userId, userToken);
     this.streamI18nService.setTranslation();
  }

  async ngOnInit() {
    const adminUserId = 'joni-shpk';
    const adminUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam9uaS1zaHBrIn0.OpHTo5kD77gbw1kyDOAwDUU5UH4bVSlr9qb9OUcAeX8';

    const channel = this.chatService.chatClient.channel('messaging', 'talking-about-angular', {
      image: 'https://i.pinimg.com/564x/4b/28/03/4b2803d78874a7008c39c2643b66a313.jpg',
      name: 'ChatBot Datawiz' ,
    });
    await channel.create();

    this.channelService.init({
      type: 'messaging',
      id: {$eq: 'talking-about-angular'},
    });
    const apiKey = 'h5y3ytpvzcyn';
    const adminChatClient = new StreamChat(apiKey);
    await adminChatClient.setUser({ id: adminUserId }, adminUserToken);

    // this.sendMessage(adminChatClient.channel('messaging', 'talking-about-angular'), "Hello, I'm the admin. How can I assist you today?");

    channel.on('message.new', event => {
      const userMessage = event.message?.text ?? '';

      this.messages.push({ type: 'user', text: userMessage }); // Add user message to chat messages
      console.log('New message:', event.message?.text);
      if (event.message?.user?.id != adminUserId){
        this.beChatService.getResponse(event.message?.text ?? '').subscribe(res => {
          console.log(res)
          const botResponse = res?.message ?? 'Sorry, I couldnt understand that.';
          this.sendMessage(adminChatClient.channel('messaging', 'talking-about-angular'), botResponse)
          this.messages.push({type: 'bot', text: botResponse});
        })
      }
    });
  }

  sendMessage(channel:any, message: string){
    channel.sendMessage({
      text: message,
    }).then((message: any) => {
      console.log('Message sent successfully:', message);
    }).catch((error: any) => {
      console.error('Error sending message:', error);
    });
  }
}
