const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const Register=require('../src/models/schema')
const conn=require('../src/conn/conn');

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const user = {};

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on('new-user-joined', (name) => {
    console.log('new-user ', name);
    user[socket.id] = name;
    console.log(`socket id ${user[socket.id]}`);

    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message) => {
    console.log('yesssssssssss');
    const userName = user[socket.id]; // Access the user's name
    
    if (userName) {

     socket.broadcast.emit('receive', { message: message, name: userName });

    } else {
      console.log('User not found for socket ID:', socket.id);
    }
  });
  socket.on("disconnect", (reason) => {
    console.log(' A  user was dissconnected due to bad connection')
 console.log(reason)
   });
  

});

app.post('/data', async (req, res) => {
  if (!req.body.message) {
    return res.status(400).send('Data not added');
  } else {
    try {
      const storeData = new Register({ messages: req.body.message }); // Pass an object with the 'messages' property
      await storeData.save();
      return res.status(200).json('Data successfully added');
    } catch (error) {
      console.error('Error storing data:', error);
      return res.status(500).send('Error storing data');
    }
  }

});
app.get('/getdata', async (req, res) => {
  
    try {
      const data=await Register.find();
      console.log(data)     
      return res.send(data)
    } catch (error) {
      console.error('Error storing data:', error);
      return res.status(500).send('Error storing data');
    }
  

});






server.listen(4000, () => console.log('Server is running on port 4000'));
