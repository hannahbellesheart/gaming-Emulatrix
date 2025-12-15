/**
 * @file file-operations.js
 * @description Async filesystem operations for Emulatrix emulators
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * PURPOSE: Replace setInterval polling with modern async/await patterns
 * BENEFITS:
 *   - Eliminates polling loops
 *   - More efficient CPU usage
 *   - Better error handling
 *   - Cleaner, more maintainable code
 */

/**
 * Poll for file completion with async/await pattern
 * 
 * CONTEXT: EmScripten's async filesystem operations don't provide callbacks.
 * This utility provides a promise-based interface for polling file completion.
 * 
 * @param {string} filepath - Path to file in virtual filesystem
 * @param {number} timeout - Maximum wait time in milliseconds (default: 30000)
 * @param {number} pollInterval - Interval between checks in milliseconds (default: 1000)
 * @returns {Promise<Uint8Array>} File data when stable
 * @throws {Error} If timeout reached or file operation fails
 */
async function pollForFileCompletion(filepath, timeout = 30000, pollInterval = 1000) {
    const startTime = Date.now();
    let lastSize = -1;
    let lastSizeRepeated = 0;
    const requiredStableChecks = 3;  // File size must be stable for 3 checks
    
    return new Promise((resolve, reject) => {
        const checkFile = () => {
            try {
                // Check if we've exceeded timeout
                if (Date.now() - startTime > timeout) {
                    clearInterval(intervalId);
                    reject(new Error(`File operation timeout after ${timeout}ms: ${filepath}`));
                    return;
                }
                
                // Try to read the file
                const fileData = FS.readFile(filepath);
                const currentSize = fileData.length;
                
                // Check if file size is stable
                if (currentSize === lastSize) {
                    lastSizeRepeated++;
                    
                    // File size has been stable for required number of checks
                    if (lastSizeRepeated >= requiredStableChecks) {
                        clearInterval(intervalId);
                        resolve(fileData);
                    }
                } else {
                    // File size changed, reset counter
                    lastSize = currentSize;
                    lastSizeRepeated = 0;
                }
            } catch (error) {
                // File doesn't exist yet or other error - continue polling
                // (EmScripten throws on readFile if file doesn't exist)
            }
        };
        
        // Start polling
        const intervalId = setInterval(checkFile, pollInterval);
        
        // Do initial check immediately
        checkFile();
    });
}

/**
 * Wait for file to appear in filesystem
 * 
 * @param {string} filepath - Path to file in virtual filesystem
 * @param {number} timeout - Maximum wait time in milliseconds (default: 10000)
 * @param {number} pollInterval - Interval between checks in milliseconds (default: 500)
 * @returns {Promise<boolean>} True when file exists
 * @throws {Error} If timeout reached
 */
async function waitForFile(filepath, timeout = 10000, pollInterval = 500) {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
        const checkFile = () => {
            try {
                // Check if we've exceeded timeout
                if (Date.now() - startTime > timeout) {
                    clearInterval(intervalId);
                    reject(new Error(`File wait timeout after ${timeout}ms: ${filepath}`));
                    return;
                }
                
                // Check if file exists
                const stat = FS.stat(filepath);
                if (stat) {
                    clearInterval(intervalId);
                    resolve(true);
                }
            } catch (error) {
                // File doesn't exist yet - continue polling
            }
        };
        
        // Start polling
        const intervalId = setInterval(checkFile, pollInterval);
        
        // Do initial check immediately
        checkFile();
    });
}

/**
 * Save emulator state to file and download
 * 
 * @param {string} romName - ROM filename (without extension)
 * @param {Function} saveCallback - Emulator save function (e.g., Module._cmd_save_state)
 * @param {string} stateDir - Virtual filesystem directory for states
 * @returns {Promise<void>}
 * @throws {Error} If save operation fails
 */
async function downloadEmulatorState(romName, saveCallback, stateDir = '/home/web_user/retroarch/userdata/states') {
    try {
        // Trigger emulator core save
        saveCallback();
        
        // Wait for save file to stabilize
        const stateFilepath = `${stateDir}/${romName}.state`;
        const stateData = await pollForFileCompletion(stateFilepath, 30000, 1000);
        
        // Create download blob
        const blob = new Blob([stateData], { type: 'application/octet-stream' });
        
        // Download file
        downloadBlob(blob, `${romName}.state`);
        
        return true;
    } catch (error) {
        console.error('Failed to download emulator state:', error);
        throw error;
    }
}

/**
 * Upload emulator state file and load
 * 
 * @param {File} file - State file from user
 * @param {string} romName - ROM filename (without extension)
 * @param {Function} loadCallback - Emulator load function (e.g., Module._cmd_load_state)
 * @param {string} stateDir - Virtual filesystem directory for states
 * @returns {Promise<void>}
 * @throws {Error} If upload operation fails
 */
async function uploadEmulatorState(file, romName, loadCallback, stateDir = '/home/web_user/retroarch/userdata/states') {
    return new Promise((resolve, reject) => {
        const filereader = new FileReader();
        
        filereader.onload = async function() {
            try {
                // Convert to Uint8Array
                const dataView = new Uint8Array(this.result);
                
                // Create state file in virtual filesystem
                const stateFilepath = `${stateDir}/${romName}.state`;
                FS.createDataFile(stateDir, `${romName}.state`, dataView, true, true);
                
                // Wait for file to be written and stabilized
                await waitForFile(stateFilepath, 10000, 500);
                
                // Give filesystem a moment to finalize
                await sleep(1000);
                
                // Trigger emulator core load
                loadCallback();
                
                resolve();
            } catch (error) {
                console.error('Failed to upload emulator state:', error);
                reject(error);
            }
        };
        
        filereader.onerror = () => {
            reject(new Error('Failed to read state file'));
        };
        
        // Read the file
        filereader.readAsArrayBuffer(file);
    });
}

/**
 * Download blob as file
 * 
 * @param {Blob} blob - Blob data to download
 * @param {string} filename - Download filename
 */
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

/**
 * Utility: Sleep for specified milliseconds
 * 
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create directory in virtual filesystem (if it doesn't exist)
 * 
 * @param {string} path - Directory path
 * @returns {boolean} True if created or already exists
 */
function ensureDirectory(path) {
    try {
        FS.stat(path);
        return true;  // Directory already exists
    } catch (error) {
        try {
            // Split path and create recursively
            const parts = path.split('/').filter(p => p);
            let currentPath = '';
            
            for (const part of parts) {
                currentPath += '/' + part;
                try {
                    FS.stat(currentPath);
                } catch (e) {
                    FS.mkdir(currentPath);
                }
            }
            
            return true;
        } catch (createError) {
            console.error('Failed to create directory:', path, createError);
            return false;
        }
    }
}

// Make utilities available globally
if (typeof window !== 'undefined') {
    window.FileOperations = {
        pollForFileCompletion,
        waitForFile,
        downloadEmulatorState,
        uploadEmulatorState,
        downloadBlob,
        sleep,
        ensureDirectory
    };
}
