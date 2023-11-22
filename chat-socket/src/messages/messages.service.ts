import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {

  // Array to store messages
  messages: Message[] = [{name: '', text: ''}]
  
  // Object to map client IDs to user names
  clientToUser = {};

  // Method to identify a user by associating a name with a client ID
  identify(name: string, clientId: string) {
    // Store the association of client ID with the provided name
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }

  // Method to create a new message
  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      text: createMessageDto.text
    };
    this.messages.push(message);
    return message;
  }

  // Method to retrieve all messages
  findAll() {
    return this.messages;
  }  
  
  // Method to get the client's associated user name
  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }
}
