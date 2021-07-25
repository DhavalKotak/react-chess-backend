const app = require('express')()
const { v4: uuidv4 } = require('uuid')
const http = require('http').Server(app)
const PORT = process.env.PORT || 4000

//setting up the configuration for socket
const io = require('socket.io')(http, {
	cors: {
	  origin: "https://dhavalkotak.github.io",
	  methods: ["GET", "POST"],
	  credentials: false
	}
  })
const cors = require('cors')
app.use(cors())

io.on('connection' , socket => {
	console.log("user connected: " + socket.id)
	//sending uuids for gameID to create rooms
	socket.on('createRoom', id => {
		if(id === ""){
			id = uuidv4()
			socket.emit('generateId',id)
			console.log(id)
		}
	})
	//creating the room and adding the player to the room
	socket.on('join', gameID => {
		if(gameID){
			socket.join(gameID)
			console.log("user joined "+gameID)
		}
	})
	//sending the updated board
	socket.on('move' ,async (gameId,board) => {
		//flipping the board by subtracting the coordinates from the highest coordinates
		board.forEach((piece) => {
			piece.x = 7 - piece.x
			piece.y = 7 - piece.y
		})
		const newBoard = await board
		socket.to(gameId).emit('updateBoard' , newBoard)
	})
})

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
