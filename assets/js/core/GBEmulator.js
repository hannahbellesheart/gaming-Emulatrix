/**
 * @file GBEmulator.js
 * @description Game Boy / Game Boy Color emulator
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * @extends BaseEmulator
 * @requires BaseEmulator.js
 * @requires ../emulators/Emulatrix_GameBoy.js (LibRetro core)
 */

class GBEmulator extends BaseEmulator {
    constructor() {
        super({
            name: 'Game Boy',
            romExtension: '.gb|.gbc',
            coreFilename: 'Emulatrix_GameBoy.wasm',
            romFilename: 'game.gb',
            keymap: {
                start: 's',
                select: 'a',
                a: 'x',
                b: 'z'
            }
        });
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.GBEmulator = GBEmulator;
}
