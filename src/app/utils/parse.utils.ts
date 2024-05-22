import {ConfigurationRequestDto} from "../dto/configuration.request.dto";

export const parseToJson = (data: any): string => {
  return JSON.stringify(data);
}
export const parseFromJson = (jsonString: string): any => {
  const parsedObject = JSON.parse(jsonString);

  const configDto: ConfigurationRequestDto = new ConfigurationRequestDto();
  configDto.channelId = parsedObject.channelId;
  configDto.assistantThread = parsedObject.assistantThread;

  return configDto;
}
