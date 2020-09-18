const express = require('express');
const http = require("http");
const WebSocket = require("ws");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


const mysqlConnection = require('./database')

//Settings
/* app.set('port', process.env.PORT || 3000); */

//Middlewares
app.use(express.json());


// Routes
app.use(require('./routes/datos'));


// Starting server
app.listen(app.get('port'), () => {
    console.log('server 3000');
});
mysqlConnection.connect(function(err) {
    if (err) console.log(err)
})

wss.on('connection', (ws) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
        mysqlConnection.query("INSERT INTO `SistemaRiego`.`registros` (`valor`, `fechaHora`) VALUES (?,NOW());", [message], (err, rows, fields) => {
            if (!err) {
                //res.json({ Status: 'Dato agregado exitosamente.' });
                console.log("Dato agregado exitosamente.")
            } else {
                console.log(err);
            }
        })
    });
    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});
server.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port  :)`);
});