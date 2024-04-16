import {Component, OnInit} from '@angular/core';
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
    const channel = this.chatService.chatClient.channel('messaging', 'talking-about-angular', {
      // add as many custom fields as you'd like
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/2048px-Angular_full_color_logo.svg.png',
      name: 'ChatBot Datawiz',
    });
    await channel.create();

    // Update the channel name after creation
    await channel.update({
      image: 'https://media.cna.al/cna.al/wp-content/uploads/2019/07/-800-0-ngjela-1024x7362-e1562847667765.jpg',
      name: 'ChatBot Datawiz'
    });

    this.channelService.init({
      type: 'messaging',
      id: {$eq: 'talking-about-angular'},
    });
    channel.on('message.new', event => {
      console.log('New message:', event.message?.text);
      this.beChatService.getResponse(event.message?.text ?? '').subscribe(res => {
        console.log(res)
      })
    });

  }
}
