<?php
/**
 * Plugin Name: Numerology Prediction Plugin
 * Plugin URI: https://yoursite.com
 * Description: A complete numerology prediction plugin with beautiful table structure and API integration
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('NUMEROLOGY_PLUGIN_URL', plugin_dir_url(__FILE__));
define('NUMEROLOGY_PLUGIN_PATH', plugin_dir_path(__FILE__));

class NumerologyPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('numerology_prediction', array($this, 'numerology_shortcode'));
        add_action('wp_ajax_numerology_request', array($this, 'handle_numerology_request'));
        add_action('wp_ajax_nopriv_numerology_request', array($this, 'handle_numerology_request'));
    }
    
    public function init() {
        // Plugin initialization
    }
    
    public function enqueue_scripts() {
        wp_enqueue_style('numerology-style', NUMEROLOGY_PLUGIN_URL . 'assets/numerology-plugin-style.css', array(), '1.0.0');
    }
    
    public function numerology_shortcode($atts) {
        $atts = shortcode_atts(array(
            'title' => 'अंक ज्योतिष',
            'subtitle' => 'आपके नाम और जन्म तिथि से जानें आपका भविष्य'
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
        .page-header .page-title, .page-header h1, .page-header .entry-title,
        .elementor-page-title, .elementor-widget-heading h1, .elementor-widget-heading h2,
        .elementor-heading-title, .elementor-widget-container h1, .elementor-widget-container h2,
        .site-header .site-title, .site-branding .site-title,
        .entry-header, .page-header, .post-header,
        .woocommerce-page .woocommerce-breadcrumb,
        .woocommerce-page h1.page-title {
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
        
        /* Hide Elementor and theme specific titles */
        .elementor-page-title, .elementor-widget-heading h1, .elementor-widget-heading h2,
        .elementor-heading-title, .elementor-widget-container h1, .elementor-widget-container h2,
        .site-header .site-title, .site-branding .site-title,
        .entry-header, .page-header, .post-header,
        .woocommerce-page .woocommerce-breadcrumb,
        .woocommerce-page h1.page-title {
            display: none !important;
        }
        </style>
        
        <div id="numerology-container">
            <!-- Header -->
            <div class="numerology-header">
                <div class="numerology-container">
                    <h1><?php echo esc_html($atts['title']); ?></h1>
                    <p><?php echo esc_html($atts['subtitle']); ?></p>
                </div>
            </div>

            <!-- Form Section -->
            <div class="numerology-form-section">
                <div class="numerology-container">
                    <div class="form-card">
                        <h2>अंक ज्योतिष विश्लेषण</h2>
                        
                        <form id="numerologyForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="name">नाम *</label>
                                    <input type="text" id="name" name="name" required placeholder="अपना पूरा नाम लिखें">
                                </div>
                                
                                <div class="form-group">
                                    <label for="date">जन्म तिथि *</label>
                                    <div class="date-input-group">
                                        <input type="date" id="date" name="date" required>
                                        <button type="button" id="todayBtn" class="today-btn">आज</button>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="lang">भाषा</label>
                                <select id="lang" name="lang">
                                    <option value="hi">हिंदी</option>
                                    <option value="en">English</option>
                                    <option value="mr">मराठी</option>
                                    <option value="gu">ગુજરાતી</option>
                                    <option value="bn">বাংলা</option>
                                    <option value="ta">தமிழ்</option>
                                    <option value="te">తెలుగు</option>
                                    <option value="kn">ಕನ್ನಡ</option>
                                    <option value="ml">മലയാളം</option>
                                </select>
                            </div>

                            <div class="form-submit">
                                <button type="submit" id="submitBtn">अंक ज्योतिष विश्लेषण करें</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Error Message -->
            <div id="errorMessage" class="error-message" style="display: none;">
                <p></p>
            </div>

            <!-- Results Section -->
            <div id="results" class="results-section" style="display: none;">
                <div class="numerology-container">
                    <div class="results-header">
                        <h2>आपका अंक ज्योतिष विश्लेषण</h2>
                        <p id="userInfo"></p>
                    </div>

                    <div id="numerologyResults" class="numerology-results">
                        <!-- Results will be populated here -->
                    </div>
                </div>
            </div>
        </div>

        <script>
        (function() {
            const form = document.getElementById('numerologyForm');
            const submitBtn = document.getElementById('submitBtn');
            const errorMessage = document.getElementById('errorMessage');
            const results = document.getElementById('results');
            const numerologyResults = document.getElementById('numerologyResults');
            const userInfo = document.getElementById('userInfo');
            const todayBtn = document.getElementById('todayBtn');

            // Set today's date
            todayBtn.addEventListener('click', function() {
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                document.getElementById('date').value = formattedDate;
            });

            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    date: formData.get('date'),
                    lang: formData.get('lang')
                };

                // Show loading state
                submitBtn.textContent = 'विश्लेषण हो रहा है...';
                submitBtn.disabled = true;
                errorMessage.style.display = 'none';
                results.style.display = 'none';

                try {
                    const response = await fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            action: 'numerology_request',
                            _wpnonce: '<?php echo wp_create_nonce('numerology_nonce'); ?>',
                            ...data
                        })
                    });

                    const result = await response.json();

                    if (result.success && result.data) {
                        displayResults(result.data, data);
                    } else {
                        throw new Error(result.data || 'Failed to fetch numerology data');
                    }
                } catch (error) {
                    showError(error.message);
                } finally {
                    submitBtn.textContent = 'अंक ज्योतिष विश्लेषण करें';
                    submitBtn.disabled = false;
                }
            });

            function displayResults(numerologyData, userData) {
                // Update user info
                const formattedDate = new Date(userData.date).toLocaleDateString('hi-IN');
                userInfo.innerHTML = `नाम: <span class="font-semibold">${userData.name}</span> | जन्म तिथि: <span class="font-semibold">${formattedDate}</span>`;

                // Clear previous results
                numerologyResults.innerHTML = '';

                // Display each numerology aspect
                const aspects = [
                    { key: 'destiny', title: 'भाग्य', icon: '🌟' },
                    { key: 'personality', title: 'व्यक्तित्व', icon: '👤' },
                    { key: 'attitude', title: 'रवैया', icon: '😊' },
                    { key: 'character', title: 'चरित्र', icon: '💎' },
                    { key: 'soul', title: 'आत्मा से आग्रह', icon: '🕊️' },
                    { key: 'agenda', title: 'गुप्त एजेंडा', icon: '🔮' },
                    { key: 'purpose', title: 'ईश्वरीय उद्देश्य', icon: '✨' }
                ];

                aspects.forEach(aspect => {
                    const data = numerologyData[aspect.key];
                    if (data) {
                        const card = createNumerologyCard(aspect, data);
                        numerologyResults.appendChild(card);
                    }
                });

                results.style.display = 'block';
            }

            function createNumerologyCard(aspect, data) {
                const card = document.createElement('div');
                card.className = 'numerology-card';
                
                card.innerHTML = `
                    <div class="card-header">
                        <h3 class="card-title">
                            ${aspect.icon} ${data.title}
                        </h3>
                        <div class="card-number">
                            <span class="number-badge">${data.number}</span>
                            ${data.master ? '<span class="master-badge">मास्टर</span>' : ''}
                        </div>
                    </div>
                    
                    <div class="card-content">
                        <div class="meaning-section">
                            <h4>अर्थ:</h4>
                            <p>${data.meaning}</p>
                        </div>
                        
                        <div class="description-section">
                            <h4>विवरण:</h4>
                            <p>${data.description}</p>
                        </div>
                    </div>
                `;
                
                return card;
            }

            function showError(message) {
                errorMessage.querySelector('p').textContent = message;
                errorMessage.style.display = 'block';
            }
        })();
        </script>
        <?php
        return ob_get_clean();
    }
    
    public function handle_numerology_request() {
        // Verify nonce for security
        if (!wp_verify_nonce($_POST['_wpnonce'], 'numerology_nonce')) {
            wp_die('Security check failed');
        }
        
        $name = sanitize_text_field($_POST['name']);
        $date = sanitize_text_field($_POST['date']);
        $lang = sanitize_text_field($_POST['lang']);
        
        if (empty($name) || empty($date)) {
            wp_send_json_error('Name and date are required');
            return;
        }
        
        // Convert date format from YYYY-MM-DD to DD/MM/YYYY
        $formattedDate = date('d/m/Y', strtotime($date));
        
        $apiKey = '6bff3246-afb9-5027-92c1-f2c6f1c182f5';
        
        $params = array(
            'api_key' => $apiKey,
            'name' => $name,
            'date' => $formattedDate,
            'lang' => $lang ?: 'hi'
        );
        
        // Try different request formats
        $response = null;
        
        // Method 1: GET with URL parameters
        $url = 'https://api.vedicastroapi.com/v3-json/prediction/numerology?' . http_build_query($params);
        $response = wp_remote_get($url, array(
            'timeout' => 30,
            'headers' => array(
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            )
        ));
        
        if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);
            
            if ($data && isset($data['response'])) {
                wp_send_json_success($data['response']);
                return;
            }
        }
        
        // Method 2: POST with form data
        $response = wp_remote_post('https://api.vedicastroapi.com/v3-json/prediction/numerology', array(
            'timeout' => 30,
            'headers' => array(
                'Content-Type' => 'application/x-www-form-urlencoded',
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ),
            'body' => http_build_query($params)
        ));
        
        if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);
            
            if ($data && isset($data['response'])) {
                wp_send_json_success($data['response']);
                return;
            }
        }
        
        // Method 3: POST with JSON
        $response = wp_remote_post('https://api.vedicastroapi.com/v3-json/prediction/numerology', array(
            'timeout' => 30,
            'headers' => array(
                'Content-Type' => 'application/json',
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ),
            'body' => json_encode($params)
        ));
        
        if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);
            
            if ($data && isset($data['response'])) {
                wp_send_json_success($data['response']);
                return;
            }
        }
        
        wp_send_json_error('Failed to fetch numerology data');
    }
}

// Initialize the plugin
new NumerologyPlugin();
?>
