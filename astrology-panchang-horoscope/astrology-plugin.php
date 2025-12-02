<?php
/**
 * Plugin Name: Astrology Panchang & Horoscope
 * Plugin URI: https://yoursite.com
 * Description: A complete astrology solution with Panchang and Daily Horoscope features
 * Version: 1.9.0
 * Author: Your Name
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('ASTROLOGY_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ASTROLOGY_PLUGIN_PATH', plugin_dir_path(__FILE__));

class AstrologyPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('astrology_page', array($this, 'astrology_shortcode'));
        add_action('wp_ajax_astrology_panchang', array($this, 'handle_panchang_request'));
        add_action('wp_ajax_astrology_horoscope', array($this, 'handle_horoscope_request'));
        add_action('wp_ajax_astrology_weekly_horoscope', array($this, 'handle_weekly_horoscope_request'));
        add_action('wp_ajax_astrology_geocode', array($this, 'handle_geocode_request'));
        add_action('wp_ajax_nopriv_astrology_panchang', array($this, 'handle_panchang_request'));
        add_action('wp_ajax_nopriv_astrology_horoscope', array($this, 'handle_horoscope_request'));
        add_action('wp_ajax_nopriv_astrology_weekly_horoscope', array($this, 'handle_weekly_horoscope_request'));
        add_action('wp_ajax_nopriv_astrology_geocode', array($this, 'handle_geocode_request'));
        add_action('wp_head', array($this, 'add_social_meta_tags'));
    }
    
    public function init() {
        // Plugin initialization
    }
    
    public function enqueue_scripts() {
        wp_enqueue_style('astrology-style', ASTROLOGY_PLUGIN_URL . 'assets/style.css', array(), '1.0.0');
    }
    
    public function add_social_meta_tags() {
        // Only add meta tags if the shortcode is present on the current page
        global $post;
        
        // Check if shortcode exists in the post content
        $has_shortcode = false;
        
        if (is_a($post, 'WP_Post') && !empty($post->post_content)) {
            // Check if shortcode exists in post content
            if (has_shortcode($post->post_content, 'astrology_page')) {
                $has_shortcode = true;
            }
        }
        
        // Allow filtering for custom conditions (e.g., page builders, specific page IDs)
        // Usage: add_filter('astrology_show_social_meta', function($show, $post) { return true; }, 10, 2);
        $has_shortcode = apply_filters('astrology_show_social_meta', $has_shortcode, $post);
        
        // If no shortcode found, don't add meta tags (prevents showing on all pages)
        if (!$has_shortcode) {
            return;
        }
        
        $image_url = 'https://drjyotijoshi.com/wp-content/uploads/2025/10/31-10-2025-2.jpeg';
        $title = 'पंचांग आणि दैनिक भविष्य';
        $description = 'दैनिक पंचांग तपशील आणि राशिफल - आपल्या राशीचे दैनिक भविष्य';
        $site_url = home_url();
        
        // Get current URL safely
        if (is_singular() && is_a($post, 'WP_Post')) {
            $current_url = get_permalink($post->ID);
        } else {
            $current_url = (is_ssl() ? 'https://' : 'http://') . 
                          (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '') . 
                          (isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/');
        }
        
        // Open Graph Meta Tags
        echo '<meta property="og:type" content="website" />' . "\n";
        echo '<meta property="og:title" content="' . esc_attr($title) . '" />' . "\n";
        echo '<meta property="og:description" content="' . esc_attr($description) . '" />' . "\n";
        echo '<meta property="og:image" content="' . esc_url($image_url) . '" />' . "\n";
        echo '<meta property="og:image:width" content="1200" />' . "\n";
        echo '<meta property="og:image:height" content="630" />' . "\n";
        echo '<meta property="og:url" content="' . esc_url($current_url) . '" />' . "\n";
        echo '<meta property="og:site_name" content="' . esc_attr(get_bloginfo('name')) . '" />' . "\n";
        echo '<meta property="og:locale" content="mr_IN" />' . "\n";
        
        // Twitter Card Meta Tags
        echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
        echo '<meta name="twitter:title" content="' . esc_attr($title) . '" />' . "\n";
        echo '<meta name="twitter:description" content="' . esc_attr($description) . '" />' . "\n";
        echo '<meta name="twitter:image" content="' . esc_url($image_url) . '" />' . "\n";
        
        // Additional Meta Tags for WhatsApp
        echo '<meta name="description" content="' . esc_attr($description) . '" />' . "\n";
        echo '<link rel="image_src" href="' . esc_url($image_url) . '" />' . "\n";
    }
    
    public function astrology_shortcode($atts) {
        $atts = shortcode_atts(array(
            'title' => 'पंचांग आणि दैनिक भविष्य',
            'subtitle' => 'दैनिक पंचांग तपशील आणि राशिफल'
        ), $atts);
        
        ob_start();
        ?>
        <style>
        /* Hide WordPress page title and breadcrumbs */
        .page-title, .breadcrumb, .entry-title, .page-header, .woocommerce-breadcrumb,
        .ast-breadcrumbs-wrapper, .breadcrumbs, .breadcrumb-trail, .yoast-breadcrumb,
        .rank-math-breadcrumb, .wpseo-breadcrumb, .breadcrumb-navxt, .breadcrumb-list,
        .page-header-title, .page-title-wrapper, .entry-header .entry-title,
        .page .entry-title, .single .entry-title, .archive .entry-title,
        .page-header .page-title, .page-header h1, .page-header .entry-title {
            display: none !important;
        }
        
        /* Hide breadcrumb navigation */
        nav[aria-label="breadcrumb"], .breadcrumb-nav, .breadcrumb-navigation,
        .breadcrumb-container, .breadcrumb-wrapper, .breadcrumb-area,
        .page-breadcrumb, .site-breadcrumb, .main-breadcrumb {
            display: none !important;
        }
        
        /* Hide specific theme breadcrumbs */
        .ast-breadcrumbs, .astra-breadcrumbs, .generate-breadcrumbs,
        .oceanwp-breadcrumbs, .storefront-breadcrumbs, .neve-breadcrumbs,
        .kadence-breadcrumbs, .blocksy-breadcrumbs, .hello-breadcrumbs {
            display: none !important;
        }
        
        /* Hide common page title selectors */
        h1.page-title, h1.entry-title, .page-title, .entry-title,
        .page-header h1, .page-header .page-title, .page-header .entry-title,
        .content-area h1, .main-content h1, .site-content h1 {
            display: none !important;
        }
        </style>
        
        <div id="astrology-container">
            <!-- Header -->
            <div class="astrology-header">
                <div class="astrology-container">
                    <h1><?php echo esc_html($atts['title']); ?></h1>
                    <p><?php echo esc_html($atts['subtitle']); ?></p>
                </div>
            </div>

            <div class="astrology-main-content">
                <div class="astrology-container">
                    <!-- Image Section -->
                    <div class="astrology-image-section" style="margin-bottom: 2rem; display: flex; justify-content: center;">
                        <img 
                            src="https://drjyotijoshi.com/wp-content/uploads/2025/10/31-10-2025-2.jpeg" 
                            alt="Panchang Image" 
                            style="width: 100%; max-width: 1152px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
                        />
                    </div>

                    <div class="astrology-grid">
                        <!-- Panchang Section -->
                        <div class="astrology-card">
                            <div class="astrology-card-header">
                                <h2>आजचे पंचांग</h2>
                                <p>दैनिक पंचांग तपशील</p>
                            </div>
                            
                            <form id="astrology-panchang-form">
                                <input type="hidden" id="astrology-city" name="city" value="Delhi">
                                <input type="hidden" id="astrology-date" name="date" value="">
                                <input type="hidden" id="astrology-lat" name="lat" value="28.6139">
                                <input type="hidden" id="astrology-lon" name="lon" value="77.2090">
                                <input type="hidden" id="astrology-tz" name="tz" value="5.5">
                                <input type="hidden" id="astrology-lang" name="lang" value="mr">

                                <div class="astrology-form-group astrology-hidden">
                                    <button type="submit" id="astrology-panchang-btn" class="astrology-btn astrology-btn-primary">
                                        पंचांग मिळवा
                                    </button>
                                </div>
                            </form>

                            <div id="astrology-panchang-error" class="astrology-error astrology-hidden"></div>
                            <div id="astrology-panchang-result" class="astrology-result-section astrology-hidden"></div>
                        </div>

                        <!-- Horoscope Section -->
                        <div class="astrology-card">
                            <div class="astrology-card-header">
                                <h2>राशिफल</h2>
                                <p>दैनिक आणि साप्ताहिक भविष्य</p>
                            </div>
                            
                            <form id="astrology-horoscope-form">
                                <input type="hidden" id="astrology-horoscope-date" name="horoscope-date" value="">
                                <input type="hidden" id="astrology-horoscope-week" name="horoscope-week" value="thisweek">
                                
                                <div class="astrology-form-group">
                                    <label class="astrology-form-label">प्रकार निवडा</label>
                                    <div class="astrology-radio-group">
                                        <label class="astrology-radio">
                                            <input type="radio" name="horoscope-type" value="daily" checked>
                                            <span>दैनिक</span>
                                        </label>
                                        <label class="astrology-radio" style="margin-left:16px;">
                                            <input type="radio" name="horoscope-type" value="weekly">
                                            <span>साप्ताहिक</span>
                                        </label>
                                    </div>
                                </div>

                                <div class="astrology-form-group">
                                    <label class="astrology-form-label">राशी निवडा</label>
                                    <select id="astrology-zodiac" name="zodiac" class="astrology-form-input" required>
                                        <option value="">आपली राशी निवडा</option>
                                        <option value="1">मेष (Aries)</option>
                                        <option value="2">वृषभ (Taurus)</option>
                                        <option value="3">मिथुन (Gemini)</option>
                                        <option value="4">कर्क (Cancer)</option>
                                        <option value="5">सिंह (Leo)</option>
                                        <option value="6">कन्या (Virgo)</option>
                                        <option value="7">तुला (Libra)</option>
                                        <option value="8">वृश्चिक (Scorpio)</option>
                                        <option value="9">धनु (Sagittarius)</option>
                                        <option value="10">मकर (Capricorn)</option>
                                        <option value="11">कुंभ (Aquarius)</option>
                                        <option value="12">मीन (Pisces)</option>
                                    </select>
                                </div>

                                <div class="astrology-form-group">
                                    <button type="submit" id="astrology-horoscope-btn" class="astrology-btn astrology-btn-secondary">
                                        राशिफल मिळवा
                                    </button>
                                </div>
                            </form>

                            <div id="astrology-horoscope-error" class="astrology-error astrology-hidden"></div>
                            <div id="astrology-horoscope-result" class="astrology-result-section astrology-hidden"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
        (function() {
            'use strict';
            
            // Wait for DOM to be ready
            function ready(fn) {
                if (document.readyState !== 'loading') {
                    fn();
                } else {
                    document.addEventListener('DOMContentLoaded', fn);
                }
            }
            
            ready(function() {
                console.log('Astrology plugin inline script loaded');
                
                // Set today's date
                function setToday() {
                    var dateInput = document.getElementById('astrology-date');
                    if (dateInput) {
                        var today = new Date();
                        var dd = String(today.getDate()).padStart(2, '0');
                        var mm = String(today.getMonth() + 1).padStart(2, '0');
                        var yyyy = today.getFullYear();
                        dateInput.value = dd + '/' + mm + '/' + yyyy;
                    }
                }

                function setHoroscopeToday() {
                    var dateInput = document.getElementById('astrology-horoscope-date');
                    if (dateInput) {
                        var today = new Date();
                        var dd = String(today.getDate()).padStart(2, '0');
                        var mm = String(today.getMonth() + 1).padStart(2, '0');
                        var yyyy = today.getFullYear();
                        dateInput.value = dd + '/' + mm + '/' + yyyy;
                    }
                }

                // Set today's date on page load
                setToday();
                setHoroscopeToday();
                
                // Auto-load Panchang data on page load
                setTimeout(function() {
                    loadPanchangData();
                }, 1000); // Wait 1 second for page to fully load
                
                function loadPanchangData() {
                    console.log('Auto-loading Panchang data...');
                    
                    var btn = document.getElementById('astrology-panchang-btn');
                    var errorDiv = document.getElementById('astrology-panchang-error');
                    var resultDiv = document.getElementById('astrology-panchang-result');
                    
                    if (btn) btn.innerHTML = '<span class="astrology-loading"></span> पंचांग मिळवत आहे...';
                    if (errorDiv) errorDiv.classList.add('astrology-hidden');
                    if (resultDiv) resultDiv.classList.add('astrology-hidden');

                    var formData = new FormData();
                    formData.append('action', 'astrology_panchang');
                    formData.append('nonce', '<?php echo wp_create_nonce('astrology_nonce'); ?>');
                    formData.append('date', document.getElementById('astrology-date').value);
                    formData.append('lat', document.getElementById('astrology-lat').value);
                    formData.append('lon', document.getElementById('astrology-lon').value);
                    formData.append('tz', document.getElementById('astrology-tz').value);
                    formData.append('lang', document.getElementById('astrology-lang').value);
                    
                    fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Auto-loaded Panchang API Response:', data);
                        if (data.success) {
                            showPanchangResult(data.data);
                        } else {
                            if (errorDiv) {
                                errorDiv.textContent = 'त्रुटी: ' + (data.data || 'Unknown error');
                                errorDiv.classList.remove('astrology-hidden');
                            }
                        }
                    })
                    .catch(error => {
                        if (errorDiv) {
                            errorDiv.textContent = 'त्रुटी: ' + error.message;
                            errorDiv.classList.remove('astrology-hidden');
                        }
                    })
                    .finally(() => {
                        if (btn) btn.innerHTML = 'पंचांग मिळवा';
                    });
                }

                // Today button handlers
                var todayBtn = document.getElementById('astrology-today-btn');
                if (todayBtn) {
                    todayBtn.addEventListener('click', setToday);
                }
                
                var horoscopeTodayBtn = document.getElementById('astrology-horoscope-today-btn');
                if (horoscopeTodayBtn) {
                    horoscopeTodayBtn.addEventListener('click', setHoroscopeToday);
                }
                
                // Test city search button
                var testCityBtn = document.getElementById('astrology-test-city');
                if (testCityBtn) {
                    testCityBtn.addEventListener('click', function() {
                        var query = document.getElementById('astrology-city').value;
                        if (query.length < 2) {
                            alert('Please enter at least 2 characters');
                            return;
                        }
                        console.log('Manual city search test for:', query);
                        searchCities(query);
                    });
                }

                // City search functionality
                var citySearchTimeout;
                var cityInput = document.getElementById('astrology-city');
                if (cityInput) {
                    cityInput.addEventListener('input', function() {
                        var query = this.value;
                        console.log('City input changed:', query);
                        
                        if (query.length < 2) {
                            console.log('Query too short, skipping search');
                            return;
                        }
                        
                        clearTimeout(citySearchTimeout);
                        citySearchTimeout = setTimeout(function() {
                            console.log('Starting city search for:', query);
                            searchCities(query);
                        }, 300);
                    });
                }

                function searchCities(query) {
                    console.log('Making city search request...');
                    
                    var formData = new FormData();
                    formData.append('action', 'astrology_geocode');
                    formData.append('nonce', '<?php echo wp_create_nonce('astrology_nonce'); ?>');
                    formData.append('q', query);
                    formData.append('limit', '8');
                    formData.append('countrycodes', 'in');
                    
                    fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('City search response:', data);
                        if (data.success && data.data.length > 0) {
                            var firstResult = data.data[0];
                            document.getElementById('astrology-lat').value = firstResult.lat;
                            document.getElementById('astrology-lon').value = firstResult.lon;
                            document.getElementById('astrology-city').value = firstResult.display_name;
                            document.getElementById('astrology-coords-display').textContent = firstResult.lat + ', ' + firstResult.lon;
                            
                            console.log('Coordinates set:', firstResult.lat, firstResult.lon);
                        } else {
                            console.log('No cities found for:', query);
                        }
                    })
                    .catch(error => {
                        console.log('City search error:', error);
                    });
                }

                // Panchang form submission
                var panchangForm = document.getElementById('astrology-panchang-form');
                if (panchangForm) {
                    panchangForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        console.log('Panchang form submitted');
                    
                    var btn = document.getElementById('astrology-panchang-btn');
                    var errorDiv = document.getElementById('astrology-panchang-error');
                    var resultDiv = document.getElementById('astrology-panchang-result');
                    
                    btn.innerHTML = '<span class="astrology-loading"></span> पंचांग मिळवत आहे...';
                    btn.disabled = true;
                    errorDiv.classList.add('astrology-hidden');
                    resultDiv.classList.add('astrology-hidden');

                    var formData = new FormData();
                    formData.append('action', 'astrology_panchang');
                    formData.append('nonce', '<?php echo wp_create_nonce('astrology_nonce'); ?>');
                    formData.append('date', document.getElementById('astrology-date').value);
                    formData.append('lat', document.getElementById('astrology-lat').value);
                    formData.append('lon', document.getElementById('astrology-lon').value);
                    formData.append('tz', document.getElementById('astrology-tz').value);
                    formData.append('lang', document.getElementById('astrology-lang').value);
                    
                    fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Panchang API Response:', data);
                        if (data.success) {
                            showPanchangResult(data.data);
                        } else {
                            errorDiv.textContent = 'त्रुटी: ' + (data.data || 'Unknown error');
                            errorDiv.classList.remove('astrology-hidden');
                        }
                    })
                    .catch(error => {
                        errorDiv.textContent = 'त्रुटी: ' + error.message;
                        errorDiv.classList.remove('astrology-hidden');
                    })
                    .finally(() => {
                        btn.innerHTML = 'पंचांग मिळवा';
                        btn.disabled = false;
                    });
                    });
                }

                // Horoscope form submission
                var horoscopeForm = document.getElementById('astrology-horoscope-form');
                if (horoscopeForm) {
                    horoscopeForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        console.log('Horoscope form submitted');
                    
                    var btn = document.getElementById('astrology-horoscope-btn');
                    var errorDiv = document.getElementById('astrology-horoscope-error');
                    var resultDiv = document.getElementById('astrology-horoscope-result');
                    
                    btn.innerHTML = '<span class="astrology-loading"></span> राशिफल मिळवत आहे...';
                    btn.disabled = true;
                    errorDiv.classList.add('astrology-hidden');
                    resultDiv.classList.add('astrology-hidden');

                    // Determine type: daily or weekly
                    var type = (document.querySelector('input[name="horoscope-type"]:checked') || {}).value || 'daily';

                    var formData = new FormData();
                    if (type === 'weekly') {
                        formData.append('action', 'astrology_weekly_horoscope');
                        formData.append('week', document.getElementById('astrology-horoscope-week').value || 'thisweek');
                    } else {
                        formData.append('action', 'astrology_horoscope');
                    }
                    formData.append('nonce', '<?php echo wp_create_nonce('astrology_nonce'); ?>');
                    formData.append('date', document.getElementById('astrology-horoscope-date').value);
                    formData.append('zodiac', document.getElementById('astrology-zodiac').value);
                    
                    fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            if (type === 'weekly') {
                                showWeeklyHoroscopeResult(data.data);
                            } else {
                                showHoroscopeResult(data.data);
                            }
                        } else {
                            errorDiv.textContent = 'त्रुटी: ' + (data.data || 'Unknown error');
                            errorDiv.classList.remove('astrology-hidden');
                        }
                    })
                    .catch(error => {
                        errorDiv.textContent = 'त्रुटी: ' + error.message;
                        errorDiv.classList.remove('astrology-hidden');
                    })
                    .finally(() => {
                        btn.innerHTML = 'राशिफल मिळवा';
                        btn.disabled = false;
                    });
                    });
                }

                function showPanchangResult(data) {
                    var resultDiv = document.getElementById('astrology-panchang-result');
                    console.log('Panchang API Response:', data);
                    
                    var html = '';
                    
                    // Basic Panchang Section
                    html += '<div class="astrology-result-card">' +
                        '<h3>आजचे पंचांग</h3>';
                    
                    if (data.tithi) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">तिथि</span>' +
                            '<span class="astrology-result-value">' + data.tithi.name + ' (' + data.tithi.type + ')</span>' +
                        '</div>';
                    }
                    
                    if (data.nakshatra) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">नक्षत्र</span>' +
                            '<span class="astrology-result-value">' + data.nakshatra.name + '</span>' +
                        '</div>';
                    }
                    
                    if (data.yoga) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">योग</span>' +
                            '<span class="astrology-result-value">' + data.yoga.name + '</span>' +
                        '</div>';
                    }
                    
                    if (data.karana) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">करण</span>' +
                            '<span class="astrology-result-value">' + data.karana.name + '</span>' +
                        '</div>';
                    }
                    
                    if (data.day) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">वार</span>' +
                            '<span class="astrology-result-value">' + data.day.name + '</span>' +
                        '</div>';
                    }
                    
                    html += '</div>';
                    
                    // Sun and Moon Calculations
                    html += '<div class="astrology-result-card">' +
                        '<h3>सूर्य आणि चंद्र गणना</h3>';
                    
                    if (data.advanced_details && data.advanced_details.sun_rise) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">सूर्योदय</span>' +
                            '<span class="astrology-result-value">' + data.advanced_details.sun_rise + '</span>' +
                        '</div>';
                    }
                    
                    if (data.advanced_details && data.advanced_details.moon_rise) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">चंद्रोदय</span>' +
                            '<span class="astrology-result-value">' + data.advanced_details.moon_rise + '</span>' +
                        '</div>';
                    }
                    
                    if (data.advanced_details && data.advanced_details.sun_set) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">सूर्यास्त</span>' +
                            '<span class="astrology-result-value">' + data.advanced_details.sun_set + '</span>' +
                        '</div>';
                    }
                    
                    if (data.advanced_details && data.advanced_details.moon_set) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">चंद्रास्त</span>' +
                            '<span class="astrology-result-value">' + data.advanced_details.moon_set + '</span>' +
                        '</div>';
                    }
                    
                    if (data.rasi && data.rasi.name) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">राशी</span>' +
                            '<span class="astrology-result-value">' + data.rasi.name + '</span>' +
                        '</div>';
                    }
                    
                    if (data.advanced_details && data.advanced_details.ritu) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">ऋतु</span>' +
                            '<span class="astrology-result-value">' + data.advanced_details.ritu + '</span>' +
                        '</div>';
                    }
                    
                    html += '</div>';
                    
                    // Hindu Calendar Section
                    html += '<div class="astrology-result-card">' +
                        '<h3>हिंदू महिना आणि वर्ष</h3>';
                    
                    if (data.ayanamsa && data.ayanamsa.name) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">अयनांश</span>' +
                            '<span class="astrology-result-value">' + data.ayanamsa.name + '</span>' +
                        '</div>';
                    }
                    
                    if (data.advanced_details && data.advanced_details.years) {
                        if (data.advanced_details.years.saka) {
                            html += '<div class="astrology-result-row">' +
                                '<span class="astrology-result-label">शक संवत</span>' +
                                '<span class="astrology-result-value">' + data.advanced_details.years.saka + '</span>' +
                            '</div>';
                        }
                        if (data.advanced_details.years.vikram_samvaat) {
                            html += '<div class="astrology-result-row">' +
                                '<span class="astrology-result-label">विक्रम संवत</span>' +
                                '<span class="astrology-result-value">' + data.advanced_details.years.vikram_samvaat + '</span>' +
                            '</div>';
                        }
                        if (data.advanced_details.years.kali) {
                            html += '<div class="astrology-result-row">' +
                                '<span class="astrology-result-label">काली संवत</span>' +
                                '<span class="astrology-result-value">' + data.advanced_details.years.kali + '</span>' +
                            '</div>';
                        }
                    }
                    
                    if (data.advanced_details && data.advanced_details.masa) {
                        if (data.advanced_details.masa.purnimanta) {
                            html += '<div class="astrology-result-row">' +
                                '<span class="astrology-result-label">मास (पूर्णिमांत)</span>' +
                                '<span class="astrology-result-value">' + data.advanced_details.masa.purnimanta + '</span>' +
                            '</div>';
                        }
                        if (data.advanced_details.masa.amanta) {
                            html += '<div class="astrology-result-row">' +
                                '<span class="astrology-result-label">मास (अमांत)</span>' +
                                '<span class="astrology-result-value">' + data.advanced_details.masa.amanta + '</span>' +
                            '</div>';
                        }
                    }
                    
                    html += '</div>';
                    
                    // Inauspicious Timings Section
                    html += '<div class="astrology-result-card">' +
                        '<h3>अशुभ काळ</h3>';
                    
                    if (data.rahukaal) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">राहुकाल</span>' +
                            '<span class="astrology-result-value">' + data.rahukaal + '</span>' +
                        '</div>';
                    }
                    
                    if (data.gulika) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">गुलिका</span>' +
                            '<span class="astrology-result-value">' + data.gulika + '</span>' +
                        '</div>';
                    }
                    
                    if (data.yamakanta) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">यमगंड</span>' +
                            '<span class="astrology-result-value">' + data.yamakanta + '</span>' +
                        '</div>';
                    }
                    
                    if (data.advanced_details && data.advanced_details.abhijit_muhurta) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">अभिजीत (शुभ)</span>' +
                            '<span class="astrology-result-value">' + data.advanced_details.abhijit_muhurta.start + ' → ' + data.advanced_details.abhijit_muhurta.end + '</span>' +
                        '</div>';
                    }
                    
                    html += '</div>';
                    
                    resultDiv.innerHTML = html;
                    resultDiv.classList.remove('astrology-hidden');
                }

                function showHoroscopeResult(data) {
                    var resultDiv = document.getElementById('astrology-horoscope-result');
                    var html = '';
                    
                    // Prediction text first
                    if (data.bot_response) {
                        html += '<div class="astrology-prediction-box">' +
                            '<h3>दैनिक भविष्यवाणी</h3>' +
                            '<p class="astrology-prediction-text">' + data.bot_response + '</p>' +
                        '</div>';
                    }
                    
                    // Basic info section (without total score)
                    html += '<div class="astrology-result-card astrology-horoscope-card">' +
                        '<h3>दैनिक भविष्य</h3>' +
                        '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">राशी</span>' +
                            '<span class="astrology-result-value">' + (data.zodiac || 'N/A') + '</span>' +
                        '</div>' +
                        '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">शुभ रंग</span>' +
                            '<span class="astrology-result-value">' + (data.lucky_color || 'N/A') + '</span>' +
                        '</div>';
                    
                    if (data.lucky_number && data.lucky_number.length > 0) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">शुभ अंक</span>' +
                            '<span class="astrology-result-value">' + data.lucky_number.join(', ') + '</span>' +
                        '</div>';
                    }
                    
                    html += '</div>';
                    
                    resultDiv.innerHTML = html;
                    resultDiv.classList.remove('astrology-hidden');
                }

                function showWeeklyHoroscopeResult(data) {
                    var resultDiv = document.getElementById('astrology-horoscope-result');
                    var html = '';
                    
                    if (data.bot_response) {
                        html += '<div class="astrology-prediction-box">' +
                            '<h3>साप्ताहिक भविष्यवाणी</h3>' +
                            '<p class="astrology-prediction-text">' + data.bot_response + '</p>' +
                        '</div>';
                    }
                    
                    html += '<div class="astrology-result-card astrology-horoscope-card">' +
                        '<h3>साप्ताहिक भविष्य</h3>' +
                        '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">राशी</span>' +
                            '<span class="astrology-result-value">' + (data.zodiac || 'N/A') + '</span>' +
                        '</div>' +
                        '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">एकूण गुण</span>' +
                            '<span class="astrology-result-value">' + (data.total_score != null ? data.total_score : 'N/A') + '</span>' +
                        '</div>' +
                        '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">शुभ रंग</span>' +
                            '<span class="astrology-result-value">' + (data.lucky_color || 'N/A') + '</span>' +
                        '</div>';
                    
                    if (data.lucky_number && data.lucky_number.length > 0) {
                        html += '<div class="astrology-result-row">' +
                            '<span class="astrology-result-label">शुभ अंक</span>' +
                            '<span class="astrology-result-value">' + data.lucky_number.join(', ') + '</span>' +
                        '</div>';
                    }
                    
                    // Optional sectional scores if available
                    var sections = ['status','finances','relationship','career','travel','family','friends','health'];
                    sections.forEach(function(key){
                        if (data[key] != null) {
                            html += '<div class="astrology-result-row">' +
                                '<span class="astrology-result-label">' + key + '</span>' +
                                '<span class="astrology-result-value">' + data[key] + '</span>' +
                            '</div>';
                        }
                    });
                    
                    html += '</div>';
                    resultDiv.innerHTML = html;
                    resultDiv.classList.remove('astrology-hidden');
                }
            });
        })();
        </script>
        <?php
        return ob_get_clean();
    }
    
    public function handle_panchang_request() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'astrology_nonce')) {
            wp_die('Security check failed');
        }
        
        $date = sanitize_text_field($_POST['date']);
        $lat = sanitize_text_field($_POST['lat']);
        $lon = sanitize_text_field($_POST['lon']);
        $tz = sanitize_text_field($_POST['tz']);
        $lang = sanitize_text_field($_POST['lang']);
        
        // Cache key: Panchang varies by date, location, tz and language
        $cache_key = 'astrology_panchang_' . md5(implode('|', array($date, $lat, $lon, $tz, $lang)));

        // Try cache first
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            wp_send_json_success($cached);
        }

        // Call VedicAstroAPI - Use the correct endpoint
        $api_key = '6bff3246-afb9-5027-92c1-f2c6f1c182f5';
        $api_url = 'https://api.vedicastroapi.com/v3-json/panchang/panchang';
        
        $params = array(
            'api_key' => $api_key,
            'date' => $date,
            'lat' => $lat,
            'lon' => $lon,
            'tz' => $tz,
            'lang' => $lang
        );
        
        $response = wp_remote_get($api_url . '?' . http_build_query($params), array(
            'timeout' => 30,
            'headers' => array(
                'User-Agent' => 'WordPress Astrology Plugin'
            )
        ));
        
        if (is_wp_error($response)) {
            wp_send_json_error('API request failed: ' . $response->get_error_message());
        }
        
        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        // Log for debugging
        error_log('Panchang API Response Status: ' . $status_code);
        error_log('Panchang API Response Body: ' . $body);
        
        if ($status_code !== 200) {
            wp_send_json_error('API returned status ' . $status_code . ': ' . $body);
        }
        
        if (!$data) {
            wp_send_json_error('Invalid JSON response: ' . $body);
        }
        
        if (isset($data['response'])) {
            // Cache until next midnight in the provided timezone (fallback 12h)
            $ttl = 12 * HOUR_IN_SECONDS;
            $offset_hours = floatval($tz);
            $offset_seconds = intval($offset_hours * 3600);
            $now_utc = time();
            // Approximate next local midnight for the provided date/tz
            $target = DateTime::createFromFormat('d/m/Y H:i:s', $date . ' 00:00:00', new DateTimeZone('UTC'));
            if ($target instanceof DateTime) {
                // move to next day midnight local -> add 24h then subtract tz offset to convert to UTC
                $next_midnight_local = $target->getTimestamp() + DAY_IN_SECONDS;
                $next_midnight_utc = $next_midnight_local - $offset_seconds;
                $ttl_calc = $next_midnight_utc - $now_utc;
                if ($ttl_calc > 0 && $ttl_calc < (2 * DAY_IN_SECONDS)) {
                    $ttl = $ttl_calc;
                }
            }
            set_transient($cache_key, $data['response'], $ttl);
            wp_send_json_success($data['response']);
        } else {
            set_transient($cache_key, $data, 12 * HOUR_IN_SECONDS);
            wp_send_json_success($data);
        }
    }
    
    public function handle_horoscope_request() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'astrology_nonce')) {
            wp_die('Security check failed');
        }
        
        $date = sanitize_text_field($_POST['date']);
        $zodiac = sanitize_text_field($_POST['zodiac']);
        
        // Call VedicAstroAPI
        $api_key = '6bff3246-afb9-5027-92c1-f2c6f1c182f5';
        $api_url = 'https://api.vedicastroapi.com/v3-json/prediction/daily-sun';
        
        $params = array(
            'api_key' => $api_key,
            'date' => $date,
            'zodiac' => $zodiac,
            'split' => 'false',
            'type' => 'big',
            'lang' => 'mr'
        );
        
        // Cache key: Horoscope varies by date, zodiac and language
        $cache_key = 'astrology_daily_horoscope_' . md5(implode('|', array($date, $zodiac, $params['lang'])));

        // Try cache first
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            wp_send_json_success($cached);
        }
        
        $response = wp_remote_get($api_url . '?' . http_build_query($params), array(
            'timeout' => 30,
            'headers' => array(
                'User-Agent' => 'WordPress Astrology Plugin'
            )
        ));
        
        if (is_wp_error($response)) {
            wp_send_json_error('API request failed: ' . $response->get_error_message());
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (!$data || !isset($data['response'])) {
            wp_send_json_error('Invalid API response');
        }
        
        // Cache until next midnight; language fixed to mr, so key already includes it
        $now_utc = time();
        $target = DateTime::createFromFormat('d/m/Y H:i:s', $date . ' 00:00:00', new DateTimeZone('UTC'));
        $ttl = 12 * HOUR_IN_SECONDS;
        if ($target instanceof DateTime) {
            $next_midnight_utc = $target->getTimestamp() + DAY_IN_SECONDS;
            $ttl_calc = $next_midnight_utc - $now_utc;
            if ($ttl_calc > 0 && $ttl_calc < (2 * DAY_IN_SECONDS)) {
                $ttl = $ttl_calc;
            }
        }
        set_transient($cache_key, $data['response'], $ttl);
        wp_send_json_success($data['response']);
    }

    public function handle_weekly_horoscope_request() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'astrology_nonce')) {
            wp_die('Security check failed');
        }
        
        $zodiac = sanitize_text_field($_POST['zodiac']);
        $week = isset($_POST['week']) ? sanitize_text_field($_POST['week']) : 'thisweek';
        
        // API params
        $api_key = '6bff3246-afb9-5027-92c1-f2c6f1c182f5';
        $api_url = 'https://api.vedicastroapi.com/v3-json/prediction/weekly-sun';
        $params = array(
            'api_key' => $api_key,
            'week' => $week,
            'zodiac' => $zodiac,
            'type' => 'big',
            'lang' => 'mr'
        );
        
        // Cache key: varies by week, zodiac, lang
        $cache_key = 'astrology_weekly_horoscope_' . md5(implode('|', array($week, $zodiac, $params['lang'])));
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            wp_send_json_success($cached);
        }
        
        $response = wp_remote_get($api_url . '?' . http_build_query($params), array(
            'timeout' => 30,
            'headers' => array(
                'User-Agent' => 'WordPress Astrology Plugin'
            )
        ));
        
        if (is_wp_error($response)) {
            wp_send_json_error('API request failed: ' . $response->get_error_message());
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (!$data || !isset($data['response'])) {
            wp_send_json_error('Invalid API response');
        }
        
        // Cache for 6 days by default; simple weekly cache
        set_transient($cache_key, $data['response'], 6 * DAY_IN_SECONDS);
        wp_send_json_success($data['response']);
    }
    
    public function handle_geocode_request() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'astrology_nonce')) {
            wp_die('Security check failed');
        }
        
        $query = sanitize_text_field($_POST['q']);
        $limit = intval($_POST['limit']) ?: 8;
        $countrycodes = sanitize_text_field($_POST['countrycodes']) ?: 'in';
        
        // Call Nominatim Geocoding API
        $api_url = 'https://nominatim.openstreetmap.org/search';
        $params = array(
            'q' => $query,
            'format' => 'json',
            'limit' => $limit,
            'countrycodes' => $countrycodes
        );
        
        $response = wp_remote_get($api_url . '?' . http_build_query($params), array(
            'timeout' => 30,
            'headers' => array(
                'User-Agent' => 'WordPress Astrology Plugin'
            )
        ));
        
        if (is_wp_error($response)) {
            wp_send_json_error('Geocoding request failed: ' . $response->get_error_message());
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (!$data || !is_array($data)) {
            wp_send_json_error('Invalid geocoding response');
        }
        
        wp_send_json_success($data);
    }
}

// Initialize the plugin
new AstrologyPlugin();

// Create assets directory and files
register_activation_hook(__FILE__, 'astrology_plugin_activate');

function astrology_plugin_activate() {
    // Create assets directory
    $upload_dir = wp_upload_dir();
    $assets_dir = $upload_dir['basedir'] . '/astrology-plugin-assets';
    
    if (!file_exists($assets_dir)) {
        wp_mkdir_p($assets_dir);
    }
}
