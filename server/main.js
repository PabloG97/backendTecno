var io = require('socket.io').listen(3000)
var mysql = require('mysql')

var db = mysql.createConnection({
    host: '18.212.104.18',
    user: 'user',
    password: '12345',
    database: 'SistemaRiego'
})

mysqlConnection.connect(function(err) {
    if (err) console.log(err)
})

var notes = []
var isInitNotes = false
var socketCount = 0

io.sockets.on('connection', function(socket) {
    // Socket has connected, increase socket count
    socketCount++
    // Let all sockets know how many are connected
    io.sockets.emit('users connected', socketCount)

    socket.on('disconnect', function() {
        // Decrease the socket count on a disconnect, emit
        socketCount--
        io.sockets.emit('users connected', socketCount)
    })

    socket.on('new note', function(data) {
        // New note added, push to all sockets and insert into db
        notes.push(data)
        io.sockets.emit('new note', data)
            // Use node's db injection format to filter incoming data
        db.query('INSERT INTO `SistemaRiego`.`registros` (`valor`, NOW()) VALUES (?);', data.note)
    })

    // Check to see if initial query/notes are set
    if (!isInitNotes) {
        // Initial app start, run db query
        db.query('SELECT * FROM registros')
            .on('result', function(data) {
                // Push results onto the notes array
                notes.push(data)
            })
            .on('end', function() {
                // Only emit notes after query has been completed
                socket.emit('initial notes', notes)
            })

        isInitNotes = true
    } else {
        // Initial notes already exist, send out
        socket.emit('initial notes', notes)
    }
})