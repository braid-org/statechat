var bus = require('statebus')()
var app = require('express')()

// Create the HTTP server
require('http')
    .createServer(app)
    .listen(3007, () => console.log('listening on 3007'))


// Serve files from disk
var send_file = (f) => (r, res) => res.sendFile(__dirname + '/' + f)
app.get('/',                send_file('client.html'))
app.get('/client.js',       send_file('client.js'))

app.get('/statebus.js',     send_file('node_modules/statebus/statebus.js'))
app.get('/statebus-lib.js', send_file('node_modules/statebus/clients.js'))
app.get('/braidify.js',     send_file('node_modules/statebus/node_modules/braidify/braidify-client.js'))


// Setup the statebus!
bus.honk = 1                // Print handy debugging output
bus.libs.file_store()       // Persist state onto disk


// Install a timer.
//
//    Or you could use
//    bus.libs.time()
//
var timeout
bus('time', {
    to_get: (cb) => {
        var f = () => cb.return(Date.now())
        timeout = setInterval(f, 1000)
        f()
    },
    to_forget: () => clearTimeout(timeout)
})
    
// Let's program some state!
bus('what-now', {
    to_get: () => bus.state.time,
    to_set: (val) => bus.state.yeep = val
})

// Serve other state from statebus
app.use(bus.libs.http_in)

// Other libs you might like:
// bus.libs.sqlite_store()
// bus.libs.pg_store()
// bus.libs.firebase_store()
// bus.libs.sqlite_query_server()
// bus.libs.sqlite_table_server()
// bus.libs.serve_email()


