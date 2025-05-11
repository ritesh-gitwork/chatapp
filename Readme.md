
# Chat Application

## Overview
This is a real-time chat application built using ReactJS, NodeJS, Express, and MongoDB. The app supports one-on-one chats, group chats, and allows users to communicate seamlessly in a secure environment. The front end is powered by React, while the back end is handled by Node.js and Express. MongoDB is used for storing chat data. 

The application also features:
- **One-on-One Chats**: Private messaging between two users.
- **Group Chats**: Multiple users can chat in shared rooms.

## Features
- **Real-time Messaging**: Send and receive messages in real time with no delays.
- **One-on-One Chats**: Secure, private conversations between two users.
- **Group Chats**: Create or join group chats with multiple users.
- **User Authentication**: User authentication and authorization using JWT tokens.
- **Responsive UI**: Works on both desktop and mobile devices.
- **Chat Notifications**: Real-time notifications for new messages.
- **Message Persistence**: All chat history is stored securely in MongoDB.

## Technologies Used
- **Frontend**: ReactJS , Chakra UI
- **Backend**: NodeJS, Express
- **Database**: MongoDB
- **WebSocket**: Socket.IO for real-time communication

## Getting Started

### Prerequisites
Make sure you have the following installed:
- **Node.js** (version >= 14.x)
- **MongoDB** (local or cloud instance)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/navneetshahi14/ChatApplication.git
   cd chat-application
   ```

2. Install dependencies for both frontend and backend:

   For the backend:
   ```bash
   cd server
   npm install
   ```

   For the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Create a `.env` file in the backend directory and add the following environment variables:
   ```env
   MONGO_URI=<your-mongo-db-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Start the development servers:
   - **Backend**: 
     ```bash
     cd server
     nodemon
     ```

   - **Frontend**: 
     ```bash
     cd frontend
     npm start
     ```

### Usage
- Open your browser and go to `http://localhost:3000` to access the chat application.
- Register a new account or log in with an existing account.
- Start a one-on-one chat or create/join a group chat.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.


