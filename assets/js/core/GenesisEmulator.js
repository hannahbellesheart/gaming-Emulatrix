/**
 * @file GenesisEmulator.js
 * @description Sega Genesis / Mega Drive emulator
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * @extends BaseEmulator
 * @requires BaseEmulator.js
 * @requires ../emulators/Emulatrix_SegaGenesis.js (LibRetro core)
 */

class GenesisEmulator extends BaseEmulator {
    constructor() {
        super({
            name: 'Sega Genesis',
            romExtension: '.bin|.smd|.md',
            coreFilename: 'Emulatrix_SegaGenesis.wasm',
            romFilename: 'game.bin',
            keymap: {
                start: 's',
                a: 'x',
                b: 'z',
                c: 'c'
            }
        });
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.GenesisEmulator = GenesisEmulator;
}
