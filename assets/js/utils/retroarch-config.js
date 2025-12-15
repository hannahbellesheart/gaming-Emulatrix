/**
 * @file retroarch-config.js
 * @description RetroArch configuration builder for Emulatrix emulators
 * @author Emulatrix Refactoring Team
 * @created 2024-12-19
 * 
 * PURPOSE: Centralize RetroArch configuration generation
 * BENEFITS:
 *   - Eliminates hundreds of lines of duplicate config code
 *   - Consistent configuration across all emulators
 *   - Easy to update key mappings
 */

const RetroArchConfig = (() => {
    /**
     * Generate complete RetroArch configuration
     * 
     * @param {object} options - Configuration options
     *   @param {number} options.width - Container width
     *   @param {number} options.height - Container height
     *   @param {object} options.keymap - Custom key mappings (optional)
     * @returns {string} Complete configuration file content
     */
    function generateConfig(options) {
        const { width, height, keymap = {} } = options;
        const emptyValue = 'scroll_lock';  // Mac workaround for null key bug
        let config = '';
        
        // Browser directory
        config += 'rgui_browser_directory = /\n';
        
        // Player 1 - Primary controls
        config += `input_player1_start = ${keymap.start || 's'}\n`;
        config += `input_player1_select = ${keymap.select || 'a'}\n`;
        config += `input_player1_a = ${keymap.a || 'x'}\n`;
        config += `input_player1_b = ${keymap.b || 'z'}\n`;
        
        // System keys
        config += 'input_audio_mute = f9\n';
        config += 'input_reset = f10\n';
        
        // Disable unwanted functions
        const disabledFunctions = [
            'input_toggle_fast_forward',
            'input_hold_fast_forward',
            'input_toggle_slowmotion',
            'input_hold_slowmotion',
            'input_save_state',
            'input_load_state',
            'input_toggle_fullscreen',
            'input_exit_emulator',
            'input_state_slot_increase',
            'input_state_slot_decrease',
            'input_rewind',
            'input_movie_record_toggle',
            'input_pause_toggle',
            'input_frame_advance',
            'input_shader_next',
            'input_shader_prev',
            'input_cheat_index_plus',
            'input_cheat_index_minus',
            'input_cheat_toggle',
            'input_screenshot',
            'input_osk_toggle',
            'input_netplay_game_watch',
            'input_volume_up',
            'input_volume_down',
            'input_overlay_next',
            'input_disk_eject_toggle',
            'input_disk_next',
            'input_disk_prev',
            'input_grab_mouse_toggle',
            'input_game_focus_toggle',
            'input_menu_toggle',
            'input_recording_toggle',
            'input_streaming_toggle'
        ];
        
        disabledFunctions.forEach(func => {
            config += `${func} = ${emptyValue}\n`;
        });
        
        // Disable extra Player 1 buttons
        const player1ExtraButtons = [
            'x', 'y', 'l', 'l2', 'l3', 'r', 'r2', 'r3',
            'l_x_plus', 'l_x_minus', 'l_y_plus', 'l_y_minus',
            'r_x_plus', 'r_x_minus', 'r_y_plus', 'r_y_minus',
            'gun_trigger', 'gun_trigger_axis', 'gun_trigger_btn', 'gun_trigger_mbtn',
            'gun_offscreen_shot', 'gun_aux_a', 'gun_aux_b', 'gun_aux_c',
            'gun_start', 'gun_select', 'gun_dpad_up', 'gun_dpad_down',
            'gun_dpad_left', 'gun_dpad_right', 'turbo'
        ];
        
        player1ExtraButtons.forEach(button => {
            config += `input_player1_${button} = ${emptyValue}\n`;
        });
        
        // Disable all other players (2-5)
        for (let player = 2; player <= 5; player++) {
            const allButtons = [
                'up', 'down', 'left', 'right', 'start', 'select',
                'a', 'b', 'x', 'y', 'l', 'l2', 'l3', 'r', 'r2', 'r3',
                'l_x_plus', 'l_x_minus', 'l_y_plus', 'l_y_minus',
                'r_x_plus', 'r_x_minus', 'r_y_plus', 'r_y_minus',
                'gun_trigger', 'gun_trigger_axis', 'gun_trigger_btn', 'gun_trigger_mbtn',
                'gun_offscreen_shot', 'gun_aux_a', 'gun_aux_b', 'gun_aux_c',
                'gun_start', 'gun_select', 'gun_dpad_up', 'gun_dpad_down',
                'gun_dpad_left', 'gun_dpad_right', 'turbo'
            ];
            
            allButtons.forEach(button => {
                config += `input_player${player}_${button} = ${emptyValue}\n`;
            });
        }
        
        // Video configuration
        config += 'video_vsync = true\n';
        config += 'video_scale = 1\n';
        config += `video_window_x = ${width}\n`;
        config += `video_window_y = ${height}\n`;
        config += 'aspect_ratio_index = 23\n';
        config += `custom_viewport_width = ${width}\n`;
        config += `custom_viewport_height = ${height}\n`;
        config += 'custom_viewport_x = 0\n';
        config += 'custom_viewport_y = 0\n';
        
        // Audio configuration
        config += 'audio_latency = 128\n';
        
        // Hide notification messages
        config += 'video_message_pos_x = -100\n';
        config += 'video_message_pos_y = -100\n';
        config += 'menu_enable_widgets = false\n';
        
        return config;
    }
    
    /**
     * Initialize emulator with ROM and configuration
     * 
     * @param {object} options - Initialization options
     *   @param {Uint8Array} options.romData - ROM binary data
     *   @param {string} options.romFilename - ROM filename
     *   @param {number} options.width - Container width
     *   @param {number} options.height - Container height
     *   @param {string} options.romPath - ROM path in virtual FS (default: '/')
     *   @param {object} options.keymap - Custom key mappings (optional)
     * @returns {Promise<string>} Configuration file content
     */
    async function initializeEmulator(options) {
        const {
            romData,
            romFilename,
            width,
            height,
            romPath = '/',
            keymap = {}
        } = options;
        
        try {
            // Create ROM file in virtual filesystem
            FS.createDataFile(romPath, romFilename, new Uint8Array(romData), true, false);
            
            // Create RetroArch directories
            FileOperations.ensureDirectory('/home/web_user');
            FileOperations.ensureDirectory('/home/web_user/retroarch');
            FileOperations.ensureDirectory('/home/web_user/retroarch/userdata');
            FileOperations.ensureDirectory('/home/web_user/retroarch/userdata/states');
            
            // Generate configuration
            const configContent = generateConfig({ width, height, keymap });
            
            // Create configuration file
            FS.createDataFile(
                '/home/web_user/retroarch/userdata',
                'retroarch.cfg',
                configContent,
                true,
                true
            );
            
            // Wait for configuration file to be written
            await FileOperations.waitForFile(
                '/home/web_user/retroarch/userdata/retroarch.cfg',
                10000,
                500
            );
            
            return configContent;
        } catch (error) {
            console.error('Failed to initialize emulator:', error);
            throw error;
        }
    }
    
    return {
        generateConfig,
        initializeEmulator
    };
})();

// Make available globally
if (typeof window !== 'undefined') {
    window.RetroArchConfig = RetroArchConfig;
}
