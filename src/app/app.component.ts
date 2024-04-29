import {AfterContentInit, AfterViewInit, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {
  ChatClientService,
  ChannelService,
  StreamI18nService,
  StreamAutocompleteTextareaModule,
  StreamChatModule, DefaultStreamChatGenerics, MessageService,
} from 'stream-chat-angular';
import {ChatService} from "./chatService";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {ConfigurationDto} from "./dto/configuration.dto";
import {MessageDto} from "./dto/message.dto";
import {Channel} from "stream-chat";


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
export class AppComponent implements OnInit{
  messages: any[] = [];
  configurationData!: ConfigurationDto;
  private continueEvent!: Channel<DefaultStreamChatGenerics>;
  private debounceTimer?: ReturnType<typeof setTimeout>;
  private lastMessageId!: string;
  private processedMessages: Set<string>;

  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private service: ChatService,
    public messageService: MessageService
  ) {
    this.processedMessages = new Set();
  }

  async ngOnInit() {
    this.messageService.displayAs = 'html';
    await this.chatinitialize();
  }

  async chatinitialize() {
    this.service.initializeChat().subscribe(async (res) => {
      await this.chatService.init(res.apiKey, res.userId, res.userToken);
      this.streamI18nService.setTranslation();
      this.configurationData = res;
      const channel = this.chatService.chatClient.channel(res.chatType, res.channelId, {
        image: 'https://i.pinimg.com/564x/4b/28/03/4b2803d78874a7008c39c2643b66a313.jpg',
        name: 'ChatBot Datawiz',
      });
      await channel.create();

      await this.channelService.init({
        type: res.channelType,
        id: {$eq: res.channelId},
      });
      channel.on('message.new', (event: any) => this.handleNewMessage(event, channel));
    })
  }

  handleNewMessage(event: any, channel: any): void {
    const messageId = event.message?.id ?? '';
    const userRole = event.message?.role ?? 'user'; // Assume 'user' if not specified

    console.log(`Received event for message ID ${messageId} from ${userRole} at ${new Date().toISOString()}`);

    if (!this.processedMessages.has(messageId)) {
      this.processedMessages.add(messageId);
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => this.processMessage(event), 300);
      // channel.off('message.new', this.handleNewMessage);
    }
  }


  processMessage(event: any) {
    const userId = event.user?.id ?? '';
    console.log(userId);
    if (userId === this.configurationData.userId) {
      const userMessage = event.message?.text ?? '';
      const channelType = event.channel_type ?? '';
      const channelId = event.channel_id ?? '';
      const messageId = event.message?.id ?? '';

      // Prevent processing the same message multiple times
      if (this.lastMessageId === messageId) return;
      this.lastMessageId = messageId;

      const messageDto = this.createBodyReq(userMessage, channelType, userId, channelId);
      if (userId === this.configurationData.userId)
        this.service.messageManagement(messageDto).subscribe();

      this.messages.push({ type: 'user', text: userMessage }); // Add user message to chat messages
      console.log('New message:', userMessage);
    }
  }

  createBodyReq(text: string, type: string, userId: string, channelId: string, ) {
    return {
      text: text,
      type: type,
      userId: userId,
      channelId: channelId
    } as MessageDto
  }
}
