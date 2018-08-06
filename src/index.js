const express = require('express')
const http = require('http')
const socket = require('socket.io')

const app = express()
let server = http.Server(app)
const io = socket(server)

app.get('/',(req,res) => {
  res.send("<h1> okey baybe</h1>")
})

app.get('/chat',(req,res)=> {
  res.sendFile(__dirname+'/view/index.html')
})

io.on('connection',(socket)=> {

  console.log("a user connect");
  socket.broadcast.emit('hihi')

  socket.on('chat message',(msg)=> {
    console.log("message "+msg);
    io.emit('chat message',msg)
  })


  socket.on('disconnect',()=>{
    console.log('user is disconnect');
  })
})

server.listen(4111,()=> {
  console.log('server use port 4111');
})