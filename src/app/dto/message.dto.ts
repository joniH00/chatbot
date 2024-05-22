//DTO of the message that contains text, userid, channelid and type
export class MessageDto{
  text!: string;
  userId!: string;
  channelId!: string;
  type!: string;
  assistantThread!: string;
}
