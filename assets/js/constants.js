/**
 * @file constants.js
 * @description Global constants and configuration values for Emulatrix
 * @exports EMULATOR_TYPES - Map of emulator identifiers
 * @exports ROM_PATHS - Default ROM file paths
 * @exports BANNER_IMAGES - Base64-encoded banner images
 * @author Emulatrix Project
 * @created 2024-12-19
 * @see https://github.com/lrusso/Emulatrix
 */

/**
 * ═══════════════════════════════════════════════════════════════════════
 * EMULATRIX - CENTRALIZED CONSTANTS
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * @file         constants.js
 * @description  Centralized configuration constants for all emulators
 * @version      3.0.0
 * @author       Emulatrix Team
 * @license      GPL-3.0
 * @created      2025-12-15
 * 
 * PURPOSE: Replace magic numbers with documented, meaningful constants
 * BENEFIT: Improves code maintainability and understanding
 */

/**
 * ═══════════════════════════════════════════════════════════════════════
 * TIMING CONSTANTS
 * ═══════════════════════════════════════════════════════════════════════
 * All timing values in milliseconds unless otherwise specified
 */
const TIMING = {
    /**
     * FILE OPERATION POLLING INTERVAL
     * 
     * EXPLANATION: Interval for checking file operation completion
     * USAGE: setInterval for checking save/load state completion
     * WHY 1000ms: Balance between responsiveness and CPU usage
     * 
     * CONTEXT: EmScripten's async filesystem operations don't provide
     * callbacks. We poll the filesystem to detect completion.
     * 
     * TRADE-OFFS:
     * - Lower values (500ms): More responsive, higher CPU usage
     * - Higher values (2000ms): Lower CPU usage, slower UX
     * 
     * OPTIMAL VALUE: 1000ms provides good balance for typical save
     * state operations (2-5 seconds to complete)
     */
    FILE_POLL_INTERVAL_MS: 1000,
    
    /**
     * FILE SIZE STABILITY CHECK THRESHOLD
     * 
     * EXPLANATION: Number of consecutive identical file size checks
     * before considering operation complete
     * 
     * WHY 3: Ensures file write is truly complete, not mid-write
     * 
     * CALCULATION: 3 checks × 1000ms = 3 second stability window
     * PREVENTS: False positives from partially written files
     */
    FILE_SIZE_STABLE_CHECKS: 3,
    
    /**
     * SAVE CONFIRMATION DISPLAY DURATION
     * 
     * EXPLANATION: How long to show "Saved!" confirmation message
     * WHY 2000ms: Long enough to read, short enough not to be annoying
     * UX RESEARCH: 2-3 seconds is optimal for success confirmations
     */
    SAVE_CONFIRMATION_DURATION_MS: 2000,
    
    /**
     * UPLOAD TIMEOUT
     * 
     * EXPLANATION: Maximum time to wait for state upload/load
     * WHY 30000ms: Large save states can take 20-30 seconds
     * USAGE: Timeout for load state operations
     */
    UPLOAD_TIMEOUT_MS: 30000,
    
    /**
     * DOWNLOAD TIMEOUT
     * 
     * EXPLANATION: Maximum time to wait for state download/save
     * WHY 30000ms: Consistent with upload timeout
     */
    DOWNLOAD_TIMEOUT_MS: 30000
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CANVAS/DISPLAY CONSTANTS
 * ═══════════════════════════════════════════════════════════════════════
 */
const DISPLAY = {
    /**
     * DEFAULT CANVAS DIMENSIONS
     * 
     * EXPLANATION: Base resolution for emulator display
     * WHY 1024×589:
     * - 16:9.28 aspect ratio (close to 16:9 widescreen)
     * - Matches original LibRetro core output resolution
     * - Fits standard laptop screens without scrolling
     * - MacBook reference: 1024×768 scaled to 16:9
     * 
     * SCALING: Canvas automatically scales via CSS while maintaining
     * aspect ratio. These are logical pixels, not physical pixels.
     * 
     * PERFORMANCE: Lower resolution = better performance on weak devices
     * QUALITY: Higher resolution = sharper graphics but slower
     */
    CANVAS_WIDTH: 1024,
    CANVAS_HEIGHT: 589,
    
    /**
     * CANVAS ASPECT RATIO
     * 
     * CALCULATION: 1024 / 589 ≈ 1.738 (close to 16:9 = 1.778)
     */
    CANVAS_ASPECT_RATIO: 1.738,
    
    /**
     * RESPONSIVE BREAKPOINTS
     * 
     * EXPLANATION: Screen width thresholds for responsive design
     * WHY THESE VALUES:
     * - 768px: Standard tablet/mobile breakpoint
     * - 1024px: Standard desktop breakpoint
     * 
     * USAGE: Adjust UI elements based on screen size
     */
    MOBILE_WIDTH_THRESHOLD: 768,
    TABLET_WIDTH_THRESHOLD: 1024,
    
    /**
     * MOBILE JOYSTICK DIMENSIONS
     * 
     * EXPLANATION: Touch joystick size for mobile devices
     * WHY 110px: Large enough to use comfortably, small enough not to block screen
     */
    JOYSTICK_SIZE: 110,
    JOYSTICK_OFFSET: 5,
    JOYSTICK_RADIUS: 30
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * KEYBOARD MAPPING CONSTANTS
 * ═══════════════════════════════════════════════════════════════════════
 */
const KEYBOARD = {
    /**
     * EMULATOR CONTROL KEYS
     * 
     * EXPLANATION: Default keyboard mappings for emulator controls
     * 
     * WHY THESE KEYS:
     * - F9/F10/F11: Function keys out of gameplay way, easy to reach
     * - X/Z: Comfortable button positions (close to arrow keys)
     * - Arrow keys: Intuitive d-pad mapping (WASD alternative)
     * - S/A: Start/Select close to arrow keys
     * 
     * ACCESSIBILITY: Can be remapped by users in emulator settings
     */
    SAVE_STATE: 'F10',
    LOAD_STATE: 'F11',
    TOGGLE_SOUND: 'F9',
    RESET_GAME: 'F12',
    
    /**
     * PLAYER CONTROLS
     * 
     * BUTTON MAPPING:
     * - A button: X key (confirm/jump)
     * - B button: Z key (cancel/attack)
     * - Start: S key
     * - Select: A key
     * 
     * RATIONALE: Matches standard NES/SNES controller layout
     */
    BUTTON_A: 'x',
    BUTTON_B: 'z',
    START: 's',
    SELECT: 'a',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    
    /**
     * SPECIAL: Empty key value (Mac compatibility)
     * 
     * EXPLANATION: scroll_lock used as "empty" key
     * WHY: Mac bug where null/nul keys trigger Command key
     * WORKAROUND: scroll_lock is rarely used, safe placeholder
     * 
     * SECURITY NOTE: This prevents accidental Command+Q (quit browser)
     */
    EMPTY_KEY: 'scroll_lock'
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * FILESYSTEM PATHS
 * ═══════════════════════════════════════════════════════════════════════
 */
const PATHS = {
    /**
     * VIRTUAL FILESYSTEM STRUCTURE
     * 
     * EXPLANATION: BrowserFS virtual paths for RetroArch compatibility
     * 
     * ARCHITECTURE:
     * /home/web_user/retroarch/
     *   ├── userdata/
     *   │   ├── states/     (save states - .state files)
     *   │   └── saves/      (SRAM/battery saves - .srm files)
     *   └── config/
     *       └── retroarch.cfg (emulator configuration)
     * 
     * WHY THIS STRUCTURE: Matches RetroArch's default filesystem layout
     * BENEFIT: Compatibility with RetroArch documentation and tools
     */
    ROOT: '/',
    RETROARCH_HOME: '/home/web_user/retroarch',
    SAVE_STATES: '/home/web_user/retroarch/userdata/states',
    BATTERY_SAVES: '/home/web_user/retroarch/userdata/saves',
    CONFIG_DIR: '/home/web_user/retroarch/config',
    ROM_DIR: '/',
    
    /**
     * STATE FILE EXTENSIONS
     */
    STATE_EXTENSION: '.state',
    SRAM_EXTENSION: '.srm',
    CONFIG_EXTENSION: '.cfg'
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * DOSBOX CONSTANTS
 * ═══════════════════════════════════════════════════════════════════════
 */
const DOSBOX = {
    /**
     * CPU CONFIGURATION
     * 
     * EXPLANATION: DOSBox CPU emulation settings
     * 
     * CPU_TYPE options:
     * - 'auto': Automatic detection (fastest)
     * - '386': Intel 80386 (1985)
     * - '486': Intel 80486 (1989)
     * - 'pentium': Pentium (1993)
     * 
     * WHY 'auto': Adapts to game requirements automatically
     */
    CPU_TYPE_DEFAULT: 'auto',
    
    /**
     * RAM CONFIGURATION
     * 
     * EXPLANATION: DOSBox memory allocation
     * WHY 16MB: Standard for DOS games (range: 1-64MB)
     * 
     * HISTORICAL CONTEXT:
     * - DOS games typically used 4-16MB
     * - 16MB provides good compatibility
     * - Modern browsers can easily provide this
     */
    RAM_SIZE_DEFAULT: 16, // Megabytes
    
    /**
     * DOSBOX CONFIGURATION FILE TEMPLATE
     */
    CONFIG_TEMPLATE: '[dosbox]\\nmemsize={RAM}\\n[cpu]\\ncputype={CPU}'
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * EMULATOR CORE IDENTIFIERS
 * ═══════════════════════════════════════════════════════════════════════
 */
const CORES = {
    NINTENDO: 'fceumm',              // Nintendo Entertainment System
    SUPER_NINTENDO: 'snes9x2010',    // Super Nintendo Entertainment System
    GAMEBOY: 'gambatte',             // Game Boy / Game Boy Color
    GAMEBOY_ADVANCE: 'vba_next',     // Game Boy Advance
    SEGA_GENESIS: 'genesis_plus_gx', // Sega Genesis / Mega Drive
    MAME_2003: 'mame2003_plus',      // MAME 2003 Plus (arcade)
    MAME_32: 'mame2000',             // MAME 2000 (older arcade)
    DOSBOX: 'dosbox'                 // DOSBox (PC/DOS)
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * STORAGE KEYS
 * ═══════════════════════════════════════════════════════════════════════
 */
const STORAGE_KEYS = {
    /**
     * LOCALSTORAGE KEYS
     * 
     * EXPLANATION: Keys used for localStorage
     * SECURITY NOTE: Only these keys should be accessed, never use localStorage.clear()
     */
    RETROARCH_CONFIG: 'RetroArch_config',
    EMULATOR_STATE: 'emulator_state',
    SAVE_DATA: 'save_data',
    
    /**
     * INDEXEDDB DATABASE NAMES
     */
    INDEXEDDB_NAME: 'RetroArch',
    FILESYSTEM_KEY: 'fileSystemKey'
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ERROR MESSAGES
 * ═══════════════════════════════════════════════════════════════════════
 */
const ERRORS = {
    FILESYSTEM_INIT_FAILED: 'Failed to initialize virtual filesystem',
    ROM_LOAD_FAILED: 'Failed to load ROM file',
    SAVE_STATE_FAILED: 'Failed to save game state',
    LOAD_STATE_FAILED: 'Failed to load game state',
    UNSUPPORTED_BROWSER: 'Your browser does not support WebAssembly',
    INDEXEDDB_UNAVAILABLE: 'IndexedDB not available - saves will not persist'
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * EXPORT (for ES6 modules)
 * ═══════════════════════════════════════════════════════════════════════
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TIMING,
        DISPLAY,
        KEYBOARD,
        PATHS,
        DOSBOX,
        CORES,
        STORAGE_KEYS,
        ERRORS
    };
}
