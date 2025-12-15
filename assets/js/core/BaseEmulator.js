/**
 * @file BaseEmulator.js
 * @description Base class for all Emulatrix emulators (LibRetro-based)
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * PURPOSE: Provide common functionality for all RetroArch/LibRetro emulators
 * ARCHITECTURE: Object-Oriented Programming with inheritance
 * BENEFITS:
 *   - Single implementation of common features
 *   - Consistent behavior across emulators
 *   - Easy to add new emulators
 *   - Better testability and maintainability
 * 
 * @requires emulator-state.js
 * @requires file-operations.js
 * @requires ui-helpers.js
 * @requires keyboard-handler.js
 * @requires retroarch-config.js
 */

class BaseEmulator {
    /**
     * Create a new emulator instance
     * 
     * @param {object} config - Emulator configuration
     *   @param {string} config.name - Emulator name (e.g., 'Nintendo', 'SNES')
     *   @param {string} config.romExtension - Expected ROM extension (e.g., '.nes', '.smc')
     *   @param {string} config.coreFilename - LibRetro core filename (e.g., 'Emulatrix_Nintendo.wasm')
     *   @param {string} config.romFilename - Filename for ROM in virtual FS (e.g., 'game.nes')
     *   @param {object} config.keymap - Custom key mappings (optional)
     */
    constructor(config) {
        this.name = config.name;
        this.romExtension = config.romExtension;
        this.coreFilename = config.coreFilename;
        this.romFilename = config.romFilename;
        this.keymap = config.keymap || {};
        
        // State directories (from constants.js)
        this.stateDir = FILESYSTEM_PATHS.SAVE_STATES;
        this.configDir = FILESYSTEM_PATHS.CONFIG_DIR;
        
        // Initialize state
        EmulatorState.reset();
        
        // Bind event handlers
        this.handleWindowBlur = this.handleWindowBlur.bind(this);
        this.handleWindowFocus = this.handleWindowFocus.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        
        console.log(`${this.name} Emulator initialized`);
    }
    
    /**
     * Initialize and start the emulator with ROM data
     * 
     * @param {Uint8Array} romData - Binary ROM data from parent window
     * @returns {Promise<void>}
     */
    async initialize(romData) {
        try {
            console.log(`Initializing ${this.name} emulator...`);
            
            // Show loading indicator
            UIHelpers.showLoadingIndicator();
            UIHelpers.showContainer();
            
            // Get container dimensions
            const container = document.getElementById('container');
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            
            EmulatorState.setContainerDimensions(width, height);
            
            // Initialize RetroArch configuration
            await RetroArchConfig.initializeEmulator({
                romData,
                romFilename: this.romFilename,
                width,
                height,
                keymap: this.keymap
            });
            
            // Wait for config file to be fully written
            await FileOperations.sleep(TIMING.CONFIG_FILE_WRITE_DELAY_MS);
            
            // Start the emulator
            await this.startEmulator();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start loading checker
            this.startLoadingChecker();
            
            console.log(`${this.name} emulator initialized successfully`);
        } catch (error) {
            console.error(`Failed to initialize ${this.name} emulator:`, error);
            UIHelpers.showErrorMessage(`Failed to start emulator: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Start the emulator core
     * 
     * @returns {Promise<void>}
     */
    async startEmulator() {
        console.log(`Starting ${this.name} core...`);
        
        // Run the emulator with the ROM
        Module.callMain(['-v', `/${this.romFilename}`]);
        
        // Set initial canvas size
        const dims = EmulatorState.getContainerDimensions();
        UIHelpers.resizeCanvas(dims.width, dims.height);
        
        // Resize canvas multiple times (workaround for slow devices)
        await FileOperations.sleep(TIMING.CANVAS_RESIZE_DELAY_MS);
        this.resizeCanvas();
        
        await FileOperations.sleep(TIMING.CANVAS_RESIZE_DELAY_MS);
        this.resizeCanvas();
        
        await FileOperations.sleep(TIMING.CANVAS_RESIZE_DELAY_MS);
        this.resizeCanvas();
    }
    
    /**
     * Start loading checker interval
     */
    startLoadingChecker() {
        const checkerId = setInterval(() => {
            if (typeof Emulator_started !== 'undefined' && Emulator_started === true) {
                EmulatorState.setEmulatorStarted(true);
                UIHelpers.hideLoadingIndicator();
                EmulatorState.stopLoadingChecker();
                
                // Notify parent that emulator is ready
                this.onEmulatorReady();
            }
        }, TIMING.LOADING_CHECK_INTERVAL_MS);
        
        EmulatorState.setLoadingChecker(checkerId);
    }
    
    /**
     * Called when emulator is ready
     * Override in subclasses if needed
     */
    onEmulatorReady() {
        console.log(`${this.name} emulator ready`);
        
        // Enable controls in parent window
        if (typeof parent !== 'undefined' && parent.enableControls) {
            parent.enableControls();
        }
        
        // Update sound setting from parent
        try {
            const soundEnabled = parent.getSoundStatus();
            EmulatorState.setSoundEnabled(soundEnabled);
        } catch (error) {
            EmulatorState.setSoundEnabled(true);
        }
    }
    
    /**
     * Resize emulator canvas
     */
    resizeCanvas() {
        try {
            const container = document.getElementById('container');
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            
            EmulatorState.setContainerDimensions(width, height);
            Module.setCanvasSize(width, height, true);
        } catch (error) {
            console.warn('Failed to resize canvas:', error);
        }
    }
    
    /**
     * Toggle sound on/off
     * 
     * @param {boolean} enabled - Whether sound should be enabled
     */
    toggleSound(enabled) {
        try {
            if (!EmulatorState.isEmulatorStarted()) {
                return;
            }
            
            EmulatorState.setEmulatorRunning(true);
            EmulatorState.setSoundEnabled(enabled);
            
            // Update Emscripten global (if exists)
            if (typeof Emulator_soundEnabled !== 'undefined') {
                Emulator_soundEnabled = enabled;
            }
        } catch (error) {
            console.error('Failed to toggle sound:', error);
        }
    }
    
    /**
     * Reload/restart the ROM
     * 
     * @returns {Promise<void>}
     */
    async reloadROM() {
        try {
            if (!EmulatorState.isEmulatorStarted()) {
                return;
            }
            
            EmulatorState.setEmulatorRunning(true);
            
            // Press F10 key to reload
            await KeyboardHandler.reloadKey();
        } catch (error) {
            console.error('Failed to reload ROM:', error);
        }
    }
    
    /**
     * Download current emulator state (save state)
     * 
     * @returns {Promise<boolean>} Success status
     */
    async downloadState() {
        try {
            if (!EmulatorState.isEmulatorStarted()) {
                console.warn('Emulator not started');
                return false;
            }
            
            if (EmulatorState.isDownloadRunning() || EmulatorState.isUploadRunning()) {
                console.warn('Another file operation is in progress');
                return false;
            }
            
            EmulatorState.setEmulatorRunning(true);
            
            // Get ROM name from parent
            const romName = typeof parent !== 'undefined' && parent.ROMNAME
                ? parent.ROMNAME.replace(/\.[^/.]+$/, '')
                : 'game';
            
            EmulatorState.startDownload(romName);
            
            // Show saving indicator
            UIHelpers.showSavingIndicator();
            
            // Trigger save state
            Module._cmd_save_state();
            
            // Wait for state file to stabilize
            const stateFilepath = `${this.stateDir}/${romName}.state`;
            const stateData = await FileOperations.pollForFileCompletion(
                stateFilepath,
                TIMING.DOWNLOAD_TIMEOUT_MS,
                TIMING.FILE_POLL_INTERVAL_MS
            );
            
            // Create and download blob
            const blob = new Blob([stateData], { type: 'application/octet-stream' });
            FileOperations.downloadBlob(blob, `${romName}.state`);
            
            // Show success message
            UIHelpers.showSuccessMessage(
                typeof parent !== 'undefined' && parent.STRING_SAVED
                    ? parent.STRING_SAVED
                    : 'Game saved!',
                TIMING.SAVE_CONFIRMATION_DURATION_MS
            );
            
            // Cleanup
            EmulatorState.stopDownload();
            
            return true;
        } catch (error) {
            console.error('Failed to download state:', error);
            UIHelpers.showErrorMessage('Failed to save game state');
            EmulatorState.stopDownload();
            return false;
        }
    }
    
    /**
     * Upload and load emulator state (load save state)
     * 
     * @param {File} file - State file from user
     * @returns {Promise<boolean>} Success status
     */
    async uploadState(file) {
        try {
            if (!EmulatorState.isEmulatorStarted()) {
                console.warn('Emulator not started');
                return false;
            }
            
            if (EmulatorState.isUploadRunning() || EmulatorState.isDownloadRunning()) {
                console.warn('Another file operation is in progress');
                return false;
            }
            
            EmulatorState.setEmulatorRunning(true);
            
            // Get ROM name from parent
            const romName = typeof parent !== 'undefined' && parent.ROMNAME
                ? parent.ROMNAME.replace(/\.[^/.]+$/, '')
                : 'game';
            
            // Read file
            const fileData = await this.readFile(file);
            const dataView = new Uint8Array(fileData);
            
            EmulatorState.startUpload(dataView.length);
            
            // Show loading indicator
            UIHelpers.showLoadingUploadIndicator();
            
            // Create state file in virtual filesystem
            FS.createDataFile(this.stateDir, `${romName}.state`, dataView, true, true);
            
            // Wait for file to be written
            await FileOperations.waitForFile(
                `${this.stateDir}/${romName}.state`,
                TIMING.UPLOAD_TIMEOUT_MS / 3,
                TIMING.LOADING_CHECK_INTERVAL_MS
            );
            await FileOperations.sleep(TIMING.FILE_POLL_INTERVAL_MS);
            
            // Load state
            Module._cmd_load_state();
            
            // Hide loading indicator
            UIHelpers.hideLoadingUploadIndicator();
            
            // Show success message
            UIHelpers.showSuccessMessage(
                typeof parent !== 'undefined' && parent.STRING_LOADED
                    ? parent.STRING_LOADED
                    : 'Game loaded!',
                TIMING.SAVE_CONFIRMATION_DURATION_MS
            );
            
            // Cleanup
            EmulatorState.stopUpload();
            
            return true;
        } catch (error) {
            console.error('Failed to upload state:', error);
            UIHelpers.showErrorMessage('Failed to load game state');
            EmulatorState.stopUpload();
            return false;
        }
    }
    
    /**
     * Read file as ArrayBuffer
     * 
     * @param {File} file - File object
     * @returns {Promise<ArrayBuffer>}
     */
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }
    
    /**
     * Setup window event listeners
     */
    setupEventListeners() {
        window.addEventListener('blur', this.handleWindowBlur);
        window.addEventListener('focus', this.handleWindowFocus);
        window.addEventListener('resize', this.handleWindowResize);
    }
    
    /**
     * Handle window blur (pause emulation)
     */
    handleWindowBlur() {
        try {
            EmulatorState.setEmulatorRunning(false);
            if (typeof Emulator_running !== 'undefined') {
                Emulator_running = false;
            }
        } catch (error) {
            console.warn('Failed to pause emulation:', error);
        }
    }
    
    /**
     * Handle window focus (resume emulation)
     */
    handleWindowFocus() {
        try {
            EmulatorState.setEmulatorRunning(true);
            if (typeof Emulator_running !== 'undefined') {
                Emulator_running = true;
            }
        } catch (error) {
            console.warn('Failed to resume emulation:', error);
        }
    }
    
    /**
     * Handle window resize
     */
    handleWindowResize() {
        this.resizeCanvas();
    }
    
    /**
     * Cleanup and destroy emulator
     */
    destroy() {
        console.log(`Destroying ${this.name} emulator...`);
        
        // Remove event listeners
        window.removeEventListener('blur', this.handleWindowBlur);
        window.removeEventListener('focus', this.handleWindowFocus);
        window.removeEventListener('resize', this.handleWindowResize);
        
        // Stop all timers
        EmulatorState.reset();
        
        console.log(`${this.name} emulator destroyed`);
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.BaseEmulator = BaseEmulator;
}
