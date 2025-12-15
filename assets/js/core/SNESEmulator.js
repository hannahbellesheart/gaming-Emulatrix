/**
 * @file SNESEmulator.js
 * @description Super Nintendo Entertainment System (SNES/Super Famicom) emulator
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * @extends BaseEmulator
 * @requires BaseEmulator.js
 * @requires ../emulators/Emulatrix_SuperNintendo.js (LibRetro core)
 */

class SNESEmulator extends BaseEmulator {
    constructor() {
        super({
            name: 'Super Nintendo',
            romExtension: '.smc|.sfc|.srm',
            coreFilename: 'Emulatrix_SuperNintendo.wasm',
            romFilename: 'game.sfc',
            keymap: {
                start: 's',
                select: 'a',
                a: 'x',
                b: 'z',
                x: 'd',
                y: 'c',
                l: 'q',
                r: 'w'
            }
        });
    }
    
    /**
     * SNES-specific initialization
     */
    onEmulatorReady() {
        super.onEmulatorReady();
        
        if (this.isMobileDevice()) {
            this.showMobileControls();
        }
    }
    
    /**
     * Show SNES mobile controls (6 buttons)
     */
    showMobileControls() {
        UIHelpers.showMobileControls();
        
        // SNES has more buttons than NES (A, B, X, Y, L, R, Start, Select)
        // Implement SNES-specific button mapping here
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
            navigator.userAgent.match(/iPod/i)
        );
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.SNESEmulator = SNESEmulator;
}
