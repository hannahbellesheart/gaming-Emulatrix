/**
 * @file GBAEmulator.js
 * @description Game Boy Advance emulator
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * @extends BaseEmulator
 * @requires BaseEmulator.js
 * @requires ../emulators/Emulatrix_GameBoyAdvance.js (LibRetro core)
 */

class GBAEmulator extends BaseEmulator {
    constructor() {
        super({
            name: 'Game Boy Advance',
            romExtension: '.gba',
            coreFilename: 'Emulatrix_GameBoyAdvance.wasm',
            romFilename: 'game.gba',
            keymap: {
                start: 's',
                select: 'a',
                a: 'x',
                b: 'z',
                l: 'q',
                r: 'w'
            }
        });
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.GBAEmulator = GBAEmulator;
}
