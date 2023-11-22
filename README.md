# Building a chat application with NestJS and VueJS

## Setting up
### Backend server
- Create a new nestjs app
     ```bash
     nest new chat-socket
     ```
- Install dependencies: 
    ```bash
    npm install @nestjs/websockets @nestjs platform-socket.io
    ```
- Use the CLI to create a boilerplate for socket and choose WebSockets:
    ```bash
    nest g resource messages
    ```
### Frontend server
- Create a new vue app
    ```bash
    npm init vue@latest
    ```
## Setting up the socket
- setup the cors configuration in the ```messages.gateway.ts```
    ```typescript
    @WebSocketGateway({
    cors: {
        origin: '*',
    }
    })
    ```
    - This is to ensure when we use this in the UI later, it won't be blocked by the browser
- Because we have use the CLI to create a boilerplate, then we will have most of the basic CRUD operations, however, we only need the ```create()``` and ```findAll()``` methods in this case
- The ```create()``` method is to create new messages when a user send a message, WebSocket will update it and shows it to the chat room.
- the ```findAll()``` method is to show all the available messages in the chat room.
- Then we will create two more methods, which is the ```joinRoom()``` and ```isTyping```
- But before implementing the APIs, we will define what the Message is so we will go to the ```entities``` and declare the class there.
    ```typescript
    export class Message {
        name: string;
        text: string;
    }
    ```
    
