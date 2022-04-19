// Setup the bus
bus.libs.http_out('/*', '/')
bus.libs.localstorage('ls/*')
var state = bus.state

// Helpers
var Input = bus.libs.input
var textbox = () => document.getElementById('textbox')


// ***** React Components *****

var Chat = bus.libs.react_class({
    render: () => {
        var send = () => {
            if (!state['ls/me']) return false

            // Append a message to the end of the `messages` array
            state['/messages'] = state['/messages'] || []
            state['/messages'].push({ from: state['ls/me'], body: textbox().value })

            // Clear the input
            textbox().value = ''
        }
        var enter_send = (e) => (e.keyCode === 13) && send()

        return (
          <div style={chat_css}>
            <div style={{textAlign: 'right'}}>
              We shall call you:
              <Input key="input"
                     style={{marginLeft: 10, width: 80}}
                     onChange={e => state['ls/me'] = e.target.value}
                     value={state['ls/me'] || ''} />
            </div>
            {(state['/messages'] || []).map((msg, i) => (
                <div style={message_css} key={i}>
                    <span style={sender_css}>{msg.from}</span>:
                    <span style={msg_text_css}>{msg.body}</span>
                </div>
            ))}

           <span style={my_name_css}> {state['ls/me']}: </span>
           <input id='textbox'
                  onKeyUp={enter_send}
                  style={{width:395}}
                  disabled={!state['ls/me']} />
           <button onClick={send} style={{width: 50}} disabled={!state['ls/me']}>
             Send
           </button>
        </div>
        )
    }
})


// ***** CSS *****

var chat_css = {
    margin: 20,
    width: 500
}

var name_css = {
    
}

var message_css = {
    padding: 5,
    margin: '5 0',
    backgroundColor: '#eee'
}

var sender_css = {
    fontWeight: 700
}

var msg_text_css = {
    marginLeft: 5
}

var my_name_css = {
    width: 40,
    display: 'inline-block',
    fontWeight: 'bold',
    padding: 5
}

// **** Mount React

// React <= v17
if (React.version.split('.')[0] <= '17')
    ReactDOM.render(<Chat/>, document.getElementById('root'))

// React v18
else ReactDOM.createRoot(document.getElementById('root')).render(<Chat/>)

