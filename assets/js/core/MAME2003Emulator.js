/**
 * @file MAME2003Emulator.js
 * @description MAME 2003 (arcade) emulator
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * @extends BaseEmulator
 * @requires BaseEmulator.js
 * @requires ../emulators/Emulatrix_MAME2003.js (LibRetro core)
 */

class MAME2003Emulator extends BaseEmulator {
    constructor() {
        super({
            name: 'MAME 2003',
            romExtension: '.zip',
            coreFilename: 'Emulatrix_MAME2003.wasm',
            romFilename: 'game.zip',
            keymap: {
                start: 's',
                select: 'a',
                button1: 'x',
                button2: 'z',
                button3: 'c',
                button4: 'd',
                button5: 'q',
                button6: 'w'
            }
        });
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.MAME2003Emulator = MAME2003Emulator;
}
