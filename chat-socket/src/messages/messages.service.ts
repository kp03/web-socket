import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {

  messages: Message[] = [{name: '', text: ''}]
  clientToUser = {};

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }

  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      text: createMessageDto.text
    };
    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }  
  
  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }
}
