const express = require('express')
const app = express()

const dotenv = require("dotenv"); 
dotenv.config(); 

const PORT = process.env.PORT || 3030
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}\n`))

const messages = [
    {
        channel: "1",
        account: "0x1b3cB81E51011b549d78bf720b0d924ac763A7C2",
        text: "Hello everyone!"
    },
    {
        channel: "2",
        account: "0x1b3cB81E51011b549d78bf720b0d924ac763A7C2",
        text: "Hey there! My name is Ann and I'm an aspiring blockchain developer!"
    },
    {
        channel: "1",
        account: "0x701C484bfb40ac628aFA487b6082f084B14AF0BD",
        text: "Hey everyone!"
    },
    {
        channel: "1",
        account: "0x189B9cBd4AfF470aF2C0102f365FC1823d857965",
        text: "Hey there, great to be here!"
    },
    {
        channel: "1",
        account: "0x176F3DAb24a159341c0509bB36B833E7fdd0a132",
        text: "Hope everyone is having a good day ;)"
    },
]

const accounts = [
    {
        account: "0x1b3cB81E51011b549d78bf720b0d924ac763A7C2", 
        points: 2
    }, 
    {
        account: "0x701C484bfb40ac628aFA487b6082f084B14AF0BD", 
        points: 3
    }, 
    {
        account: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", 
        points: 4
    }, 
    {
        account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 
        points: 4
    }, 
    {
        account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 
        points: 4
    }

]

const config = {
    apiUrl: process.env.ALCHEMY_API_KEY, 
    privateKey: process.env.LOCALNETWORK_PRIVATE_KEY
}

// const response = JSON.stringify({config});
// const response = JSON.stringify(config); 
const response = {
    "This is one": "yes it is", 
    "This is two": "yes it is"
}

app.get("/config", (req, res) => {
    res.json(response)
})

const { Server } = require("socket.io"); 

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})

app.get("/", (req, res) => {
    res.render("index", { config })
})

io.on('connection', (socket) => {
    console.log("A user connected")

    socket.on('get messages', () => {
        io.emit('get messages', messages)
    })

    socket.on('get points', () => {
        io.emit('get points', accounts)
    })

    socket.on('new message', (msg) => {
        messages.push(msg) 
        io.emit('new message', messages)
    })
})