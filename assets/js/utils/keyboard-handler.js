/**
 * @file keyboard-handler.js
 * @description Virtual keyboard event handling for Emulatrix emulators
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * PURPOSE: Centralize keyboard simulation logic
 * BENEFITS:
 *   - Consistent keyboard handling across emulators
 *   - Easier to add new key mappings
 *   - Better cross-browser compatibility
 */

const KeyboardHandler = (() => {
    /**
     * Key code mappings for different browsers
     */
    const KEY_CODES = {
        'F9': { code: 'F9', keyCode: 120 },
        'F10': { code: 'F10', keyCode: 121 },
        'F11': { code: 'F11', keyCode: 122 },
        'KeyZ': { code: 'KeyZ', keyCode: 90 },
        'KeyX': { code: 'KeyX', keyCode: 88 },
        'KeyA': { code: 'KeyA', keyCode: 65 },
        'KeyS': { code: 'KeyS', keyCode: 83 },
        'ArrowUp': { code: 'ArrowUp', keyCode: 38 },
        'ArrowDown': { code: 'ArrowDown', keyCode: 40 },
        'ArrowLeft': { code: 'ArrowLeft', keyCode: 37 },
        'ArrowRight': { code: 'ArrowRight', keyCode: 39 }
    };
    
    /**
     * Send virtual keyboard event
     * 
     * @param {string} eventType - 'keydown' or 'keyup'
     * @param {string} keyName - Key name (e.g., 'F10', 'KeyZ')
     * @returns {boolean} Success status
     */
    function sendVirtualKey(eventType, keyName) {
        try {
            const keyInfo = KEY_CODES[keyName];
            if (!keyInfo) {
                console.warn(`Unknown key: ${keyName}`);
                return false;
            }
            
            const canvas = document.getElementById('canvas');
            if (!canvas) {
                console.warn('Canvas element not found');
                return false;
            }
            
            // Create keyboard event
            const event = new KeyboardEvent(eventType, {
                bubbles: true,
                cancelable: true,
                code: keyInfo.code,
                key: keyInfo.code,
                keyCode: keyInfo.keyCode,
                which: keyInfo.keyCode,
                view: window
            });
            
            // Dispatch event
            canvas.dispatchEvent(event);
            return true;
        } catch (error) {
            console.error('Failed to send virtual key:', error);
            return false;
        }
    }
    
    /**
     * Press and release a key (convenience function)
     * 
     * @param {string} keyName - Key name (e.g., 'F10')
     * @param {number} holdDuration - How long to hold key in ms (default: 50)
     * @returns {Promise<boolean>} Success status
     */
    async function pressKey(keyName, holdDuration = 50) {
        try {
            // Press key
            sendVirtualKey('keydown', keyName);
            
            // Hold for duration
            await new Promise(resolve => setTimeout(resolve, holdDuration));
            
            // Release key
            sendVirtualKey('keyup', keyName);
            
            return true;
        } catch (error) {
            console.error('Failed to press key:', error);
            return false;
        }
    }
    
    /**
     * Toggle sound (F9 key)
     */
    async function toggleSoundKey() {
        return pressKey('F9', 50);
    }
    
    /**
     * Reload/restart game (F10 key)
     */
    async function reloadKey() {
        return pressKey('F10', 50);
    }
    
    /**
     * Add keyboard event listeners
     * 
     * @param {object} callbacks - Object with event handlers
     *   @param {Function} callbacks.onKeyDown - Called on keydown
     *   @param {Function} callbacks.onKeyUp - Called on keyup
     */
    function addKeyboardListeners(callbacks) {
        if (callbacks.onKeyDown) {
            document.addEventListener('keydown', callbacks.onKeyDown);
        }
        if (callbacks.onKeyUp) {
            document.addEventListener('keyup', callbacks.onKeyUp);
        }
    }
    
    /**
     * Remove keyboard event listeners
     * 
     * @param {object} callbacks - Same callbacks object used in addKeyboardListeners
     */
    function removeKeyboardListeners(callbacks) {
        if (callbacks.onKeyDown) {
            document.removeEventListener('keydown', callbacks.onKeyDown);
        }
        if (callbacks.onKeyUp) {
            document.removeEventListener('keyup', callbacks.onKeyUp);
        }
    }
    
    return {
        sendVirtualKey,
        pressKey,
        toggleSoundKey,
        reloadKey,
        addKeyboardListeners,
        removeKeyboardListeners,
        KEY_CODES
    };
})();

// Make available globally
if (typeof window !== 'undefined') {
    window.KeyboardHandler = KeyboardHandler;
}
