/**
 * @file ui-helpers.js
 * @description UI manipulation utilities for Emulatrix emulators
 * @author Hannah Belle
 * @updatedBy GitHub Copilot
 * @updatedOn 2025-12-15 00:00:00
 * 
 * PURPOSE: Centralize common UI operations
 * BENEFITS:
 *   - DRY principle (Don't Repeat Yourself)
 *   - Consistent UI behavior across emulators
 *   - Easier maintenance and updates
 */

const UIHelpers = (() => {
    /**
     * Show loading indicator
     */
    function showLoadingIndicator() {
        const elements = document.getElementsByClassName('gui_pleasewait_title');
        if (elements[0]) elements[0].style.display = 'block';
        
        const pleaseWait = document.getElementsByClassName('pleasewait');
        if (pleaseWait[0]) pleaseWait[0].style.display = 'block';
    }
    
    /**
     * Hide loading indicator
     */
    function hideLoadingIndicator() {
        const elements = document.getElementsByClassName('gui_pleasewait_title');
        if (elements[0]) elements[0].style.display = 'none';
        
        const pleaseWait = document.getElementsByClassName('pleasewait');
        if (pleaseWait[0]) pleaseWait[0].style.display = 'none';
    }
    
    /**
     * Show saving indicator
     * @param {string} message - Message to display (default: parent.STRING_SAVING)
     */
    function showSavingIndicator(message = null) {
        const elements = document.getElementsByClassName('gui_saving');
        if (elements[0]) {
            if (message) {
                elements[0].innerHTML = message;
            } else if (typeof parent !== 'undefined' && parent.STRING_SAVING) {
                elements[0].innerHTML = parent.STRING_SAVING;
            }
            elements[0].style.display = 'block';
        }
    }
    
    /**
     * Hide saving indicator
     */
    function hideSavingIndicator() {
        const elements = document.getElementsByClassName('gui_saving');
        if (elements[0]) elements[0].style.display = 'none';
    }
    
    /**
     * Show loading (upload) indicator
     * @param {string} message - Message to display (default: parent.STRING_LOADING)
     */
    function showLoadingUploadIndicator(message = null) {
        const elements = document.getElementsByClassName('gui_loading');
        if (elements[0]) {
            if (message) {
                elements[0].innerHTML = message;
            } else if (typeof parent !== 'undefined' && parent.STRING_LOADING) {
                elements[0].innerHTML = parent.STRING_LOADING;
            }
            elements[0].style.display = 'block';
        }
    }
    
    /**
     * Hide loading (upload) indicator
     */
    function hideLoadingUploadIndicator() {
        const elements = document.getElementsByClassName('gui_loading');
        if (elements[0]) elements[0].style.display = 'none';
    }
    
    /**
     * Show mouse cursor
     */
    function showMouse() {
        document.body.className = 'gui_mouse_visible';
    }
    
    /**
     * Hide mouse cursor
     */
    function hideMouse() {
        document.body.className = 'gui_mouse_hidden';
    }
    
    /**
     * Show container
     */
    function showContainer() {
        const container = document.getElementById('container');
        if (container) container.style.display = 'block';
    }
    
    /**
     * Hide container
     */
    function hideContainer() {
        const container = document.getElementById('container');
        if (container) container.style.display = 'none';
    }
    
    /**
     * Resize canvas to match container dimensions
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    function resizeCanvas(width, height) {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.width = width;
            canvas.height = height;
        }
    }
    
    /**
     * Show mobile controls (virtual joystick and buttons)
     */
    function showMobileControls() {
        const joystick = document.getElementsByClassName('gui_joystick')[0];
        if (joystick) joystick.style.display = 'block';
    }
    
    /**
     * Hide mobile controls
     */
    function hideMobileControls() {
        const joystick = document.getElementsByClassName('gui_joystick')[0];
        if (joystick) joystick.style.display = 'none';
    }
    
    /**
     * Show success message temporarily
     * @param {string} message - Message to show
     * @param {number} duration - Duration in milliseconds (default: 3000)
     */
    function showSuccessMessage(message, duration = 3000) {
        const elements = document.getElementsByClassName('gui_saving');
        if (elements[0]) {
            elements[0].innerHTML = message;
            elements[0].style.display = 'block';
            elements[0].style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                elements[0].style.display = 'none';
                elements[0].style.backgroundColor = '';
            }, duration);
        }
    }
    
    /**
     * Show error message temporarily
     * @param {string} message - Message to show
     * @param {number} duration - Duration in milliseconds (default: 5000)
     */
    function showErrorMessage(message, duration = 5000) {
        const elements = document.getElementsByClassName('gui_saving');
        if (elements[0]) {
            elements[0].innerHTML = message;
            elements[0].style.display = 'block';
            elements[0].style.backgroundColor = '#f44336';
            
            setTimeout(() => {
                elements[0].style.display = 'none';
                elements[0].style.backgroundColor = '';
            }, duration);
        }
    }
    
    /**
     * Trigger file input click (for file upload)
     * @param {string} inputId - ID of file input element
     */
    function triggerFileUpload(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.click();
        }
    }
    
    /**
     * Clear file input value
     * @param {string} inputId - ID of file input element
     */
    function clearFileInput(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = null;
        }
    }
    
    return {
        showLoadingIndicator,
        hideLoadingIndicator,
        showSavingIndicator,
        hideSavingIndicator,
        showLoadingUploadIndicator,
        hideLoadingUploadIndicator,
        showMouse,
        hideMouse,
        showContainer,
        hideContainer,
        resizeCanvas,
        showMobileControls,
        hideMobileControls,
        showSuccessMessage,
        showErrorMessage,
        triggerFileUpload,
        clearFileInput
    };
})();

// Make available globally
if (typeof window !== 'undefined') {
    window.UIHelpers = UIHelpers;
}
