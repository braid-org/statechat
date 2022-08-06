var bus = require('statebus')({
    client: (client) => {
        client.honk = 1
        console.log('client loaded!')

        client('secret', {
            get: () => {
                if (client.state.current_user.logged_in)
                    return 'yes'
                else
                    return 'no'
            }
        })

        client.shadows(bus)
    }
})
var app = require('express')()

// Create the HTTP server
require('http')
    .createServer(app)
    .listen(3007, () => console.log('listening on 3007'))


// Serve files from disk
var send_file = (f) => (r, res) => res.sendFile(__dirname + '/' + f)
app.get('/',             send_file('client.html'))
app.get('/coff',         send_file('client-coffee.html'))
app.get('/client.js',    send_file('client.js'))

// Serve libraries
app.get('/statebus.js',  send_file('node_modules/statebus/statebus.js'))
app.get('/statebus-client-library.js',
                         send_file('node_modules/statebus/client-library.js'))
app.get('/braidify.js',  send_file('node_modules/braidify/braidify-client.js'))


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
    get: (t) => {
        var f = () => t.done(Date.now())
        timeout = setInterval(f, 1000)
        f()
    },
    forget: () => clearTimeout(timeout)   // Unsubscribe
})
    
// Let's program some state!
bus('what-now', {
    get: () => bus.state.time,
    set: (val) => bus.state.yeep = val
})


// Here's a value that's always 2+ another number
bus.state.counter = 0

bus('two-plus', {
    get: () => bus.state.counter + 2,
    set: (val) => bus.state.counter = val - 2
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


