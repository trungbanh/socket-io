const express = require('express')
const http = require('http')
const socket = require('socket.io')

const app = express()
let server = http.Server(app)
const io = socket(server)

let clients = 0 
app.get('/',(req,res) => {
  res.sendfile(__dirname+'/view/index.html')
})
io.on('connection',(socket)=> {

  clients++
  console.log("a user connect");
  socket.emit('newClient',{message:"hello guy"})
  socket.broadcast.emit("newClient",{message: clients +" connected"})
  socket.on('disconnect',()=>{
    clients--
    socket.broadcast.emit("newClient",{message: clients +" connected"})
    console.log('user is disconnect');
  })
})

app.get('/name',(req,res)=> {
  res.sendfile(__dirname+'/view/namespace.html')
})
let namespace = io.of('/my-namespace')
namespace.on('connection', (socket)=> {
  console.log('name space connect');
  namespace.emit('hi','hello everyone')
})

app.get('/chat',(req,res)=> {
  res.sendFile(__dirname+'/view/index.html')
})

//room 
app.get('/room',(req,res)=>{
  res.sendfile(__dirname+'/view/room.html')
})
let roomno = 1 ;
io.on('connection',(socket)=>{
  if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1){
    roomno++;
  }
  socket.join('room-'+roomno)
  io.sockets.in('room-'+roomno).emit('connectToRoom',"You are in room no. "+roomno)
  socket.leave('room-1')
})

server.listen(4111,()=> {
  console.log('server use port 4111');
})