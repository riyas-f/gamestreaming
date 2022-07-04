/* Global Variables */
let CONN, MY_PEER_ID, MY_SOCK_ID, PEER_ID

let RT, LT

let setID = document.getElementById('setID')

/* Socket Instance */
const socket = io('http://192.168.0.213:3000')

MY_PEER_ID = Math.floor(1000 + Math.random() * 9000);
setID.innerText = MY_PEER_ID
/* Peer Instance */
let peer = new Peer(MY_PEER_ID.toString(), {
    host: '192.168.0.213',
    port: 3000,
    path: '/peerjs'
})

/* Getting Peer ID */
peer.on('open', (id) => {
    console.log('MY PEER ID : ' + id)
})

/* Receive Message */
peer.on('connection', (conn) => {
    conn.on('data', (inputs) => {
        inputProcessor(inputs)
    })
})

/* This function will be updated in future */
const send = (x) => {
    CONN.send(x)
}

/* Socket Events */
socket.on('your-sock-id', (id) => {
    MY_SOCK_ID = id
    console.log('Socket ID : ' + MY_SOCK_ID)
})

/* This below code will goes to Software (step 2)*/
socket.on('request-to-connect', (pin) => {
    if(pin.software_id === MY_PEER_ID.toString()){
        console.log('Call requested from : ' + JSON.stringify(pin));
        peer.connect(pin.peer_id)

        CONN = peer.connect(pin.peer_id.toString())
        CONN.on('open', () => {
            CONN.send('Connection Accepted & Stream is on the way !')
            PEER_ID = pin.peer_id.toString()

            navigator.mediaDevices.getUserMedia({video: 
                {
                    mandatory: {              
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: 'screen:0:0'
                    },
                    cursor: 'never'
                }, 
                audio: {
                    mandatory: {
                        chromeMediaSource: 'desktop'
                    }
                }
                })
            .then(stream => {
                let call = peer.call(PEER_ID, stream)
                console.log('Stream Initiated');
            })
            .catch(e => console.log(e))
        })
    }
})

/* Function to process user inputs */
const inputProcessor = (inputs) => {
    switch(inputs.type){
        case 'mouse-move':
            eel.MOUSE_MOVE(inputs.x, inputs.y)
            break
        case 'touch-move':
            eel.MOUSE_MOVE(inputs.x, inputs.y)
            break
        case 'double-click':
            eel.DOUBLE_CLICK(inputs.x, inputs.y)
            break
        case 'single-click':
            eel.SINGLE_CLICK() 
            break   
        case 'left-press':
            eel.LEFT_PRESS()
            break
        case 'left-release':
            eel.LEFT_RELEASE()
            break
        case 'letter':
            eel.TYPEWRITER(inputs.letter)
            break
        case 'spacebar':
            eel.SPACE()
            break
        case 'backspace':
            eel.BACKSPACE()
            break
        case 'enter':
            eel.ENTER()
            break
        case 'shift':
            eel.SHIFT()
            break
        case 'tab':
            eel.TAB()
            break
        case 'JOYPAD-LS-FRONT':
            eel.JOYPAD_LS_FRONT()
            break
        case 'JOYPAD-LS-LEFT':
            eel.JOYPAD_LS_LEFT()
            break
        case 'JOYPAD-LS-RIGHT':
            eel.JOYPAD_LS_RIGHT()
            break
        case 'JOYPAD-LS-BACK':
            eel.JOYPAD_LS_BACK()
            break
        case 'JOYPAD-RS-FRONT':
            eel.JOYPAD_RS_FRONT()
            break
        case 'JOYPAD-RS-UP-LEFT':
            eel.JOYPAD_RS_UP_LEFT()
            break
        case 'JOYPAD-RS-LEFT':
            eel.JOYPAD_RS_LEFT()
            break
        case 'JOYPAD-RS-DOWN-LEFT':
            eel.JOYPAD_RS_DOWN_LEFT()
            break
        case 'JOYPAD-RS-BACK':
            eel.JOYPAD_RS_BACK()
            break
        case 'JOYPAD-RS-DOWN-RIGHT':
            eel.JOYPAD_RS_DOWN_RIGHT()
            break
        case 'JOYPAD-RS-RIGHT':
            eel.JOYPAD_RS_RIGHT()
            break
        case 'JOYPAD-RS-UP-RIGHT':
            eel.JOYPAD_RS_UP_RIGHT()
            break
        case 'JOYPAD-LEFT-HOLD':
            eel.JOYPAD_LEFT_HOLD()
            break
        case 'JOYPAD-RIGHT-HOLD':
            eel.JOYPAD_RIGHT_HOLD()
            break
        /* X Function */
        case 'JOYPAD-X-CLICK':
            eel.JOYPAD_X_CLICK()
            break
        case 'JOYPAD-X-LONG':
            eel.JOYPAD_X_LONG()
            break
        /* Y Function */
        case 'JOYPAD-Y-CLICK':
            eel.JOYPAD_Y_CLICK()
            break
        case 'JOYPAD-Y-LONG':
            eel.JOYPAD_Y_LONG()
            break
        /* A Function */
        case 'JOYPAD-A-CLICK':
            eel.JOYPAD_A_CLICK()
            break
        case 'JOYPAD-A-LONG':
            eel.JOYPAD_A_LONG()
            break
        /* B Function */
        case 'JOYPAD-B-CLICK':
            eel.JOYPAD_B_CLICK()
            break
        case 'JOYPAD-B-LONG':
            eel.JOYPAD_B_LONG()
            break
        /* Arrow Function */
        case 'JOYPAD-UP-CLICK':
            eel.JOYPAD_UP_CLICK()
            break
        case 'JOYPAD-DOWN-CLICK':
            eel.JOYPAD_DOWN_CLICK()
            break
        case 'JOYPAD-LEFT-CLICK':
            eel.JOYPAD_LEFT_CLICK()
            break
        case 'JOYPAD-RIGHT-CLICK':
            eel.JOYPAD_RIGHT_CLICK()
            break
        /* Left & Right Function */
        case 'JOYPAD-START':
            eel.JOYPAD_START()
            break
        case 'JOYPAD-BACK':
            eel.JOYPAD_BACK()
            break
        case 'JOYPAD-LB-CLICK':
            eel.JOYPAD_LB_CLICK()
            break
        case 'JOYPAD-LB-LONG':
            eel.JOYPAD_LB_LONG()
            break
        case 'JOYPAD-LT-CLICK':
            eel.JOYPAD_LT_CLICK()
            clearInterval(RT)
            clearInterval(LT)
            break
        case 'JOYPAD-LT-LONG':
            LT = setInterval(() => {
                eel.JOYPAD_LT_LONG()
            }, 200)
            break
        case 'JOYPAD-RB-CLICK':
            eel.JOYPAD_RB_CLICK()
            break
        case 'JOYPAD-RB-LONG':
            eel.JOYPAD_RB_LONG()
            break
        case 'JOYPAD-RT-CLICK':
            eel.JOYPAD_RT_CLICK()
            clearInterval(LT)
            clearInterval(RT)
            break
        case 'JOYPAD-RT-LONG':
            RT = setInterval(() => {
                eel.JOYPAD_RT_LONG()
            }, 200)
            break
    }
}