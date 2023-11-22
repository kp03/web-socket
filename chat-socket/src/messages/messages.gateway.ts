import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io'
import { Message } from './entities/message.entity';

// Allowing connections from any origin
@WebSocketGateway({
  cors: {
    origin: '*',
  }
})

export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  // Call the 'create' method from MessagesService to create a message
  // Emit the created message to all connected clients
  // Return the created message
  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client) {
    const message = await this.messagesService.create(createMessageDto, client.id);
    this.server.emit('message', message);
    return message;
  }

  // Return all messages using the 'findAll' method from MessagesService
  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }
  
  // Handler for the 'join' WebSocket event to identify users
  // Call the 'identify' method from MessagesService to associate a name with the client ID
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name:string,
    @ConnectedSocket() client: Socket
  ){
    return this.messagesService.identify(name, client.id);
  }

  // Handler for the 'typing' WebSocket event
  // Get the client's associated user name
  // Broadcast a 'typing' event to all other connected clients
  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client:Socket
  ) {
    const name = await this.messagesService.getClientName(client.id);
    client.broadcast.emit('typing', {name, isTyping});
  }
}
