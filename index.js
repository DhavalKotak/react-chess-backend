const app = require('express')()
const { v4: uuidv4 } = require('uuid')
const http = require('http').createServer(app)
const PORT = process.env.PORT || 4000
const io = require('socket.io')(http, {
	cors: {
	  origin: "https://dhavalkotak.github.io/chess",
	  methods: ["GET", "POST"],
	  credentials: false
	}
  })
const cors = require('cors')
app.use(cors())
io.on('connection' , socket => {
	console.log("user connected: " + socket.id)
	socket.on('createRoom', id => {
		if(id === ""){
			id = uuidv4()
			socket.emit('generateId',id)
			console.log(id)
		}
	})
	socket.on('join', gameId => {
		if(gameId){
			socket.join(gameId)
			console.log("user joined "+gameId)
		}
	})
	socket.on('move' ,(gameId,board) => {
		socket.to(gameId).emit('updateBoard' , board)
	})
})
http.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
