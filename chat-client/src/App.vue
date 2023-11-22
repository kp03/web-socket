<script setup>
import  {io} from 'socket.io-client'
import { onBeforeMount, ref } from 'vue';

// Initializing Socket.IO client
const socket = io('http://localhost:3001/')

// References for reactive data
const messages = ref([]);
const messageText = ref('');
const joined = ref(false);
const name = ref('')
const typingDisplay = ref('')

// Executed before the component is mounted to the DOM
onBeforeMount(() => {
  // Fetch all existing messages from the server
  socket.emit('findAllMessages', {}, (response) => {
    messages.value = response;
  });

  // Listen for incoming messages
  socket.on('message', (message) => {
    messages.value.push(message);
  })

  // Listen for typing events
  socket.on('typing', ({name, isTyping}) => {
    if (isTyping) {
      typingDisplay.value = `${name} is typing...`;
    } else {
      typingDisplay.value = '';
    }
  })
});

// Function to emit typing event to the server
let timeout;
const emitTyping = () => {
  socket.emit('typing', {isTyping: true});
  timeout = setTimeout( () => {
    socket.emit('typing', {isTyping: false});
  }, 2000);
}

// Function to join the chat room
const join = () => {
  socket.emit('join', {name: name.value}, () => {
    joined.value = true;
  })
}

// Function to send a message
const sendMessage = () => {
  socket.emit('createMessage', {text: messageText.value}, response => {
    messageText.value = '';
  })
}
</script>

<template>
  <div class="chat">
    <div v-if="!joined">
      <form @submit.prevent="join">
        <label>What's your name?</label>
        <input v-model="name"/>
        <button type="submit">Send</button>
      </form>
    </div>    
    <div class="chat-container">
      <div class="messages-container">
        <div v-for=" message in messages">
          [{{ message.name }}]: {{ message.text }}
        </div>
      </div>

      <div v-if="typingDisplay">{{ typingDisplay }}</div>
      <hr/>
      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <label>Message:</label>
          <input v-model="messageText" @input="emitTyping"/>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
@import './assets/base.css'
</style>
