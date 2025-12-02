<?php
/**
 * Plugin Name: Numerology Prediction Plugin (Embedded CSS)
 * Plugin URI: https://yoursite.com
 * Description: A complete numerology prediction plugin with embedded CSS to avoid 404 errors
 * Version: 1.0.1
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
        add_shortcode('numerology_prediction', array($this, 'numerology_shortcode'));
        add_action('wp_ajax_numerology_request', array($this, 'handle_numerology_request'));
        add_action('wp_ajax_nopriv_numerology_request', array($this, 'handle_numerology_request'));
    }
    
    public function init() {
        // Plugin initialization
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
        
        /* Numerology Plugin Styles */
        #numerology-container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 0;
            margin: 0;
        }

        .numerology-header {
            background: rgba(0, 0, 0, 0.2);
            padding: 2rem 0;
            text-align: center;
            color: white;
        }

        .numerology-header h1 {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .numerology-header p {
            font-size: 1.25rem;
            color: #e0e7ff;
            margin: 0;
        }

        .numerology-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        .numerology-form-section {
            padding: 2rem 0;
        }

        .form-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
        }

        .form-card h2 {
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 2rem;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            color: white;
            font-weight: 600;
            margin-bottom: 0.5rem;
            font-size: 1rem;
        }

        .form-group input,
        .form-group select {
            padding: 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }

        .date-input-group {
            display: flex;
            gap: 0.5rem;
        }

        .today-btn {
            padding: 0.75rem 1rem;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .today-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .form-submit {
            text-align: center;
            margin-top: 2rem;
        }

        .form-submit button {
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1.125rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            transform: translateY(0);
        }

        .form-submit button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .form-submit button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .error-message {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
            text-align: center;
        }

        .error-message p {
            color: #fecaca;
            margin: 0;
        }

        .results-section {
            padding: 2rem 0;
        }

        .results-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .results-header h2 {
            color: white;
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }

        .results-header p {
            color: #e0e7ff;
            font-size: 1.125rem;
        }

        .numerology-results {
            display: grid;
            gap: 1.5rem;
        }

        .numerology-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 1rem;
            padding: 1.5rem;
            transition: all 0.3s ease;
        }

        .numerology-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .card-title {
            color: white;
            font-size: 1.25rem;
            font-weight: bold;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .card-number {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .number-badge {
            background: linear-gradient(45deg, #f59e0b, #fbbf24);
            color: #000;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-weight: bold;
            font-size: 1.125rem;
        }

        .master-badge {
            background: linear-gradient(45deg, #10b981, #34d399);
            color: #000;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            font-weight: 600;
        }

        .card-content {
            display: grid;
            gap: 1.5rem;
        }

        .meaning-section,
        .description-section {
            color: white;
        }

        .meaning-section h4,
        .description-section h4 {
            color: #93c5fd;
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .meaning-section p,
        .description-section p {
            line-height: 1.6;
            margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .numerology-header h1 {
                font-size: 2rem;
            }
            
            .numerology-header p {
                font-size: 1rem;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .card-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .card-number {
                align-self: flex-end;
            }
        }

        @media (max-width: 480px) {
            .numerology-container {
                padding: 0 0.5rem;
            }
            
            .form-card {
                padding: 1rem;
            }
            
            .numerology-card {
                padding: 1rem;
            }
            
            .card-header {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            .card-number {
                align-self: center;
            }
        }
        </style>
        
        <div id="numerology-container">
            <!-- Header -->
            <div class="numerology-header">
                <div class="numerology-container">
                    <h1 data-hi="अंक ज्योतिष" data-mr="अंक ज्योतिष" data-en="Numerology Prediction">अंक ज्योतिष</h1>
                    <p data-hi="आपके नाम और जन्म तिथि से जानें आपका भविष्य" data-mr="तुमच्या नाव आणि जन्मतारखेपासून तुमचे भविष्य जाणा" data-en="Discover your future through your name and birth date">आपके नाम और जन्म तिथि से जानें आपका भविष्य</p>
                </div>
            </div>

            <!-- Form Section -->
            <div class="numerology-form-section">
                <div class="numerology-container">
                    <div class="form-card">
                        <h2 data-hi="अंक ज्योतिष विश्लेषण" data-mr="अंक ज्योतिष विश्लेषण" data-en="Numerology Analysis">अंक ज्योतिष विश्लेषण</h2>
                        
                        <form id="numerologyForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="name" data-hi="नाम *" data-mr="नाव *" data-en="Name *">नाम *</label>
                                    <input type="text" id="name" name="name" required placeholder="अपना पूरा नाम लिखें" data-hi-placeholder="अपना पूरा नाम लिखें" data-mr-placeholder="तुमचे पूर्ण नाव लिहा" data-en-placeholder="Enter your full name">
                                </div>
                                
                                <div class="form-group">
                                    <label for="date" data-hi="जन्म तिथि *" data-mr="जन्मतारीख *" data-en="Birth Date *">जन्म तिथि *</label>
                                    <div class="date-input-group">
                                        <input type="date" id="date" name="date" required>
                                        <button type="button" id="todayBtn" class="today-btn" data-hi="आज" data-mr="आज" data-en="Today">आज</button>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="lang" data-hi="भाषा" data-mr="भाषा" data-en="Language">भाषा</label>
                                <select id="lang" name="lang" onchange="changeLanguage()">
                                    <option value="hi">हिंदी</option>
                                    <option value="mr">मराठी</option>
                                    <option value="en">English</option>
                                </select>
                            </div>

                            <div class="form-submit">
                                <button type="submit" id="submitBtn" data-hi="अंक ज्योतिष विश्लेषण करें" data-mr="अंक ज्योतिष विश्लेषण करा" data-en="Analyze Numerology">अंक ज्योतिष विश्लेषण करें</button>
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
                        <h2 data-hi="आपका अंक ज्योतिष विश्लेषण" data-mr="तुमचे अंक ज्योतिष विश्लेषण" data-en="Your Numerology Analysis">आपका अंक ज्योतिष विश्लेषण</h2>
                        <p id="userInfo"></p>
                    </div>

                    <div id="numerologyResults" class="numerology-results">
                        <!-- Results will be populated here -->
                    </div>
                </div>
            </div>
        </div>

        <script>
        // Language switching function
        function changeLanguage() {
            const langSelect = document.getElementById('lang');
            const selectedLang = langSelect.value;
            
            // Update all elements with data attributes
            const elements = document.querySelectorAll('[data-hi], [data-mr], [data-en]');
            elements.forEach(element => {
                if (element.dataset[selectedLang]) {
                    element.textContent = element.dataset[selectedLang];
                }
            });
            
            // Update placeholders
            const inputs = document.querySelectorAll('[data-hi-placeholder], [data-mr-placeholder], [data-en-placeholder]');
            inputs.forEach(input => {
                const placeholderAttr = `data-${selectedLang}-placeholder`;
                if (input.getAttribute(placeholderAttr)) {
                    input.placeholder = input.getAttribute(placeholderAttr);
                }
            });
            
            // Update loading text
            const submitBtn = document.getElementById('submitBtn');
            const loadingTexts = {
                'hi': 'विश्लेषण हो रहा है...',
                'mr': 'विश्लेषण होत आहे...',
                'en': 'Analyzing...'
            };
            
            // Store loading text for later use
            window.numerologyLoadingText = loadingTexts[selectedLang];
        }

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
                const loadingText = window.numerologyLoadingText || 'विश्लेषण हो रहा है...';
                submitBtn.textContent = loadingText;
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
                    // Reset button text based on current language
                    const langSelect = document.getElementById('lang');
                    const selectedLang = langSelect.value;
                    const buttonTexts = {
                        'hi': 'अंक ज्योतिष विश्लेषण करें',
                        'mr': 'अंक ज्योतिष विश्लेषण करा',
                        'en': 'Analyze Numerology'
                    };
                    submitBtn.textContent = buttonTexts[selectedLang] || 'अंक ज्योतिष विश्लेषण करें';
                    submitBtn.disabled = false;
                }
            });

            function displayResults(numerologyData, userData) {
                // Update user info based on language
                const langSelect = document.getElementById('lang');
                const selectedLang = langSelect.value;
                const formattedDate = new Date(userData.date).toLocaleDateString('hi-IN');
                
                const userInfoTexts = {
                    'hi': `नाम: <span class="font-semibold">${userData.name}</span> | जन्म तिथि: <span class="font-semibold">${formattedDate}</span>`,
                    'mr': `नाव: <span class="font-semibold">${userData.name}</span> | जन्मतारीख: <span class="font-semibold">${formattedDate}</span>`,
                    'en': `Name: <span class="font-semibold">${userData.name}</span> | Birth Date: <span class="font-semibold">${formattedDate}</span>`
                };
                
                userInfo.innerHTML = userInfoTexts[selectedLang] || userInfoTexts['hi'];

                // Clear previous results
                numerologyResults.innerHTML = '';

                // Display each numerology aspect with language support
                const aspects = {
                    'hi': [
                        { key: 'destiny', title: 'भाग्य', icon: '🌟' },
                        { key: 'personality', title: 'व्यक्तित्व', icon: '👤' },
                        { key: 'attitude', title: 'रवैया', icon: '😊' },
                        { key: 'character', title: 'चरित्र', icon: '💎' },
                        { key: 'soul', title: 'आत्मा से आग्रह', icon: '🕊️' },
                        { key: 'agenda', title: 'गुप्त एजेंडा', icon: '🔮' },
                        { key: 'purpose', title: 'ईश्वरीय उद्देश्य', icon: '✨' }
                    ],
                    'mr': [
                        { key: 'destiny', title: 'भाग्य', icon: '🌟' },
                        { key: 'personality', title: 'व्यक्तिमत्व', icon: '👤' },
                        { key: 'attitude', title: 'वृत्ती', icon: '😊' },
                        { key: 'character', title: 'चरित्र', icon: '💎' },
                        { key: 'soul', title: 'आत्म्याची इच्छा', icon: '🕊️' },
                        { key: 'agenda', title: 'गुप्त कार्यक्रम', icon: '🔮' },
                        { key: 'purpose', title: 'दैवी उद्देश', icon: '✨' }
                    ],
                    'en': [
                        { key: 'destiny', title: 'Destiny', icon: '🌟' },
                        { key: 'personality', title: 'Personality', icon: '👤' },
                        { key: 'attitude', title: 'Attitude', icon: '😊' },
                        { key: 'character', title: 'Character', icon: '💎' },
                        { key: 'soul', title: 'Soul Urge', icon: '🕊️' },
                        { key: 'agenda', title: 'Hidden Agenda', icon: '🔮' },
                        { key: 'purpose', title: 'Divine Purpose', icon: '✨' }
                    ]
                };
                
                const currentAspects = aspects[selectedLang] || aspects['hi'];

                currentAspects.forEach(aspect => {
                    const data = numerologyData[aspect.key];
                    if (data) {
                        const card = createNumerologyCard(aspect, data, selectedLang);
                        numerologyResults.appendChild(card);
                    }
                });

                results.style.display = 'block';
            }

            function createNumerologyCard(aspect, data, language) {
                const card = document.createElement('div');
                card.className = 'numerology-card';
                
                // Language-specific labels
                const labels = {
                    'hi': { meaning: 'अर्थ:', description: 'विवरण:', master: 'मास्टर' },
                    'mr': { meaning: 'अर्थ:', description: 'वर्णन:', master: 'मास्टर' },
                    'en': { meaning: 'Meaning:', description: 'Description:', master: 'MASTER' }
                };
                
                const currentLabels = labels[language] || labels['hi'];
                
                card.innerHTML = `
                    <div class="card-header">
                        <h3 class="card-title">
                            ${aspect.icon} ${aspect.title}
                        </h3>
                        <div class="card-number">
                            <span class="number-badge">${data.number}</span>
                            ${data.master ? `<span class="master-badge">${currentLabels.master}</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="card-content">
                        <div class="meaning-section">
                            <h4>${currentLabels.meaning}</h4>
                            <p>${data.meaning}</p>
                        </div>
                        
                        <div class="description-section">
                            <h4>${currentLabels.description}</h4>
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
