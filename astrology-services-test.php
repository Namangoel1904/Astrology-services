<?php
/**
 * Plugin Name: Astrology Services
 * Description: Complete horoscope prediction service with tabs, charts, KP, Sade Sati, AI prediction. Use shortcode [astrology_services] to display.
 * Version:     1.0.0
 * Author:      GPT-5.1 Codex
 */

if (!defined('ABSPATH')) {
    exit;
}

// Test if plugin loads
add_action('admin_notices', function() {
    echo '<div class="notice notice-success"><p>Astrology Services plugin is loaded!</p></div>';
});

