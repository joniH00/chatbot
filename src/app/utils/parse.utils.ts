import {ConfigurationRequestDto} from "../dto/configuration.request.dto";
//parse data to JSON string
export const parseToJson = (data: any): string => {
  return JSON.stringify(data);
}
//parse data from JSON string to ConfigurationRequestDto object
export const parseFromJson = (jsonString: string): any => {
  const parsedObject = JSON.parse(jsonString);

  const configDto: ConfigurationRequestDto = new ConfigurationRequestDto();
  configDto.channelId = parsedObject.channelId;
  configDto.userId = parsedObject.userId;

  return configDto;
}
