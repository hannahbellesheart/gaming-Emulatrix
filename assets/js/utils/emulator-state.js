/**
 * @file emulator-state.js
 * @description Centralized state management for Emulatrix emulators
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * PURPOSE: Replace global variables with encapsulated state management
 * PATTERN: Module Pattern with Singleton
 * BENEFITS:
 *   - Eliminates global variable pollution
 *   - Provides clear API for state access
 *   - Enables state persistence and debugging
 *   - Improves testability
 */

const EmulatorState = (() => {
    // PRIVATE STATE (closure-based encapsulation)
    let state = {
        // Container dimensions
        container: {
            width: 0,
            height: 0
        },
        
        // Download state management
        download: {
            running: false,
            checker: null,
            filename: '',
            lastSize: -1,
            lastSizeRepeated: 0
        },
        
        // Upload state management
        upload: {
            running: false,
            checker: null,
            origSize: -1,
            origSizeRepeated: 0
        },
        
        // Emulator runtime state
        emulator: {
            started: false,
            running: false,
            soundEnabled: true,
            currentROM: null
        },
        
        // Configuration loading state
        settings: {
            file: '',
            checker: null
        },
        
        // Loading state
        loading: {
            checker: null
        }
    };
    
    // PUBLIC API
    return {
        /**
         * Get container dimensions
         * @returns {{width: number, height: number}}
         */
        getContainerDimensions() {
            return { ...state.container };
        },
        
        /**
         * Set container dimensions
         * @param {number} width - Container width in pixels
         * @param {number} height - Container height in pixels
         */
        setContainerDimensions(width, height) {
            state.container.width = width;
            state.container.height = height;
        },
        
        /**
         * Check if download is currently running
         * @returns {boolean}
         */
        isDownloadRunning() {
            return state.download.running;
        },
        
        /**
         * Start download state
         * @param {string} filename - ROM filename without extension
         */
        startDownload(filename) {
            state.download.running = true;
            state.download.filename = filename;
            state.download.lastSize = -1;
            state.download.lastSizeRepeated = 0;
        },
        
        /**
         * Stop download state
         */
        stopDownload() {
            state.download.running = false;
            if (state.download.checker) {
                clearInterval(state.download.checker);
                state.download.checker = null;
            }
        },
        
        /**
         * Get download state
         * @returns {object} Download state object
         */
        getDownloadState() {
            return { ...state.download };
        },
        
        /**
         * Update download progress tracking
         * @param {number} lastSize - Last recorded file size
         */
        updateDownloadProgress(lastSize) {
            if (lastSize === state.download.lastSize) {
                state.download.lastSizeRepeated++;
            } else {
                state.download.lastSize = lastSize;
                state.download.lastSizeRepeated = 0;
            }
        },
        
        /**
         * Set download checker interval
         * @param {number} intervalId - Interval ID from setInterval
         */
        setDownloadChecker(intervalId) {
            state.download.checker = intervalId;
        },
        
        /**
         * Check if upload is currently running
         * @returns {boolean}
         */
        isUploadRunning() {
            return state.upload.running;
        },
        
        /**
         * Start upload state
         * @param {number} origSize - Original file size in bytes
         */
        startUpload(origSize) {
            state.upload.running = true;
            state.upload.origSize = origSize;
            state.upload.origSizeRepeated = 0;
        },
        
        /**
         * Stop upload state
         */
        stopUpload() {
            state.upload.running = false;
            if (state.upload.checker) {
                clearInterval(state.upload.checker);
                state.upload.checker = null;
            }
        },
        
        /**
         * Get upload state
         * @returns {object} Upload state object
         */
        getUploadState() {
            return { ...state.upload };
        },
        
        /**
         * Update upload progress tracking
         * @param {number} currentSize - Current file size
         */
        updateUploadProgress(currentSize) {
            if (currentSize === state.upload.origSize) {
                state.upload.origSizeRepeated++;
            } else {
                state.upload.origSizeRepeated = 0;
            }
        },
        
        /**
         * Set upload checker interval
         * @param {number} intervalId - Interval ID from setInterval
         */
        setUploadChecker(intervalId) {
            state.upload.checker = intervalId;
        },
        
        /**
         * Check if emulator has started
         * @returns {boolean}
         */
        isEmulatorStarted() {
            return state.emulator.started;
        },
        
        /**
         * Set emulator started state
         * @param {boolean} started - Whether emulator has started
         */
        setEmulatorStarted(started) {
            state.emulator.started = started;
        },
        
        /**
         * Check if emulator is currently running
         * @returns {boolean}
         */
        isEmulatorRunning() {
            return state.emulator.running;
        },
        
        /**
         * Set emulator running state (pause/resume)
         * @param {boolean} running - Whether emulator is running
         */
        setEmulatorRunning(running) {
            state.emulator.running = running;
        },
        
        /**
         * Check if sound is enabled
         * @returns {boolean}
         */
        isSoundEnabled() {
            return state.emulator.soundEnabled;
        },
        
        /**
         * Toggle sound state
         * @param {boolean} enabled - Whether sound should be enabled
         */
        setSoundEnabled(enabled) {
            state.emulator.soundEnabled = enabled;
        },
        
        /**
         * Get current ROM name
         * @returns {string|null}
         */
        getCurrentROM() {
            return state.emulator.currentROM;
        },
        
        /**
         * Set current ROM name
         * @param {string} romName - ROM filename
         */
        setCurrentROM(romName) {
            state.emulator.currentROM = romName;
        },
        
        /**
         * Get settings file content
         * @returns {string}
         */
        getSettingsFile() {
            return state.settings.file;
        },
        
        /**
         * Append to settings file
         * @param {string} content - Content to append
         */
        appendSettingsFile(content) {
            state.settings.file += content;
        },
        
        /**
         * Clear settings file
         */
        clearSettingsFile() {
            state.settings.file = '';
        },
        
        /**
         * Set settings checker interval
         * @param {number} intervalId - Interval ID from setInterval
         */
        setSettingsChecker(intervalId) {
            state.settings.checker = intervalId;
        },
        
        /**
         * Stop settings checker
         */
        stopSettingsChecker() {
            if (state.settings.checker) {
                clearInterval(state.settings.checker);
                state.settings.checker = null;
            }
        },
        
        /**
         * Set loading checker interval
         * @param {number} intervalId - Interval ID from setInterval
         */
        setLoadingChecker(intervalId) {
            state.loading.checker = intervalId;
        },
        
        /**
         * Stop loading checker
         */
        stopLoadingChecker() {
            if (state.loading.checker) {
                clearInterval(state.loading.checker);
                state.loading.checker = null;
            }
        },
        
        /**
         * Get complete state snapshot (for debugging)
         * @returns {object} Complete state object
         */
        getStateSnapshot() {
            return JSON.parse(JSON.stringify(state));
        },
        
        /**
         * Reset all state to initial values
         */
        reset() {
            // Stop all timers
            this.stopDownload();
            this.stopUpload();
            this.stopSettingsChecker();
            this.stopLoadingChecker();
            
            // Reset to initial state
            state = {
                container: { width: 0, height: 0 },
                download: {
                    running: false,
                    checker: null,
                    filename: '',
                    lastSize: -1,
                    lastSizeRepeated: 0
                },
                upload: {
                    running: false,
                    checker: null,
                    origSize: -1,
                    origSizeRepeated: 0
                },
                emulator: {
                    started: false,
                    running: false,
                    soundEnabled: true,
                    currentROM: null
                },
                settings: {
                    file: '',
                    checker: null
                },
                loading: {
                    checker: null
                }
            };
        }
    };
})();

// Make available globally for emulator pages
if (typeof window !== 'undefined') {
    window.EmulatorState = EmulatorState;
}
