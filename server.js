/*
  Simple server for Faculty-Student Interaction Portal
  (Student version - basic demo)
  Author: [Your Name]
  Note: This is a minimal demo. Need to add auth, DB, validation later.
*/

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// basic route
app.get('/', (req, res) => {
  res.send('Hello! Faculty-Student Portal API running. - (student demo)');
});

// Very simple in-memory messages store (for demo only)
const messages = {};

// Socket.io simple chat demo
io.on('connection', (socket) => {
  console.log('a user connected ->', socket.id);

  socket.on('joinCourse', (courseId) => {
    const room = `course_${courseId}`;
    socket.join(room);
    // send previous messages (if any)
    socket.emit('chatHistory', messages[room] || []);
  });

  socket.on('sendMessage', (data) => {
    const room = `course_${data.courseId}`;
    // save in-memory
    if (!messages[room]) messages[room] = [];
    messages[room].push({ sender: data.sender || 'Anon', content: data.content, time: Date.now() });
    // broadcast
    io.to(room).emit('newMessage', { sender: data.sender || 'Anon', content: data.content, time: Date.now() });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected ->', socket.id);
  });
});

// TODO: replace in-memory store with DB (Postgres), add auth, permissions
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
