const fs = require("fs")
const { Server } = require("socket.io")

const io = new Server({
  cors: {
    origin: "*",
  },
})

io.on("connection", (socket) => {
  socket.on("send_json", (info) => {
    const messages_path = "./messages.json"
    const messages = JSON.parse(fs.readFileSync(messages_path))

    socket.broadcast.emit("json_response", messages.concat(info))
    fs.writeFileSync("./messages.json", JSON.stringify(messages.concat(info)))

    console.log(JSON.stringify(messages.concat(info)))
    console.log(`writing to: './messages.json'`)
  })

  socket.on("receive_json", () => {
    const messages_path = "./messages.json"
    const messages = require(messages_path)
    socket.emit("json_response", messages)
  })
})

io.listen(process.env.PORT || 3000)
