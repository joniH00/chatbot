import {
  AfterContentInit,
  AfterViewInit,
  Component,
  HostListener,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
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
import {ConfigurationRequestDto} from "./dto/configuration.request.dto";
import {parseFromJson, parseToJson} from "./utils/parse.utils";
import {NavigationEnd, NavigationStart, Router, RouterEvent} from "@angular/router";


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
  private isRefreshing!: boolean;

  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private service: ChatService,
    private router: Router,
    public messageService: MessageService
  ) {
    this.processedMessages = new Set();
  }

  // Function to initialize the component
  async ngOnInit() {
    // Set message display format
    this.messageService.displayAs = 'html';
    // Initialize chat
    await this.chatinitialize();
    // Prevent default behaviors for dragover and drop events
    window.addEventListener("dragover", e => {
      e && e.preventDefault();
    }, false);
    window.addEventListener("drop", e => {
      e && e.preventDefault();
    }, false);
  }

  // Function to initialize chat
  async chatinitialize() {
    let configReq;
    let hasChannelData = false;
    // Retrieve channel data from session storage or set it to default values
    const jsonString = sessionStorage.getItem('channel_data');
    if (jsonString === null) {
      configReq = { userId: null, channelId: null } as ConfigurationRequestDto;
      hasChannelData = false
    } else {
      hasChannelData = true
      configReq = parseFromJson(jsonString)
    }
    // Initialize chat service
    this.service.initializeChat(configReq).subscribe(async (res) => {
      // Initialize chat client with API key and user token
      await this.chatService.init(res.apiKey, res.userId, res.userToken);
      // Set translation for chat messages
      this.streamI18nService.setTranslation();
      // Store channel data in session storage if it's not already stored
      if (!hasChannelData) {
        const configReq = {
          userId: res.userId,
          channelId: res.channelId
        } as ConfigurationRequestDto
        sessionStorage.setItem('channel_data', parseToJson(configReq))
      }
      this.configurationData = res;
      // Create a new chat channel
      const channel = this.chatService.chatClient.channel(res.chatType, res.channelId, {
        image: 'https://i.pinimg.com/564x/4b/28/03/4b2803d78874a7008c39c2643b66a313.jpg',
        name: 'ChatBot Datawiz',
      });
      await channel.create();

      // Initialize channel service
      await this.channelService.init({
        type: res.channelType,
        id: { $eq: res.channelId },
      });
      // Listen for new messages in the channel
      channel.on('message.new', (event: any) => this.handleNewMessage(event, channel));
      // If channel data is not stored, fetch the first message
      if (!hasChannelData) {
        const messagebody = this.createBodyReq('firstMessage', this.configurationData.chatType, this.configurationData.userId,
          this.configurationData.channelId);
        this.service.getFirstMessage(messagebody).subscribe(res => {
          console.log(123, res)
        })
      }
    })
  }

  // Function to handle new messages in the channel
  handleNewMessage(event: any, channel: any): void {
    const messageId = event.message?.id ?? '';
    const userRole = event.message?.role ?? 'user'; // Assume 'user' if not specified

    console.log(`Received event for message ID ${messageId} from ${userRole} at ${new Date().toISOString()}`);

    // Process the message if it hasn't been processed before
    if (!this.processedMessages.has(messageId)) {
      this.processedMessages.add(messageId);
      // Set a timeout to process the message, debounce repeated events
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => this.processMessage(event), 300);
      // Unsubscribe from message.new event after processing once
      // channel.off('message.new', this.handleNewMessage);
    }
  }

  // Function to process a message
  processMessage(event: any) {
    const userId = event.user?.id ?? '';
    console.log(userId);
    console.log(event);
    if (userId === this.configurationData.userId) {
      const userMessage = event.message?.text ?? '';
      const channelType = event.channel_type ?? '';
      const channelId = event.channel_id ?? '';
      const messageId = event.message?.id ?? '';

      if (this.lastMessageId === messageId) return;
      this.lastMessageId = messageId;

      // Create message DTO and send it for further processing
      const messageDto = this.createBodyReq(userMessage, channelType, userId, channelId);
      if (userId === this.configurationData.userId)
        this.service.messageManagement(messageDto).subscribe();

      // Add user message to chat messages
      this.messages.push({ type: 'user', text: userMessage });
      console.log('New message:', userMessage);
    }
  }

  // Function to create a message body DTO
  createBodyReq(text: string, type: string, userId: string, channelId: string, ) {
    return {
      text: text,
      type: type,
      userId: userId,
      channelId: channelId
    } as MessageDto
  }

/*  // Function to handle file drop event
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const files = event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('Dropped file', file.name);
// Add file name to chat messages
        this.messages.push({ type: 'file', text: file.name }); // Example to show file name in messages
      }
    }
  }*/


  /*@HostListener('window:unload', ['$event'])
  onWindowClose(event: any) {
    console.log(event)
    const jsonString = sessionStorage.getItem('channel_data');
    if (jsonString !== null)
    {
      this.service.deleteChat(parseFromJson(jsonString)).subscribe()
    }
    return event.returnValue = 'You may lose your changes';
  }*/
}
