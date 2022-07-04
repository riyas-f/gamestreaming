import eel
import pyautogui
from pynput.mouse import Button, Controller as Mouse_Controller
from pynput.keyboard import Key, Controller as Keyboard_Controller
import vgamepad as vg
import time

# Global Variables / Initialization #
screenWidth, screenHeight = pyautogui.size()
mouse = Mouse_Controller()
keyboard = Keyboard_Controller()
gamepad = vg.VX360Gamepad()

# Location of web files #
eel.init('bridge')

# Mouse move function #
@eel.expose
def MOUSE_MOVE(x, y):
    X = x / 100 * screenWidth
    Y = y / 100 * screenHeight
    mouse.position = (round(X), round(Y))

# Mouse click function #
@eel.expose
def SINGLE_CLICK():
    mouse.press(Button.left)
    mouse.release(Button.left)
    print('Single click')

# Double click function #
@eel.expose
def DOUBLE_CLICK(x, y):
    mouse.click(Button.left, 2)

# Left mouse button long press #
@eel.expose
def LEFT_PRESS():
    mouse.press(Button.left)

# Left mouse button release #
@eel.expose
def LEFT_RELEASE():
    mouse.release(Button.left)

# Keyboard typewriter function #
@eel.expose
def TYPEWRITER(letter):
    keyboard.type(letter)

# Keyboard space #
@eel.expose
def SPACE():
    keyboard.press(Key.space)
    keyboard.release(Key.space)

# Keyboard backspace #
@eel.expose
def BACKSPACE():
    keyboard.press(Key.backspace)
    keyboard.release(Key.backspace)

# Keyboard enter #
@eel.expose
def ENTER():
    keyboard.press(Key.enter)
    keyboard.release(Key.enter)

# Keyboard shift #
@eel.expose
def SHIFT():
    keyboard.press(Key.shift)
    keyboard.release(Key.shift)

# Keyboard tab #
@eel.expose
def TAB():
    keyboard.press(Key.tab)
    keyboard.release(Key.tab)

#-------------------Joypad Functions-------------------#

@eel.expose
def JOYPAD_LS_FRONT():
    gamepad.left_joystick_float(x_value_float=0.0, y_value_float=1.0)
    gamepad.update()
    print('Joypad-left-front')

@eel.expose
def JOYPAD_LS_LEFT():
    gamepad.left_joystick_float(x_value_float=-1.0, y_value_float=0.0)
    gamepad.update()
    print('joypad-left-left')

@eel.expose
def JOYPAD_LS_RIGHT():
    gamepad.left_joystick_float(x_value_float=1.0, y_value_float=1.0)
    gamepad.update()
    print('joypad-left-right')

@eel.expose
def JOYPAD_LS_BACK():
    gamepad.left_joystick_float(x_value_float=0.0, y_value_float=-1.0)
    gamepad.update()
    print('joypad-left-back')

@eel.expose
def JOYPAD_RS_FRONT():
    gamepad.right_joystick_float(x_value_float=0.0, y_value_float=-1.0)
    gamepad.update()
    print('joypad-right-front')

@eel.expose
def JOYPAD_RS_UP_LEFT():
    gamepad.right_joystick_float(x_value_float=1.0, y_value_float=-1.0)
    gamepad.update()
    print('joypad-right-up-left')

@eel.expose
def JOYPAD_RS_LEFT():
    gamepad.right_joystick_float(x_value_float=1.0, y_value_float=0.0)
    gamepad.update()
    print('joypad-right-left')

@eel.expose
def JOYPAD_RS_DOWN_LEFT():
    gamepad.right_joystick_float(x_value_float=1.0, y_value_float=1.0)
    gamepad.update()
    print('joypad-right-down-left')

@eel.expose
def JOYPAD_RS_BACK():
    gamepad.right_joystick_float(x_value_float=0.0, y_value_float=1.0)
    gamepad.update()
    print('joypad-right-back')

@eel.expose
def JOYPAD_RS_DOWN_RIGHT():
    gamepad.right_joystick_float(x_value_float=-1.0, y_value_float=1.0)
    gamepad.update()
    print('joypad-right-down-right')

@eel.expose
def JOYPAD_RS_RIGHT():
    gamepad.right_joystick_float(x_value_float=-1.0, y_value_float=0.0)
    gamepad.update()
    print('joypad-right-right')

@eel.expose
def JOYPAD_RS_UP_RIGHT():
    gamepad.right_joystick_float(x_value_float=-1.0, y_value_float=-1.0)
    gamepad.update()
    print('joypad-right-up-right')

@eel.expose
def JOYPAD_LEFT_HOLD():
    gamepad.left_joystick_float(x_value_float=0.0, y_value_float=0.0)
    gamepad.update()
    gamepad.reset()
    gamepad.update()
    print('Left stick release')

@eel.expose
def JOYPAD_RIGHT_HOLD():
    gamepad.right_joystick_float(x_value_float=0.0, y_value_float=0.0)
    gamepad.update()
    gamepad.reset()
    gamepad.update()
    print('Right stick release')

# X Button Function #
@eel.expose
def JOYPAD_X_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_X)
    gamepad.update()
    print('Button X Clcked')
    time.sleep(0.5)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_X)
    gamepad.update()
    print('Button X Stopped')
@eel.expose
def JOYPAD_X_LONG():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_X)
    gamepad.update()
    print('x long press')


# Y Button Function #
@eel.expose
def JOYPAD_Y_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_Y)
    gamepad.update()
    print('Button Y Clcked')
    time.sleep(0.5)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_Y)
    gamepad.update()
    print('Button Y Stopped')
@eel.expose
def JOYPAD_Y_LONG():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_Y)
    gamepad.update()
    print('y long press')


# A Button Function #
@eel.expose
def JOYPAD_A_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_A)
    gamepad.update()
    print('Button A Clcked')
    time.sleep(0.5)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_A)
    gamepad.update()
    print('Button A Stopped')

@eel.expose
def JOYPAD_A_LONG():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_A)
    gamepad.update()
    print('a long press')


# B Function #
@eel.expose
def JOYPAD_B_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_B)
    gamepad.update()
    print('Button B Clicked')
    time.sleep(0.5)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_B)
    gamepad.update()
    print('Button B Stopped')
@eel.expose
def JOYPAD_B_LONG():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_B)
    gamepad.update()
    print('b long press')


@eel.expose
def JOYPAD_UP_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_UP)
    gamepad.update()
    print('UP Arrow pressed')
    time.sleep(0.1)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_UP)
    gamepad.update()
    print('UP Arrow released')

@eel.expose
def JOYPAD_DOWN_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_DOWN)
    gamepad.update()
    print('Down Arrow pressed')
    time.sleep(0.1)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_DOWN)
    gamepad.update()
    print('Down Arrow released')

@eel.expose
def JOYPAD_LEFT_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_LEFT)
    gamepad.update()
    print('Left Arrow pressed')
    time.sleep(0.1)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_LEFT)
    gamepad.update()
    print('Left Arrow released')


@eel.expose
def JOYPAD_RIGHT_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_RIGHT)
    gamepad.update()
    print('Right Arrow pressed')
    time.sleep(0.1)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_RIGHT)
    gamepad.update()
    print('Right Arrow released')


@eel.expose
def JOYPAD_START():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_START)
    gamepad.update()
    time.sleep(0.1)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_START)
    gamepad.update()
    print('Joypad start pressed')


@eel.expose
def JOYPAD_BACK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_BACK)
    gamepad.update()
    time.sleep(0.1)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_BACK)
    gamepad.update()
    print('Joypad back pressed')


@eel.expose
def JOYPAD_RB_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_RIGHT_SHOULDER)
    gamepad.update()
    print('RB pressed')
    time.sleep(0.1)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_RIGHT_SHOULDER)
    gamepad.update()
    print('RB released')
@eel.expose
def JOYPAD_RB_LONG():
    print('RB Long pressed')

@eel.expose
def JOYPAD_LB_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_LEFT_SHOULDER)
    gamepad.update()
    print('LB pressed')
    time.sleep(0.1)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_LEFT_SHOULDER)
    gamepad.update()
    print('LB released')
@eel.expose
def JOYPAD_LB_LONG():
    print('LB Long pressed')


@eel.expose
def JOYPAD_RT_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_RIGHT_THUMB)
    gamepad.update()
    print('RT pressed')
    time.sleep(0.1)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_RIGHT_THUMB)
    gamepad.update()
    print('RT released')
    time.sleep(0.1)
    gamepad.right_trigger_float(value_float=0.0)
    gamepad.update()
    print('RT Long released')
@eel.expose
def JOYPAD_RT_LONG():
    gamepad.right_trigger_float(value_float=1.0)
    gamepad.update()
    print('RT Long pressed')

@eel.expose
def JOYPAD_LT_CLICK():
    gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_LEFT_THUMB)
    gamepad.update()
    print('LT pressed')
    time.sleep(0.1)
    gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_LEFT_THUMB)
    print('LT released')
    gamepad.update()
    time.sleep(0.1)
    gamepad.left_trigger_float(value_float=0.0)
    gamepad.update()
    print('LT Long released')
@eel.expose
def JOYPAD_LT_LONG():
    gamepad.left_trigger_float(value_float=1.0)
    gamepad.update()
    print('LT Long pressed')

# starts the server #
eel.start('main.html', mode=None)