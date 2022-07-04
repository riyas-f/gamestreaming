/* Global Variables */
let CONN, 
MY_PEER_ID, 
MY_SOCK_ID, 
display, 
keyboardView = false, 
keyboardLayout = 'numeric', 
keys, 
keyControls = true,
joypadControls = true,
joypadView = false,
outlineLeft,
stickLeft,
outlineRight,
stickRight,
LeftTouch = 0
RightTouch = 1

let connect = document.getElementById('connect')
let easy_access = document.getElementById('easy-access')
let keyboard_access = document.getElementById('keyboard-access')
let joypad_access = document.getElementById('joypad-access')

/* Socket Instance */
const socket = io('http://192.168.0.213:3000')

MY_PEER_ID = Math.floor(1000 + Math.random() * 9000);
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

/* Connect function (step 1) */
connect.addEventListener('click', () => {
    let software_id = document.getElementById('software-id').value
    let id_set = {
        software_id: software_id, 
        peer_id: MY_PEER_ID, 
        socket_id: MY_SOCK_ID
    }
    socket.emit('connect-request', id_set)
    
    CONN = peer.connect(software_id)
    CONN.on('open', () => {
        CONN.send('Connection Accepted !')
    })
})

/* Receive Message */
peer.on('connection', (conn) => {
    conn.on('data', (msg) => {
        console.log(msg)
    })
})

/* Receive media call and starts stream (step 3)*/
peer.on('call', (call) => {
    call.answer(null)
    call.on('stream', (stream) => {
        let input_box = document.getElementById('input-box')
        input_box.remove()

        let video = document.createElement('video')
        video.id = 'display'
        document.body.appendChild(video)

        display = document.getElementById('display')
        display.style.width = window.innerWidth + 'px'
        display.style.height = window.innerHeight + 'px'
        display.srcObject = stream
        display.controls = false
        display.play()

        easy_access.style.visibility = 'visible'

        var resolution = {
            type: 'device-resolution',
            width: window.innerWidth,
            height: window.innerHeight
        }
        CONN.send(resolution)
    })
})

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

            navigator.mediaDevices.getDisplayMedia({video: true, audio: true})
            .then(stream => {
                let call = peer.call(pin.peer_id.toString(), stream)
            })
            .catch(e => console.log(e))
        })
    }
})

/* Screen Auto Resize function */
window.addEventListener('resize', () => {
    display.style.width = window.innerWidth + 'px'
    display.style.height = window.innerHeight + 'px'
})

/* Mouse Event Listener */
window.addEventListener('mousemove', (e) => {
    if(keyboardView == false && joypadView == false){
        var posX = display.offsetLeft
        var posY = display.offsetTop
        var tempX = (e.pageX - posX) / window.innerWidth * 100 
        var tempY = (e.pageY - posY) / window.innerHeight * 100
    
        var mouse_move = {
            type: 'mouse-move',
            x: tempX,
            y: tempY
        }
        CONN.send(mouse_move)
    }
})

/* Touch Event Listener */
window.addEventListener('touchmove', (e) => {
    if(keyboardView == false && joypadView == false){
        clearTimeout(LongTouchTimer)
        TouchLongPress = false
    
        var posX = display.offsetLeft
        var posY = display.offsetTop
        var tempX = (e.touches[0].pageX - posX) / window.innerWidth * 100 
        var tempY = (e.touches[0].pageY - posY) / window.innerHeight * 100
    
        var touch_move = {
            type: 'touch-move',
            x: tempX,
            y: tempY
        }
        CONN.send(touch_move)
    }
})

/* Double Touch click event */
let doubleTouch = 0
let doubleTouchTimer, LongTouchTimer

window.addEventListener('touchstart', (e) => {
    if(keyboardView == false && joypadView == false){

        doubleTouchTimer = setTimeout(() => {
            doubleTouch = 0
            clearTimeout(doubleTouchTimer)
        }, 300)
        doubleTouch++
    
        if(doubleTouch == 2){
            console.log('Double Click')
            clearTimeout(doubleTouchTimer)
            clearTimeout(LongTouchTimer)
    
            var posX = display.offsetLeft
            var posY = display.offsetTop
            var tempX = (e.touches[0].pageX - posX) / window.innerWidth * 100 
            var tempY = (e.touches[0].pageY - posY) / window.innerHeight * 100
        
            var double_click = {
                type: 'double-click',
                x: tempX,
                y: tempY
            }
            CONN.send(double_click)
        }
    
        LongTouchTimer = setTimeout(() => {
            clearTimeout(LongTouchTimer)
                var left_press = {
                    type: 'left-press'
                }
                var ai = document.createElement('span')
                ai.innerText = 'Drag Enabled'
                ai.id = 'AI'
                document.body.append(ai)
                CONN.send(left_press)
        }, 1000)
    }
})

/* Function to handle touch clicks */
window.addEventListener('touchend', (e) => {
    if(keyboardView == false && joypadView == false){
        clearInterval(LongTouchTimer)
        
        var left_release = {
            type: 'left-release'
        }
    
        document.getElementById('AI').innerText = 'Drag Disabled'
        var temp = setTimeout(() => {
            clearTimeout(temp)
            document.getElementById('AI').remove()
        }, 300)
    
        CONN.send(left_release)
        console.log('Left long press released')
    }
})


easy_access.addEventListener('touchmove', (e) => {
    easy_access.style.left = e.touches[0].pageX + 'px'
})

/*---------------------------------------------------------------------------------------------------- */
                                /* Keyboard Design/Functionalities */
/*---------------------------------------------------------------------------------------------------- */

/* Keyboard Layout Keys */
let Layout = [
    {id:0, numeric:'`', symbol:'~'},
    {id:1, numeric:'1', symbol: '!'},
    {id:2, numeric:'2', symbol:'@'},
    {id:3, numeric:'3', symbol:'#'},
    {id:4, numeric:'4', symbol:'$'},
    {id:5, numeric:'5', symbol:'%'},
    {id:6, numeric:'6', symbol:'^'},
    {id:7, numeric:'7', symbol:'&'},
    {id:8, numeric:'8', symbol:'*'},
    {id:9, numeric:'9', symbol:'('},
    {id:10, numeric:'0', symbol:')'},
    {id:11, numeric:'-', symbol:'_'},
    {id:12, numeric:'=', symbol:'+'},
    {id:23, numeric:'[', symbol:'{'},
    {id:24, numeric:']', symbol:'}'},
    {id:25, numeric:'\\', symbol:'|'},
    {id:36, numeric:';', symbol:':'},
    {id:37, numeric:"'", symbol:'"'},
    {id:46, numeric:',', symbol:'<'},
    {id:47, numeric:'.', symbol:'>'},
    {id:48, numeric:'/', symbol:'?'},
]

const showKeyboard = () => {
    if(keyControls){
        console.log('keyControls');
        let vKeys = `
        <div class="keyLayers">
        <div class="keys">${'`'}</div>
        <div class="keys">1</div>
        <div class="keys">2</div>
        <div class="keys">3</div>
        <div class="keys">4</div>
        <div class="keys">5</div>
        <div class="keys">6</div>
        <div class="keys">7</div>
        <div class="keys">8</div>
        <div class="keys">9</div>
        <div class="keys">0</div>
        <div class="keys">-</div>
        <div class="keys">=</div>
        </div>
        <div class="keyLayers">
        <div class="keys">q</div>
        <div class="keys">w</div>
        <div class="keys">e</div>
        <div class="keys">r</div>
        <div class="keys">t</div>
        <div class="keys">y</div>
        <div class="keys">u</div>
        <div class="keys">i</div>
        <div class="keys">o</div>
        <div class="keys">p</div>
        <div class="keys">[</div>
        <div class="keys">]</div>
        <div class="keys">\</div>
        </div>
        <div class="keyLayers">
        <div class="keys" onclick="updateLayout()">Shift</div>
        <div class="keys">a</div>
        <div class="keys">s</div>
        <div class="keys">d</div>
        <div class="keys">f</div>
        <div class="keys">g</div>
        <div class="keys">h</div>
        <div class="keys">j</div>
        <div class="keys">k</div>
        <div class="keys">l</div>
        <div class="keys">;</div>
        <div class="keys">'</div>
        <div class="keys">Backspace</div>
        </div>
        <div class="keyLayers">
        <div class="keys">z</div>
        <div class="keys">x</div>
        <div class="keys">c</div>
        <div class="keys">v</div>
        <div class="keys">b</div>
        <div class="keys">n</div>
        <div class="keys">m</div>
        <div class="keys">,</div>
        <div class="keys">.</div>
        <div class="keys">/</div>
        </div>
        <div class="keyLayers">
        <div class="keys">Tab</div>
        <div class="keys">Spacebar</div>
        <div class="keys">Enter</div>
        </div>`

    var vKeyboard = document.createElement('div')
    vKeyboard.className = 'keyboard'
    vKeyboard.id = 'keyboard'
    vKeyboard.innerHTML = vKeys
    document.body.append(vKeyboard)

    keys = document.querySelectorAll('.keys')

    keys.forEach(button => {
        button.addEventListener('click', () => {
            sendKeys(button.innerHTML)
        })
    })
    keyControls = false
    }
    else {
        keyboardView = false
        document.getElementById('keyboard').remove()
        keyControls = true
    }
}

/* Function to change keyboard layout */
const updateLayout = () => {
    if(keyboardLayout == 'numeric'){
        keyboardLayout = 'symbol'
        for(i=0; i<keys.length; i++){
            var tempKey = keys[i].innerHTML
            if(tempKey != 'Backspace' 
                && tempKey != 'Tab' 
                && tempKey != 'Enter'
                && tempKey != 'Shift'
                && tempKey != 'Spacebar'){
                keys[i].innerHTML = keys[i].innerHTML.toLowerCase()
            }

            for(j=0; j<Layout.length; j++){
                if(i == Layout[j].id){
                    keys[i].innerHTML = Layout[j].symbol
                }
            }
        }
    }
    else if(keyboardLayout == 'symbol'){
        keyboardLayout = 'numeric'
        for(i=0; i<keys.length; i++){
            var tempKey = keys[i].innerHTML
            if(tempKey != 'Backspace' 
                && tempKey != 'Tab' 
                && tempKey != 'Enter'
                && tempKey !== 'Shift'
                && tempKey != 'Spacebar'){
                keys[i].innerHTML = keys[i].innerHTML.toUpperCase()
            }

            for(j=0; j<Layout.length; j++){
                if(i == Layout[j].id){
                    keys[i].innerHTML = Layout[j].numeric
                }
            }
        }
    }
}

/* Keyboard pop up event */
keyboard_access.addEventListener('click', () => {
    keyboardView = true
    showKeyboard()
})

/* Function send key inputs */
const sendKeys = (char) => {
    switch(char){
        case 'Backspace':
            CONN.send({type: 'backspace'})
            break
        case 'Spacebar':
            CONN.send({type: 'spacebar'})
            break
        case 'Shift':
            CONN.send({type: 'shift'})
            break
        case 'Enter':
            CONN.send({type: 'enter'})
            break
        case 'Tab':
            CONN.send({type: 'tab'})
        default:
            CONN.send({type: 'letter', letter: char})
    }
}


/*---------------------------------------------------------------------------------------------------- */
                                /* Joypad Design/Functionalities Experimental*/
/*---------------------------------------------------------------------------------------------------- */

/* Function to get Joypad UI */
joypad_access.addEventListener('click', () => {

    let vLS = `<div class="left-stick" id="left-stick"></div>`
    let vRS = `<div class="right-stick" id="right-stick"></div>` 
    let leftArrows = `
        <div class="arrow-top-row">
            <div class="up-arrow" id="UP"></div>
        </div>
        <div class="arrow-middle-row">
            <div class="left-arrow" id="LEFT"></div>
            <div class="right-arrow" id="RIGHT"></div>
        </div>
        <div class="arrow-bottom-row">
            <div class="down-arrow" id="DOWN"></div>
        </div>`
    let rightButtons = `
        <div class="button-top-row">
            <div class="button-y" id="Y">Y</div>
        </div>
        <div class="button-middle-row">
            <div class="button-x" id="X">X</div>
            <div class="button-b" id="B">B</div>
        </div>
        <div class="button-bottom-row">
            <div class="button-a" id="A">A</div>
        </div>`
    let leftBox = `
        <div class="back-row">
            <div class="back" id="BACK">BACK</div>
        </div>
        <div class="lb-row">
            <div class="lb" id="LB">LB</div>
        </div>
        <div class="lt-row">
            <div class="lt" id="LT">LT</div>
        </div>`

    let rightBox = `
        <div class="start-row">
            <div class="start" id="START">START</div>
        </div>
        <div class="rb-row">
            <div class="rb" id="RB">RB</div>
        </div>
        <div class="rt-row">
            <div class="rt" id="RT">RT</div>
        </div>`

    console.log('joypadControlls');
    if(joypadControls){
        joypadView = true
        joypadControls = false

        /* Create's left joystick */
        let left_joystick = document.createElement('div')
        left_joystick.className = 'left-joystick-outline'
        left_joystick.id = 'left-joystick-outline'
        left_joystick.innerHTML = vLS
        document.body.append(left_joystick)

        /* Create's right joystick */
        let right_joystick = document.createElement('div')
        right_joystick.className = 'right-joystick-outline'
        right_joystick.id = 'right-joystick-outline'
        right_joystick.innerHTML = vRS
        document.body.append(right_joystick)

        /* Creates left arrow buttons */
        let left_arrow_buttons = document.createElement('div')
        left_arrow_buttons.className = 'arrows-container'
        left_arrow_buttons.id = 'left-arrow-buttons'
        left_arrow_buttons.innerHTML = leftArrows
        document.body.append(left_arrow_buttons)

        /* Create's right buttons */
        let right_buttons = document.createElement('div')
        right_buttons.className = 'buttons-container'
        right_buttons.id = 'right-round-buttons'
        right_buttons.innerHTML = rightButtons
        document.body.append(right_buttons)

        /* Create Left button cluster */
        let left_box = document.createElement('div')
        left_box.className = 'left-box'
        left_box.id = 'left-box-buttons'
        left_box.innerHTML = leftBox
        document.body.append(left_box)

        /* Create Right button cluster */
        let right_box = document.createElement('div')
        right_box.className = 'right-box'
        right_box.id = 'right-box-buttons'
        right_box.innerHTML = rightBox
        document.body.append(right_box)

        outlineLeft = document.getElementById('left-joystick-outline')
        stickLeft = document.getElementById('left-stick')
        outlineRight = document.getElementById('right-joystick-outline')
        stickRight = document.getElementById('right-stick')

        outlineLeft.addEventListener('touchstart', (e) => {
            if(e.touches.length == 1){
                LeftTouch = 0
                RightTouch = 1
            }
        })

        outlineRight.addEventListener('touchstart', (e) => {
            if(e.touches.length == 1){
                RightTouch = 0
                LeftTouch = 1
            }
        })

        /* Left joystick */
        outlineLeft.addEventListener('touchmove', (e) => {
            var posX = outlineLeft.offsetLeft
            var posY = outlineLeft.offsetTop
            var tempX = (e.touches[LeftTouch].pageX - posX) / outlineLeft.clientWidth * 100
            var tempY = (e.touches[LeftTouch].pageY - posY) / outlineLeft.clientHeight * 100
            var X = tempX / 100 * outlineLeft.clientWidth
            var Y = tempY / 100 * outlineLeft.clientHeight
            
            var w = outlineLeft.clientWidth / 2
            var h = outlineLeft.clientHeight / 2
            var deltaX = w - X
            var deltaY = h - Y
            var rad = Math.atan2(deltaX, deltaY)
            var left_angle = Math.round(rad * (180 / Math.PI))
            
            stickLeft.style.left = X + 'px'
            stickLeft.style.top = Y + 'px'
            stickLeft.style.transition = '.2s'
            
            console.log('Left Angle : ' + left_angle);
            LeftTrigger(left_angle)
        })

        outlineLeft.addEventListener('touchend', (e) => {
            stickLeft.style.left = '50%'
            stickLeft.style.top = '50%'
            stickLeft.style.transition = '.2s'
            CONN.send({type: 'JOYPAD-LEFT-HOLD'})
        })

        /* Right joystick */
        outlineRight.addEventListener('touchmove', (e) => {
            var posX = outlineRight.offsetLeft
            var posY = outlineRight.offsetTop
            var tempX = (e.touches[RightTouch].pageX - posX) / outlineRight.clientWidth * 100
            var tempY = (e.touches[RightTouch].pageY - posY) / outlineRight.clientHeight * 100
            var X = tempX / 100 * outlineRight.clientWidth
            var Y = tempY / 100 * outlineRight.clientHeight
            
            var w = outlineRight.clientWidth / 2
            var h = outlineRight.clientHeight / 2
            var deltaX = w - X
            var deltaY = h - Y
            var rad = Math.atan2(deltaX, deltaY)
            var right_angle = Math.round(rad * (180 / Math.PI))
            
            stickRight.style.left = X + 'px'
            stickRight.style.top = Y + 'px'
            stickRight.style.transition = '.2s'
            
            console.log('Right Angle : ' + right_angle);
            RightTrigger(right_angle)
        })

        outlineRight.addEventListener('touchend', (e) => {
            stickRight.style.left = '50%'
            stickRight.style.top = '50%'
            stickRight.style.transition = '.2s'
            CONN.send({type: 'JOYPAD-RIGHT-HOLD'})
        })

        /* XYAB button functions */
        var xdown
        /* x button click */
        document.getElementById('X').addEventListener('click', (e) => {
            clearTimeout(xdown)
            CONN.send({type: 'JOYPAD-X-CLICK'})
            console.log('x clicked');
        })
        /* x onpress */
        document.getElementById('X').addEventListener('touchstart', (e) => {
            xdown = setTimeout(() => {
                clearTimeout(xdown)
                CONN.send({type: 'JOYPAD-X-LONG'})
                console.log('x-pressed');
            }, 1000)
        })

        var ydown
        /* y button click */
        document.getElementById('Y').addEventListener('click', (e) => {
            clearTimeout(ydown)
            CONN.send({type: 'JOYPAD-Y-CLICK'})
            console.log('y clicked');
        })
        /* y onpress */
        document.getElementById('Y').addEventListener('touchstart', (e) => {
            ydown = setTimeout(() => {
                clearTimeout(ydown)
                CONN.send({type: 'JOYPAD-Y-LONG'})
                console.log('y-pressed');
            }, 1000)
        })

        var adown
        /* a button click */
        document.getElementById('A').addEventListener('click', (e) => {
            clearTimeout(adown)
            CONN.send({type: 'JOYPAD-A-CLICK'})
            console.log('a clicked');
        })
        /* a onpress */
        document.getElementById('A').addEventListener('touchstart', (e) => {
            adown = setTimeout(() => {
                clearTimeout(adown)
                CONN.send({type: 'JOYPAD-A-LONG'})
                console.log('a-pressed');
            }, 1000)
        })

        var bdown
        /* b button click */
        document.getElementById('B').addEventListener('click', (e) => {
            clearTimeout(bdown)
            CONN.send({type: 'JOYPAD-B-CLICK'})
            console.log('b clicked');
        })
        /* b onpress */
        document.getElementById('B').addEventListener('touchstart', (e) => {
            bdown = setTimeout(() => {
                clearTimeout(bdown)
                CONN.send({type: 'JOYPAD-B-LONG'})
                console.log('b-pressed');
            }, 1000)
        })


        /* Arrow button functions */
        var upbtn
        document.getElementById('UP').addEventListener('click', () => {
            CONN.send({type: 'JOYPAD-UP-CLICK'})
            console.log('UP Clicked')
        })

        var downbtn
        document.getElementById('DOWN').addEventListener('click', () => {
            CONN.send({type: 'JOYPAD-DOWN-CLICK'})
            console.log('DOWN Clicked')
        })

        var leftbtn
        document.getElementById('LEFT').addEventListener('click', () => {
            CONN.send({type: 'JOYPAD-LEFT-CLICK'})
            console.log('LEFT Clicked')
        })

        var rightbtn
        document.getElementById('RIGHT').addEventListener('click', () => {
            CONN.send({type: 'JOYPAD-RIGHT-CLICK'})
            console.log('RIGHT Clicked')
        })

        /* Left & Right cluster button functions */
        document.getElementById('START').addEventListener('click', () => {
            CONN.send({type: 'JOYPAD-START'})
            console.log('Start button pressed');
        })
        document.getElementById('BACK').addEventListener('click', () => {
            CONN.send({type: 'JOYPAD-BACK'})
            console.log('Back button pressed');
        })

        var lb
        document.getElementById('LB').addEventListener('click', (e) => {
            clearTimeout(lb)
            CONN.send({type: 'JOYPAD-LB-CLICK'})
            console.log('RB Clicked');
        })
        document.getElementById('LB').addEventListener('touchstart', (e) => {
            if(e.touches.length == 1) {
                //RightTouch = 0
                LeftTouch = 1
            }
            lb = setTimeout(() => {
                clearTimeout(lb)
                CONN.send({type: 'JOYPAD-LB-LONG'})
                console.log('LB pressed');
            }, 1000)
        })

        var rb
        document.getElementById('RB').addEventListener('click', (e) => {
            clearTimeout(rb)
            CONN.send({type: 'JOYPAD-RB-CLICK'})
            console.log('RB Clicked');
        })
        document.getElementById('RB').addEventListener('touchstart', (e) => {
            if(e.touches.length == 1) {
                //RightTouch = 0
                LeftTouch = 1
            }
            rb = setTimeout(() => {
                clearTimeout(rb)
                CONN.send({type: 'JOYPAD-RB-LONG'})
                console.log('RB pressed');
            }, 1000)
        })

        var rt
        document.getElementById('RT').addEventListener('click', (e) => {
            clearTimeout(rt)
            CONN.send({type: 'JOYPAD-RT-CLICK'})
            console.log('RT Clicked');
        })
        document.getElementById('RT').addEventListener('touchstart', (e) => {
            if(e.touches.length == 1) {
                //RightTouch = 0
                LeftTouch = 1
            }
            rt = setTimeout(() => {
                clearTimeout(rt)
                CONN.send({type: 'JOYPAD-RT-LONG'})
                console.log('RT pressed');
            }, 1000)
        })

        var lt
        document.getElementById('LT').addEventListener('click', (e) => {
            clearTimeout(lt)
            CONN.send({type: 'JOYPAD-LT-CLICK'})
            console.log('LT Clicked');
        })
        document.getElementById('LT').addEventListener('touchstart', (e) => {
            if(e.touches.length == 1) {
                //RightTouch = 0
                LeftTouch = 1
            }
            lt = setTimeout(() => {
                clearTimeout(lt)
                CONN.send({type: 'JOYPAD-LT-LONG'})
                console.log('LT pressed');
            }, 1000)
        })
    }
    else {
        document.getElementById('left-joystick-outline').remove()
        document.getElementById('right-joystick-outline').remove()
        document.getElementById('left-arrow-buttons').remove()
        document.getElementById('right-round-buttons').remove()
        document.getElementById('left-box-buttons').remove()
        document.getElementById('right-box-buttons').remove()
        
        joypadView = false
        joypadControls = true
    }
})


/* Left stickLeft Trigger Function (walk) */
const LeftTrigger = (angle) => {
    if(angle > 0 && angle <= 45 || angle < 0 && angle >= -45){
      CONN.send({type: 'JOYPAD-LS-FRONT'})
    }
    else if(angle >= 46 && angle <= 135){
      CONN.send({type: 'JOYPAD-LS-LEFT'})
    }
    else if(angle <= -46 && angle >= -135){
      CONN.send({type: 'JOYPAD-LS-RIGHT'})
    }
    else if(angle <= -136 || angle <= 180 && angle >= 136){
      CONN.send({type: 'JOYPAD-LS-BACK'})
    }
    else {
      console.log('Angle not matched');
    }
}

/* Right stickLLeft Trigger Function (Camera) */
const RightTrigger = (angle) => {
    if(angle > 0 && angle <= 23 || angle < 0 && angle >= -23){
      CONN.send({type: 'JOYPAD-RS-FRONT'})
    }
    else if(angle >= 24 && angle <= 68){
      CONN.send({type: 'JOYPAD-RS-UP-LEFT'})
    }
    else if(angle >= 69 && angle <= 113){
      CONN.send({type: 'JOYPAD-RS-LEFT'})
    }
    else if(angle >=114 && angle <= 158){
      CONN.send({type: 'JOYPAD-RS-DOWN-LEFT'})
    }
    else if(angle > 0 && angle >= 159 || angle < 0 && angle <= -158){
      CONN.send({type: 'JOYPAD-RS-BACK'})
    }
    else if(angle >= -159 && angle <= -113){
      CONN.send({type: 'JOYPAD-RS-DOWN-RIGHT'})
    }
    else if(angle >= -114 && angle <= -69){
      CONN.send({type: 'JOYPAD-RS-RIGHT'})
    }
    else if(angle >= -68 && angle <= -24){
      CONN.send({type: 'JOYPAD-RS-UP-RIGHT'})
    }
    else {
      console.log('Angle not defined')
    }
}