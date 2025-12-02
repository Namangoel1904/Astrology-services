<?php
/**
 * Plugin Name: Email Signup Popup
 * Description: Shows a delayed signup popup after 5 seconds and saves emails to uploads.
 * Version: 1.0.1
 * Author: Your Name
 */

if (!defined('ABSPATH')) { exit; }

class EmailSignupPopupPlugin {
    public function __construct() {
        add_action('wp_footer', array($this, 'render_popup'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));
        add_action('wp_ajax_email_signup_save', array($this, 'handle_save'));
        add_action('wp_ajax_nopriv_email_signup_save', array($this, 'handle_save'));
        register_activation_hook(__FILE__, array($this, 'on_activate'));
    }

    public function on_activate() {
        // Ensure uploads subdir exists
        $upload_dir = wp_upload_dir();
        $dir = trailingslashit($upload_dir['basedir']) . 'email-signups';
        if (!file_exists($dir)) {
            wp_mkdir_p($dir);
        }
        $file = trailingslashit($dir) . 'subscribers.csv';
        if (!file_exists($file)) {
            file_put_contents($file, "email,timestamp,ip\n");
        }
    }

    public function enqueue_styles() {
        wp_register_style('email-signup-popup-style', false);
        wp_enqueue_style('email-signup-popup-style');
        $css = ' .esp-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);display:none;z-index:9998}'
             . ' .esp-modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.15);width:min(92vw,460px);display:none;z-index:9999}'
             . ' .esp-header{padding:14px 18px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center}'
             . ' .esp-title{margin:0;font-size:18px;font-weight:600}'
             . ' .esp-close{border:none;background:transparent;font-size:20px;line-height:1;cursor:pointer}'
             . ' .esp-body{padding:18px}'
             . ' .esp-desc{margin:0 0 12px 0;color:#333;font-size:14px}'
             . ' .esp-form{display:flex;gap:8px}'
             . ' .esp-input{flex:1;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:14px}'
             . ' .esp-btn{padding:10px 14px;background:#0a7cff;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600}'
             . ' .esp-msg{margin-top:10px;font-size:13px}'
             . ' @media(max-width:480px){.esp-body{padding:16px}.esp-title{font-size:16px}}';
        wp_add_inline_style('email-signup-popup-style', $css);
    }

    public function render_popup() {
        // Render site-wide
        $nonce = wp_create_nonce('email_signup_nonce');
        $ajax = admin_url('admin-ajax.php');
        ?>
        <div id="esp-backdrop" class="esp-backdrop" aria-hidden="true"></div>
        <div id="esp-modal" class="esp-modal" role="dialog" aria-modal="true" aria-labelledby="esp-title">
            <div class="esp-header">
                <h3 id="esp-title" class="esp-title">अपडेट्स मेलवर मिळवण्यासाठी साइन अप करा</h3>
                <button id="esp-close" class="esp-close" aria-label="Close">×</button>
            </div>
            <div class="esp-body">
                <p class="esp-desc">आपला ईमेल प्रविष्ट करा आणि नवीन अपडेट्स थेट मेलवर मिळवा.</p>
                <form id="esp-form" class="esp-form">
                    <input type="email" id="esp-email" class="esp-input" placeholder="you@example.com" required />
                    <button type="submit" class="esp-btn">सबमिट</button>
                </form>
                <div id="esp-msg" class="esp-msg"></div>
            </div>
        </div>
        <script>
        (function(){
            var KEY_HIDE = 'esp_hide_until';
            var KEY_SIGNED = 'esp_signed';
            function byId(id){ return document.getElementById(id); }
            function shouldShow(){
                try{
                    if (localStorage.getItem(KEY_SIGNED) === '1') return false;
                    var until = parseInt(localStorage.getItem(KEY_HIDE) || '0');
                    if (!isNaN(until) && until > Date.now()) return false;
                }catch(e){}
                return true;
            }
            function hideForDays(days){
                try{ localStorage.setItem(KEY_HIDE, String(Date.now() + days*24*60*60*1000)); }catch(e){}
            }
            function markSigned(){ try{ localStorage.setItem(KEY_SIGNED,'1'); }catch(e){} }
            function open(){ byId('esp-backdrop').style.display='block'; byId('esp-modal').style.display='block'; }
            function close(){ byId('esp-backdrop').style.display='none'; byId('esp-modal').style.display='none'; }
            function init(){
                var bd=byId('esp-backdrop'), md=byId('esp-modal'), cl=byId('esp-close');
                if(!bd||!md||!cl) return;
                cl.addEventListener('click', function(){ hideForDays(3); close(); });
                bd.addEventListener('click', function(){ hideForDays(3); close(); });
                byId('esp-form').addEventListener('submit', function(e){
                    e.preventDefault();
                    var email = byId('esp-email').value.trim();
                    var msg = byId('esp-msg');
                    if(!email || !/\S+@\S+\.\S+/.test(email)) { msg.style.color='#c00'; msg.textContent='कृपया वैध ईमेल प्रविष्ट करा'; return; }
                    msg.style.color='#333';
                    msg.textContent='सबमिट करत आहे...';
                    var fd = new FormData();
                    fd.append('action','email_signup_save');
                    fd.append('nonce','<?php echo esc_js($nonce); ?>');
                    fd.append('email', email);
                    fetch('<?php echo esc_url($ajax); ?>', { method: 'POST', body: fd })
                        .then(function(r){ return r.json(); })
                        .then(function(data){
                            if (data && data.success){
                                msg.style.color='#0a7c00';
                                msg.textContent='धन्यवाद! आपला ईमेल नोंदविला गेला आहे.';
                                markSigned();
                                setTimeout(function(){ close(); }, 1200);
                            } else {
                                msg.style.color='#c00';
                                msg.textContent='त्रुटी: ' + (data && data.data ? data.data : 'Unknown error');
                            }
                        })
                        .catch(function(err){ msg.style.color='#c00'; msg.textContent='त्रुटी: ' + err.message; });
                });
                setTimeout(function(){ if(shouldShow()) open(); }, 5000);
            }
            if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
        })();
        </script>
        <?php
    }

    public function handle_save() {
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'email_signup_nonce')) {
            wp_send_json_error('Security check failed');
        }
        $email = isset($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : '';
        if (empty($email) || !is_email($email)) {
            wp_send_json_error('Invalid email');
        }
        $upload_dir = wp_upload_dir();
        $dir = trailingslashit($upload_dir['basedir']) . 'email-signups';
        if (!file_exists($dir)) {
            wp_mkdir_p($dir);
        }
        $file = trailingslashit($dir) . 'subscribers.csv';
        if (!file_exists($file)) {
            file_put_contents($file, "email,timestamp,ip\n");
        }
        $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : '';
        $row = sprintf("%s,%s,%s\n", $email, gmdate('c'), $ip);
        $ok = file_put_contents($file, $row, FILE_APPEND | LOCK_EX);
        if ($ok === false) {
            wp_send_json_error('Could not save');
        }
        wp_send_json_success(true);
    }
}

new EmailSignupPopupPlugin();


