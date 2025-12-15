/**
 * @file MAME32Emulator.js
 * @description MAME 2010 (arcade) emulator
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * @extends BaseEmulator
 * @requires BaseEmulator.js
 * @requires ../emulators/Emulatrix_MAME32.js (LibRetro core)
 */

class MAME32Emulator extends BaseEmulator {
    constructor() {
        super({
            name: 'MAME 2010',
            romExtension: '.zip',
            coreFilename: 'Emulatrix_MAME32.wasm',
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
    window.MAME32Emulator = MAME32Emulator;
}
