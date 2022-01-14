//
//  Joystick Data Test - Web Worker process
//
//  WebWorker.js
//  This is a "background" process to capture events from the joystick and send them back to the 
//  main Joystick_Data_Test.js script.
//
//  This script will handle all the joystick data aquisition and polling and then
//  send complete data packets to the main script
//  This should return data to Joystick_data_test.js
//

var joystick_data;
var js = '';

//  Formal definition of "gopigo3_joystick"
var gopigo3_joystick = {
    controller_status: 'Disconnected',
    motion_state: 'Waiting for Joystick',
    angle_dir: 'None',
    time_stamp: 0,  // a large integer that, (sometimes), becomes a float (shrug shoulders)
    x_axis: 0.000,  //  x-axis < 0, joystick pushed left - x-axis > 0, joystick pushed right
    y_axis: 0.000,  // y-axis < 0, joystick pushed forward - y-axis > 0 , joystick pullled back
    head_x_axis: 0.000,  //  head x and y axes mirror the joystick x and y axes
    head_y_axis: 0.000,  //  if the pinky-switch, (head motion enable), is pressed
    force: 0.000,  //  force is the absolute value of the y-axis deflection
    trigger_1: 0,   // Partial primary trigger press (motion enabled)
    trigger_2: 0,   // Full primary trigger press  (faster speed - not yet implemented)
    head_enable: 0  // Pinky-switch press  (enable joystick to move head)
};

window.addEventListener("gamepadconnected", (event) => {
    js = event.gamepad;
    gamepad_connected();  // Gamepad is now connected
    send_data(gopigo3_joystick)  // send it to the main script
    get_gamepad_data();  // Star aquiring data
});

window.addEventListener("gamepaddisconnected", (event) => {
    gopigo3_joystick.controller_status = "Disconnected"; // Joystick disconnected, so set state to "diusconnected"
    gopigo3_joystick.motion_state = 'Waiting for Joystick';
    gamepad_disconnected(); // clear out stale data
    send_data(gopigo3_joystick)  // send it to the main script
//    get_more_data(); // continue service loop
});

function  get_gamepad_data() {
    js = (navigator.getGamepads && navigator.getGamepads()) || (navigator.webkitGetGamepads && navigator.webkitGetGamepads());

    collate_data(js[0]);  //  Collect variable data to be sent

    send_data(gopigo3_joystick);  // Send normalized data to 'bot

    //  function is_something_happening is the "event loop" that spins until the timer changes indicating
    //  that something actually happened.
    is_something_happening(jsdata, gopigo3_joystick)  // Wait for something else to happen and exit to game loop

//    get_more_data(); // continue service loop  // requestAnimationFrame loop
    return;
}

// gamepad_connected is called by the event handler when a joystick
// is connected, and initializes the gamepad data to a sane "connected" value
function gamepad_connected() {
    gopigo3_joystick.controller_status = 'Connected'; // Joystick connected but not moving
    gopigo3_joystick.motion_state = 'Stopped';
    gopigo3_joystick.angle_dir = 'None';
    gopigo3_joystick.time_stamp = 0;
    gopigo3_joystick.x_axis =0.000;
    gopigo3_joystick.y_axis =0.000;
    gopigo3_joystick.head_x_axis =0.000;
    gopigo3_joystick.head_y_axis =0.000;
    gopigo3_joystick.force =0.000;
    gopigo3_joystick.trigger_1 = 0;
    gopigo3_joystick.trigger_2 = 0;
    gopigo3_joystick.head_enable = 0;
    send_data(gopigo3_joystick)  // send it to the robot
    get_more_data(); // continue service loop // continue service loop
    return;
}

function gamepad_disconnected() {
    gopigo3_joystick.controller_status = 'Disconnected';
    gopigo3_joystick.motion_state = 'Waiting for Joystick';
    gopigo3_joystick.angle_dir = 'None';
    gopigo3_joystick.time_stamp = 0;
    gopigo3_joystick.x_axis =0.000;
    gopigo3_joystick.y_axis =0.000;
    gopigo3_joystick.head_x_axis =0.000;
    gopigo3_joystick.head_y_axis =0.000;
    gopigo3_joystick.force =0.000;
    gopigo3_joystick.trigger_1 = 0;
    gopigo3_joystick.trigger_2 = 0;
    gopigo3_joystick.head_enable = 0;
    send_data(gopigo3_joystick)  // send it to the robot
    get_more_data(); // continue service loop
    return;
};

//  Collate data collects all the data, normalizes it, packages it,
//  and prepares it for transmission to the 'bot'
function collate_data(jsdata) {
    // Number.parseFloat() th
    gopigo3_joystick.time_stamp = Number((jsdata.timestamp).toFixed(0));    ;
    gopigo3_joystick.x_axis = Number.parseFloat((jsdata.axes[0]).toFixed(3));
    gopigo3_joystick.y_axis = Number.parseFloat(jsdata.axes[1]).toFixed(3);
    gopigo3_joystick.force =  Math.abs(Number.parseFloat((jsdata.axes[1]).toFixed(3)));
    gopigo3_joystick.trigger_1 = jsdata.buttons[0].value;
    gopigo3_joystick.trigger_2 = jsdata.buttons[14].value;
    gopigo3_joystick.head_enable = jsdata.buttons[5].value;
    return (gopigo3_joystick)
}


function is_something_happening(jsdata, gopigo3_joystick) {
    var old_time = gopigo3_joystick.time_stamp
        while (old_time == Number.parseFloat(jsdata.timestamp).toFixed()) {
            setTimeout(is_something_happening, 125);
//        requestAnimationFrame(is_something_happening(jsdata, gopigo3_joystick));
        }
        get_gamepad_data()  //  Return for another data frame from the joystick
    return;  // pro-forma "close" - the code should never reach this point.
}

function send_data(gpg_data) {
    postMessage(gpg_data);  // Send data back to main script
    return;
}

//  In a stand-alone browser implementation of a gamepad driven game,
//  *this* represents the "game loop".
//  Ultimately I hope to re-write this as an event-driven process.

function get_more_data() {  //  this calls the game loop after .125 sec.
    setTimeout(get_game_loop(), 125);
    return;
}

function get_game_loop() {  //  this is the "game loop"
    requestAnimationFrame(get_gamepad_data);
    return;
}
