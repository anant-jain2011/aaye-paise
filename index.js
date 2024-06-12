const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

const mongoURI = 'mongodb+srv://Yo_Cool:W-qzhJMpxRJ*5dk@mycluster.xqr8l6g.mongodb.net/AayePaise';

Mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

const blockSchema = new Mongoose.Schema({
    // amount: Number,
    message: { type: String },
}, {
    timestamps: true
});

const Block = new Mongoose.model("Block", blockSchema);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://aayepaise.vercel.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

let clients = [];

function sendToClients(message) {
    clients.forEach(client =>
        client.write("data:" + JSON.stringify(message) + "\n\n")
    );
}

app.post("/", async (req, res) => {
    const newBlock = await new Block(req.body);
    newBlock.save();
    sendToClients(req.body);
    res.json({ msg: "Added Successfully" }).status(200);
});

app.get("/main", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', 'https://aayepaise.vercel.app');

    res.flushHeaders();

    clients.push(res);

    // Handle client disconnections
    req.on('close', () => {
        const index = clients.indexOf(res);

        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});

app.get("/getblocks", async (req, res) => {
    const allBlocks = await Block.find();
    res.json(allBlocks).status(200);
});

app.listen(3000, () => {
    console.log("Server Started");
});