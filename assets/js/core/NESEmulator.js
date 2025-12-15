/**
 * @file NESEmulator.js
 * @description Nintendo Entertainment System (NES/Famicom) emulator
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * @extends BaseEmulator
 * @requires BaseEmulator.js
 * @requires ../emulators/Emulatrix_Nintendo.js (LibRetro core)
 */

class NESEmulator extends BaseEmulator {
    constructor() {
        super({
            name: 'Nintendo NES',
            romExtension: '.nes',
            coreFilename: 'Emulatrix_Nintendo.wasm',
            romFilename: 'game.nes',
            keymap: {
                start: 's',
                select: 'a',
                a: 'x',
                b: 'z'
            }
        });
    }
    
    /**
     * NES-specific initialization (if needed)
     */
    onEmulatorReady() {
        super.onEmulatorReady();
        
        // Show NES-specific mobile controls if on mobile device
        if (this.isMobileDevice()) {
            this.showMobileControls();
        }
    }
    
    /**
     * Show NES mobile controls
     */
    showMobileControls() {
        // Show virtual joystick
        UIHelpers.showMobileControls();
        
        // Show NES-specific buttons (A, B, Start, Select)
        const aButton = document.getElementsByClassName('gui_nintendo_keya')[0];
        if (aButton) {
            aButton.style.display = 'block';
            aButton.addEventListener('touchstart', () => KeyboardHandler.sendVirtualKey('keydown', 'KeyX'));
            aButton.addEventListener('touchend', () => KeyboardHandler.sendVirtualKey('keyup', 'KeyX'));
        }
        
        const bButton = document.getElementsByClassName('gui_nintendo_keyb')[0];
        if (bButton) {
            bButton.style.display = 'block';
            bButton.addEventListener('touchstart', () => KeyboardHandler.sendVirtualKey('keydown', 'KeyZ'));
            bButton.addEventListener('touchend', () => KeyboardHandler.sendVirtualKey('keyup', 'KeyZ'));
        }
        
        const selectButton = document.getElementsByClassName('gui_nintendo_keyselect')[0];
        if (selectButton) {
            selectButton.style.display = 'block';
            selectButton.addEventListener('touchstart', () => KeyboardHandler.sendVirtualKey('keydown', 'KeyA'));
            selectButton.addEventListener('touchend', () => KeyboardHandler.sendVirtualKey('keyup', 'KeyA'));
        }
        
        const startButton = document.getElementsByClassName('gui_nintendo_keystart')[0];
        if (startButton) {
            startButton.style.display = 'block';
            startButton.addEventListener('touchstart', () => KeyboardHandler.sendVirtualKey('keydown', 'KeyS'));
            startButton.addEventListener('touchend', () => KeyboardHandler.sendVirtualKey('keyup', 'KeyS'));
        }
    }
    
    /**
     * Check if running on mobile device
     */
    isMobileDevice() {
        return !!(
            navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
        );
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.NESEmulator = NESEmulator;
}
