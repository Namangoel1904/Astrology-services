<?php
/*
Plugin Name: Horoscope Prediction — Astrology Consultancy
Description: Responsive, multi-language (हिंदी, मराठी, English) horoscope prediction with city search and SVG chart. Use shortcode: [horoscope_prediction]
Version: 1.0.0
Author: Astrology Consultancy
*/

if (!defined('ABSPATH')) { exit; }

define('HOROSCOPE_API_KEY', '2892b990-0f07-5fea-809b-10e2886844c7');

add_shortcode('horoscope_prediction', function() {
    $nonce = wp_create_nonce('horoscope_nonce');
    $ajaxurl = admin_url('admin-ajax.php');
    ob_start(); ?>
    <style>
    .horo-wrap { background:linear-gradient(135deg,#fffbeb 0%,#fff1f2 100%); padding:2rem 1rem; border-radius:1rem; box-shadow:0 5px 32px #0001; max-width:900px; margin:auto; }
    .horo-card { background:#fff; border-radius:.75rem; box-shadow:0 6px 12px #0001; padding:1.5rem; margin-bottom:1.5rem; }
    .horo-label { display:block; font-weight:500; margin:.5rem 0 .25rem; color:#444; }
    .horo-input { width:100%; padding:.6rem .75rem; border:1px solid #ecc94b; border-radius:.5rem; }
    .horo-btn { background:#ea580c; color:#fff; border:none; padding:.8rem 2rem; font-size:1rem; border-radius:.5rem; box-shadow:0 2px 6px #0001; cursor:pointer; font-weight:700; margin-top:.6rem; }
    .horo-btn:disabled { background:#e2e8f0; color:#bbb; cursor:wait; }
    .horo-tab { margin-bottom:1rem; display:flex; gap:.5rem; justify-content:center; }
    .horo-tab-btn { font-weight:600; padding:.5rem 1.25rem; border-radius:1rem; border:none; background:#fdf2f8; color:#be185d; transition:background .22s; cursor:pointer; }
    .horo-tab-btn.active { background:#ffedd5; color:#d97706; border:1.5px solid #fbbf24; }
    .horo-error { margin:1rem 0; color:#b91c1c; background:#fee2e2; padding:.5rem 1rem; border-radius:.5rem; }
    .horo-section { margin-top:1.25rem; margin-bottom:2rem; }
    .horo-loader { color:#f59e42; padding:1.5rem 0; font-weight:500; text-align:center; }
    .horo-svgborder { background:linear-gradient(90deg,#ddf 40%,#fee); border-radius:.75rem; box-shadow:0 2px 8px #0002; padding:1rem;margin:auto; margin-bottom:2rem; text-align:center; overflow-x:auto; }
    .horo-svgborder svg { max-width:100%; width:100%!important; height:auto!important; display:block; margin:auto; }
    /* Table */
    .horo-table { width:100%; border-collapse:collapse; margin-bottom:1.5rem; }
    .horo-table th, .horo-table td { border:1px solid #fbbf24; padding:.5rem .7rem; text-align:center; }
    .horo-table th { background:#fefce8; color:#b45309; font-weight:700; }
    .horo-table tbody tr:nth-child(even) { background:#f9fafb; }
    .horo-table tbody tr:hover { background:#fef3c7; }
    /* City autocomplete */
    .horo-ac-wrap { position:relative; }
    .horo-ac-list { position:absolute; top:calc(100% + 2px); left:0; right:0; background:#fff; z-index:20; border:1px solid #ddd6fe; border-radius:.5rem; max-height:220px; overflow:auto; box-shadow:0 8px 24px #0002; color:#222; display:none; }
    .horo-ac-list button { border:none; background:transparent; width:100%; text-align:left; padding:.65rem 1rem; font-size:.98em; color:#444; cursor:pointer; }
    .horo-ac-list button:hover { background:#fef9c3; }
    @media(max-width:540px) { .horo-card, .horo-wrap { padding:1rem; } .horo-svgborder { padding:.2rem; } .horo-svgborder svg { height:220px!important; } }
    </style>
    <div class="horo-wrap">
      <div class="horo-card">
        <h2 style="font-size:1.6rem;font-weight:800;color:#d97706;margin-bottom:1rem;">🔭 <span data-i18n="mainTitle">सम्पूर्ण कुंडली रिपोर्ट</span></h2>
        <form id="horoForm">
          <label class="horo-label" for="horo_dob" data-i18n="birthDate">जन्म तिथि</label>
          <input class="horo-input" id="horo_dob" type="date" required />
          <label class="horo-label" for="horo_tob" data-i18n="birthTime">जन्म समय</label>
          <input class="horo-input" id="horo_tob" type="time" required />
          <label class="horo-label" data-i18n="birthPlace">जन्म स्थान</label>
          <div class="horo-ac-wrap">
            <input class="horo-input" id="horo_city" placeholder="उदा. दिल्ली, मुंबई, पुणे" autocomplete="off" />
            <div id="horo_city_list" class="horo-ac-list"></div>
          </div>
          <input type="hidden" id="horo_lat" />
          <input type="hidden" id="horo_lon" />
          <label class="horo-label" for="horo_lang" data-i18n="lang">भाषा</label>
          <select class="horo-input" id="horo_lang">
            <option value="hi" selected>हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="en">English</option>
          </select>
          <button class="horo-btn" type="button" id="horo_submit_btn"><span data-i18n="reportBtn">रिपोर्ट प्राप्त करें</span></button>
        </form>
        <div id="horo_error" class="horo-error" style="display:none;"></div>
      </div>
      <div id="horo_result"></div>
    </div>
    <script>(function() {
// The entire fully inlined JS will be generated below in the next step
var horo_ajaxurl = "<?php echo esc_js($ajaxurl); ?>", horo_nonce = "<?php echo esc_js($nonce); ?>";

/* ---- 1. Label Translations ---- */
<?php
  $H_LABELS = [
    'hi' => [
      'mainTitle' => 'सम्पूर्ण कुंडली रिपोर्ट',
      'planetTab' => 'ग्रह तालिका',
      'ascTab' => 'लग्न रिपोर्ट',
      'loading' => 'लोड हो रहा है...',
      'd1ChartLoading' => 'D1 चार्ट लोड हो रहा है...',
      'chartLoadErr' => 'चार्ट लोड नहीं हो पाया',
      'planetTable' => 'कुंडली ग्रह तालिका',
      'divisionalTable' => 'Divisional Chart: D1 ग्रह तालिका',
      'lagna' => 'लग्न',
      'house' => 'भाव',
      'zodiac' => 'राशि',
      'nakshatra' => 'नक्षत्र',
      'angle' => 'अंश',
      'set' => 'स्थिति',
      'lord' => 'लॉर्ड',
      'avastha' => 'अवस्था',
      'retro' => 'पुनरावर्ती',
      'general' => 'सामान्य',
      'personalised' => 'व्यक्तिगत',
      'spiritualityAdvice' => 'आध्यात्मिक सुझाव',
      'positive' => 'सकारात्मक',
      'negative' => 'नकारात्मक',
      'luckyGem' => 'लकी रत्न',
      'dayForFasting' => 'उपवास का दिन',
      'gayatriMantra' => 'गायत्री मंत्र',
      'mainQuality' => 'मुख्य गुणवत्ता',
      'lagneshStatus' => 'लग्न स्वामी स्थिति',
      'strength' => 'मजबूती',
      'rashiChar' => 'राशि विशेषता',
      'verbalLocation' => 'वर्बल स्थान',
      'reportBtn' => 'रिपोर्ट प्राप्त करें',
      'birthDate' => 'जन्म तिथि',
      'birthTime' => 'जन्म समय',
      'birthPlace' => 'जन्म स्थान',
      'lang' => 'भाषा',
      'lang_hi' => 'हिंदी',
      'lang_mr' => 'मराठी',
      'lang_en' => 'English',
      'error_nocity' => 'कृपया कोई मान्य शहर चुनें।',
      'ashtakvargaTab' => 'अष्टकवर्ग',
      'total' => 'कुल',
      'planetReportTab' => 'ग्रह रिपोर्ट',
      'planetSelectLabel' => 'ग्रह चुनें',
      'planetReportHeading' => 'ग्रह विश्लेषण',
      'planetConsidered' => 'विचारित ग्रह',
      'planetLocation' => 'ग्रह स्थिति',
      'planetNativeLocation' => 'मूल भाव',
      'planetZodiac' => 'ग्रह राशि',
      'zodiacLord' => 'राशि स्वामी',
      'zodiacLordLocation' => 'राशि स्वामी राशि',
      'zodiacLordHouse' => 'राशि स्वामी भाव',
      'zodiacLordStrength' => 'राशि स्वामी बल',
      'planetStrength' => 'ग्रह बल',
      'planetZodiacPrediction' => 'राशि भविष्यवाणी',
      'planetVerbalLocation' => 'वर्बल स्थान',
      'planetQualitiesLong' => 'विस्तृत गुण',
      'planetQualitiesShort' => 'संक्षिप्त गुण',
      'planetAffliction' => 'दोष',
      'planetPositiveTraits' => 'सकारात्मक विशेषताएँ',
      'planetNegativeTraits' => 'नकारात्मक विशेषताएँ',
      'planetDefinition' => 'ग्रह परिभाषा',
      'planetGayatriMantra' => 'गायत्री मंत्र',
      'planetNoData' => 'ग्रह रिपोर्ट उपलब्ध नहीं है',
    ],
    'mr' => [
      'mainTitle' => 'सम्पूर्ण कुंडली रिपोर्ट',
      'planetTab' => 'ग्रह तक्ता',
      'ascTab' => 'लग्न रिपोर्ट',
      'loading' => 'लोड होत आहे...',
      'd1ChartLoading' => 'D1 चार्ट लोड होत आहे...',
      'chartLoadErr' => 'चार्ट लोड करू शकलो नाही',
      'planetTable' => 'कुंडली ग्रह तक्ता',
      'divisionalTable' => 'Divisional Chart: D1 ग्रह तक्ता',
      'lagna' => 'लग्न',
      'house' => 'भाव',
      'zodiac' => 'राशि',
      'nakshatra' => 'नक्षत्र',
      'angle' => 'अंश',
      'set' => 'स्थिती',
      'lord' => 'स्वामी',
      'avastha' => 'अवस्था',
      'retro' => 'रिट्रो',
      'general' => 'सामान्य',
      'personalised' => 'वैयक्तिक',
      'spiritualityAdvice' => 'आध्यात्मिक सल्ला',
      'positive' => 'सकारात्मक',
      'negative' => 'नकारात्मक',
      'luckyGem' => 'भाग्यवान रत्न',
      'dayForFasting' => 'उपवासाचा दिवस',
      'gayatriMantra' => 'गायत्री मंत्र',
      'mainQuality' => 'मुख्य गुणवत्ता',
      'lagneshStatus' => 'लग्न स्वामी स्थिती',
      'strength' => 'बळ',
      'rashiChar' => 'राशी गुण',
      'verbalLocation' => 'शाब्दिक स्थान',
      'reportBtn' => 'रिपोर्ट मिळवा',
      'birthDate' => 'जन्म दिनांक',
      'birthTime' => 'जन्म वेळ',
      'birthPlace' => 'जन्म स्थान',
      'lang' => 'भाषा',
      'lang_hi' => 'हिंदी',
      'lang_mr' => 'मराठी',
      'lang_en' => 'English',
      'error_nocity' => 'कृपया मान्य शहर निवडा.',
      'ashtakvargaTab' => 'अष्टकवर्ग',
      'total' => 'एकूण',
      'planetReportTab' => 'ग्रह अहवाल',
      'planetSelectLabel' => 'ग्रह निवडा',
      'planetReportHeading' => 'ग्रह विश्लेषण',
      'planetConsidered' => 'विचारित ग्रह',
      'planetLocation' => 'ग्रह स्थान',
      'planetNativeLocation' => 'जन्म भाव',
      'planetZodiac' => 'ग्रह राशि',
      'zodiacLord' => 'राशी स्वामी',
      'zodiacLordLocation' => 'राशी स्वामीची राशि',
      'zodiacLordHouse' => 'राशी स्वामी भाव',
      'zodiacLordStrength' => 'राशी स्वामी बल',
      'planetStrength' => 'ग्रह बल',
      'planetZodiacPrediction' => 'राशी भविष्य',
      'planetVerbalLocation' => 'शाब्दिक स्थान',
      'planetQualitiesLong' => 'सविस्तर गुण',
      'planetQualitiesShort' => 'संक्षिप्त गुण',
      'planetAffliction' => 'दोष',
      'planetPositiveTraits' => 'सकारात्मक विशेषता',
      'planetNegativeTraits' => 'नकारात्मक विशेषता',
      'planetDefinition' => 'ग्रह परिभाषा',
      'planetGayatriMantra' => 'गायत्री मंत्र',
      'planetNoData' => 'ग्रह अहवाल उपलब्ध नाही',
    ],
    'en' => [
      'mainTitle' => 'Complete Horoscope Report',
      'planetTab' => 'Planet Table',
      'ascTab' => 'Ascendant Report',
      'loading' => 'Loading...',
      'd1ChartLoading' => 'Loading D1 Chart...',
      'chartLoadErr' => 'Failed to load chart',
      'planetTable' => 'Horoscope Planet Table',
      'divisionalTable' => 'Divisional Chart: D1 Table',
      'lagna' => 'Ascendant',
      'house' => 'House',
      'zodiac' => 'Zodiac',
      'nakshatra' => 'Nakshatra',
      'angle' => 'Degree',
      'set' => 'Set',
      'lord' => 'Lord',
      'avastha' => 'Avastha',
      'retro' => 'Retro',
      'general' => 'General',
      'personalised' => 'Personalised',
      'spiritualityAdvice' => 'Spirituality Advice',
      'positive' => 'Positive',
      'negative' => 'Negative',
      'luckyGem' => 'Lucky Gem',
      'dayForFasting' => 'Day for Fasting',
      'gayatriMantra' => 'Gayatri Mantra',
      'mainQuality' => 'Main Quality',
      'lagneshStatus' => 'Ascendant Lord Status',
      'strength' => 'Strength',
      'rashiChar' => 'Zodiac Char',
      'verbalLocation' => 'Verbal Location',
      'reportBtn' => 'Get Report',
      'birthDate' => 'Birth Date',
      'birthTime' => 'Birth Time',
      'birthPlace' => 'Birth City',
      'lang' => 'Language',
      'lang_hi' => 'Hindi',
      'lang_mr' => 'Marathi',
      'lang_en' => 'English',
      'error_nocity' => 'Please select a valid city.',
      'ashtakvargaTab' => 'Ashtakvarga',
      'total' => 'Total',
      'planetReportTab' => 'Planet Report',
      'planetSelectLabel' => 'Choose Planet',
      'planetReportHeading' => 'Planet Analysis',
      'planetConsidered' => 'Planet',
      'planetLocation' => 'Planet House',
      'planetNativeLocation' => 'Natural House',
      'planetZodiac' => 'Planet Zodiac',
      'zodiacLord' => 'Zodiac Lord',
      'zodiacLordLocation' => 'Zodiac Lord Location',
      'zodiacLordHouse' => 'Zodiac Lord House',
      'zodiacLordStrength' => 'Zodiac Lord Strength',
      'planetStrength' => 'Planet Strength',
      'planetZodiacPrediction' => 'Zodiac Prediction',
      'planetVerbalLocation' => 'Verbal Location',
      'planetQualitiesLong' => 'Detailed Qualities',
      'planetQualitiesShort' => 'Quick Qualities',
      'planetAffliction' => 'Affliction',
      'planetPositiveTraits' => 'Positive Traits',
      'planetNegativeTraits' => 'Negative Traits',
      'planetDefinition' => 'Planet Definition',
      'planetGayatriMantra' => 'Gayatri Mantra',
      'planetNoData' => 'No planet report available',
    ],
  ];
?>
var H_LABELS = <?php echo json_encode($H_LABELS); ?>;

function H_t(lang, key) { return (H_LABELS[lang] && H_LABELS[lang][key]) || H_LABELS.en[key] || key; }
function planetLabel(lang, planet) {
  var labels = PLANET_LABELS[lang] || PLANET_LABELS.en;
  return (labels && labels[planet]) || PLANET_LABELS.en[planet] || planet;
}

var $F = function(sel) { return document.getElementById(sel); };

var currentLang = "hi";
var currentTab = "planet";
var lastInputValues = null;
var tabPlanet = "planet", tabAsc = "ascendant";
var planetReportPlanet = "Sun";
var PLANET_OPTIONS = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Rahu","Ketu"];
var PLANET_LABELS = {
  hi: { Sun:"सूर्य", Moon:"चंद्रमा", Mercury:"बुध", Venus:"शुक्र", Mars:"मंगल", Jupiter:"बृहस्पति", Saturn:"शनि", Rahu:"राहु", Ketu:"केतु" },
  mr: { Sun:"सूर्य", Moon:"चंद्र", Mercury:"बुध", Venus:"शुक्र", Mars:"मंगळ", Jupiter:"गुरु", Saturn:"शनि", Rahu:"राहु", Ketu:"केतू" },
  en: { Sun:"Sun", Moon:"Moon", Mercury:"Mercury", Venus:"Venus", Mars:"Mars", Jupiter:"Jupiter", Saturn:"Saturn", Rahu:"Rahu", Ketu:"Ketu" }
};

function updateLabels(lang) {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var k = el.getAttribute('data-i18n');
    if (k) el.innerText = H_t(lang, k);
  });
  // Also update option labels if exist
  if ($F('horo_lang')) {
    $F('horo_lang').options[0].text = H_t(lang, 'lang_hi');
    $F('horo_lang').options[1].text = H_t(lang, 'lang_mr');
    $F('horo_lang').options[2].text = H_t(lang, 'lang_en');
  }
}

function tabSwitch(tab) {
  currentTab = tab;
  renderOutput();
}

$F('horo_lang').addEventListener('change', function() {
  currentLang = this.value;
  updateLabels(currentLang);
  renderOutput(true); // force re-request for asc
});

function cityAutocompleteSetup() {
  var input = $F('horo_city'), list = $F('horo_city_list'), latF = $F('horo_lat'), lonF = $F('horo_lon');
  var acTimeout = null, acAbort = null;
  input.addEventListener('input', function() {
    var q = input.value.trim();
    latF.value = '';
    lonF.value = '';
    if (q.length < 2) { list.style.display = 'none'; list.innerHTML = ''; return; }
    if (acAbort) acAbort.abort();
    acAbort = new AbortController();
    if (acTimeout) clearTimeout(acTimeout);
    acTimeout = setTimeout(function() {
      var fd = new FormData();
      fd.append('action', 'horo_geocode');
      fd.append('q', q);
      fd.append('_ajax_nonce', horo_nonce);
      fetch(horo_ajaxurl, {method:'POST', body:fd, signal:acAbort.signal})
        .then(r=>r.json())
        .then(function(j) {
          var items = (j && j.items) ? j.items : [];
          if (!items.length) { list.style.display='none'; list.innerHTML=''; return; }
          list.innerHTML = items.map(function(r){return '<button type=\"button\" data-lat=\"'+r.lat+'\" data-lon=\"'+r.lon+'\" data-name=\"'+r.name+'\">'+
            '<div>'+r.name+'</div><div style=\"font-size:.83em;color:#aaa\">'+r.lat+', '+r.lon+'</div></button>'}).join('');
          list.style.display = 'block';
        })
        .catch(()=>{ list.style.display = 'none'; });
    }, 220);
  });
  list.addEventListener('click', function(e){
    var btn = e.target.closest('button[data-lat]');
    if (!btn) return;
    input.value = btn.getAttribute('data-name');
    latF.value = btn.getAttribute('data-lat');
    lonF.value = btn.getAttribute('data-lon');
    list.style.display='none'; list.innerHTML='';
  });
  document.addEventListener('click', function(e){
    if (!list.contains(e.target) && e.target!==input) { list.style.display = 'none'; }
  });
}

// Utility for HTML escaping values
function escapeHtml(s){ return String(s).replace(/[\"&<>]/g, (c)=>({ '\"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

function formState() {
  return {
    dob: $F('horo_dob').value,
    tob: $F('horo_tob').value,
    lat: $F('horo_lat').value,
    lon: $F('horo_lon').value,
    lang: $F('horo_lang').value
  };
}

function showError(msg) {
  var box = $F('horo_error');
  box.innerText = msg;
  box.style.display = '';
}

function hideError() { $F('horo_error').style.display='none'; }

function ajaxPost(action, data, cb, errcb) {
  var fd = new FormData();
  fd.append('action', action);
  fd.append('_ajax_nonce', horo_nonce);
  for (var k in data) fd.append(k, data[k]);
  fetch(horo_ajaxurl, { method:'POST', body:fd })
    .then(r=>(r.ok?r.json():Promise.reject('http')))
    .then(cb)
    .catch(function(e){ if (errcb) errcb(e); });
}

function clearResults() {
  $F('horo_result').innerHTML = '';
}
function tabButtonsHTML() {
  return '<div class="horo-tab">'+
    '<button type="button" class="horo-tab-btn'+(currentTab==='planet'?' active':'')+'" id="horo_tab_planet">'+H_t(currentLang,'planetTab')+'</button>'+
    '<button type="button" class="horo-tab-btn'+(currentTab==='ascendant'?' active':'')+'" id="horo_tab_ascendant">'+H_t(currentLang,'ascTab')+'</button>'+
    '<button type="button" class="horo-tab-btn'+(currentTab==='ashtakvarga'?' active':'')+'" id="horo_tab_ashtakvarga">'+H_t(currentLang,'ashtakvargaTab')+'</button>'+
    '<button type="button" class="horo-tab-btn'+(currentTab==='planet-report'?' active':'')+'" id="horo_tab_planet_report">'+H_t(currentLang,'planetReportTab')+'</button>'+
    '</div>';
}

function svgSectionHTML(svg) {
  return '<div class="horo-svgborder">'+(svg?svg:'')+'</div>';
}
function planetTableHTML(lang, rows) {
  var t = H_t;
  var th = [t(lang,'lagna'), t(lang,'zodiac'), t(lang,'house'), t(lang,'nakshatra'), t(lang,'angle'), t(lang,'set'), t(lang,'lord'), t(lang,'avastha')];
  var html = '<div class="horo-section"><h3 style="margin-bottom:.5rem">'+t(lang,'planetTable')+'</h3>';
  html += '<table class="horo-table"><thead><tr>'+th.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>';
  for (var k in rows) if (!isNaN(+k)) {
    var p = rows[k];
    html += '<tr>'+
      '<td>'+escapeHtml(p.full_name||p.name)+'</td>'+
      '<td>'+escapeHtml(p.zodiac||\"-\")+'</td>'+
      '<td>'+escapeHtml(p.house)+'</td>'+
      '<td>'+escapeHtml(p.nakshatra||\"-\")+'</td>'+
      '<td>'+((typeof p.local_degree==='number'? p.local_degree.toFixed(2): p.local_degree) || '-')+'&#176;</td>'+
      '<td>'+(p.is_planet_set ? t(lang, 'set') : '-')+'</td>'+
      '<td>'+escapeHtml(p.lord_status||\"-\")+'</td>'+
      '<td>'+escapeHtml(p.basic_avastha||\"-\")+'</td>'+
      '</tr>';
  }
  html += '</tbody></table></div>';
  return html;
}
function divisionalTableHTML(lang, rows) {
  var t = H_t;
  var th = [t(lang,'lagna'), t(lang,'zodiac'), t(lang,'house'), t(lang,'retro'), t(lang,'angle')];
  var html = '<div class="horo-section"><h3 style="margin-bottom:.5rem">'+t(lang,'divisionalTable')+'</h3>';
  html += '<table class="horo-table"><thead><tr>'+th.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>';
  for (var k in rows) if (!isNaN(+k)) {
    var p = rows[k];
    html+='<tr>'+
      '<td>'+escapeHtml(p.full_name||p.name)+'</td>'+
      '<td>'+escapeHtml(p.zodiac||\"-\")+'</td>'+
      '<td>'+escapeHtml(p.house)+'</td>'+
      '<td>'+(p.retro ? t(lang,'retro'):'')+'</td>'+
      '<td>'+((typeof p.local_degree==='number'? p.local_degree.toFixed(2): p.local_degree) || '-')+'&#176;</td>'+
      '</tr>';
  }
  html += '</tbody></table></div>';
  return html;
}
function ascendantHTML(lang, r) {
  var t = H_t;
  if (!r || !r[0]) return '';
  var a = r[0];
  return '<div class="horo-section">'+
    '<div class="horo-card" style="margin-bottom:0"><h3 style="margin-bottom:.5rem">'+t(lang,'ascTab')+'</h3>'+
    '<div><b>'+t(lang,'lagna')+':</b> <span style="color:#c05621">'+escapeHtml(a.ascendant)+'</span> ('+escapeHtml(a.ascendant_lord)+')</div>'+
    '<div style="font-size:.95em; margin:.4rem 0"><b>'+t(lang,'lagneshStatus')+':</b> '+escapeHtml(a.ascendant_lord_location)+', '+t(lang,'house')+': '+escapeHtml(a.ascendant_lord_house_location)+'</div>'+
    '<div style="margin-bottom:.3rem"><b>'+t(lang,'mainQuality')+':</b> <span style="color:#ea580c">'+escapeHtml(a.flagship_qualities)+'</span></div>'+
    '<div><b>'+t(lang,'general')+':</b> '+escapeHtml(a.general_prediction)+'</div>'+
    '<div><b>'+t(lang,'personalised')+':</b> '+escapeHtml(a.personalised_prediction)+'</div>'+
    '<div><b>'+t(lang,'spiritualityAdvice')+':</b> '+escapeHtml(a.spirituality_advice)+'</div>'+
    '<div><b>'+t(lang,'positive')+':</b> '+escapeHtml(a.good_qualities)+'</div>'+
    '<div><b>'+t(lang,'negative')+':</b> '+escapeHtml(a.bad_qualities)+'</div>'+
    '<div><b>'+t(lang,'luckyGem')+':</b> '+escapeHtml(a.lucky_gem)+' &nbsp; <b>'+t(lang,'dayForFasting')+':</b> '+escapeHtml(a.day_for_fasting)+'</div>'+
    '<div><b>'+t(lang,'gayatriMantra')+':</b> '+escapeHtml(a.gayatri_mantra)+'</div>'+
    '<div><b>'+t(lang,'strength')+':</b> '+escapeHtml(a.ascendant_lord_strength)+'</div>'+
    '<div><b>'+t(lang,'verbalLocation')+':</b> '+escapeHtml(a.verbal_location)+'</div>'+
    '<div><b>'+t(lang,'rashiChar')+':</b> '+escapeHtml(a.zodiac_characteristics)+'</div>'+
    '</div></div>';
}
function loadingHTML(lang, type) {
  return '<div class="horo-loader">'+H_t(lang, type||'loading')+'</div>';
}

function ashtakvargaHTML(lang, av){
  if(!av || !av.ashtakvarga_order || !av.ashtakvarga_points || !av.ashtakvarga_total) return '';
  var order = av.ashtakvarga_order;
  var pts = av.ashtakvarga_points;
  var tot = av.ashtakvarga_total;
  var cols = Array.from({length:12},(_,i)=> (i+1).toString());
  var html = '<div class="horo-section"><h3 style="margin-bottom:.5rem">'+H_t(lang,'ashtakvargaTab')+'</h3>';
  html += '<div class="horo-card" style="margin-bottom:0">';
  html += '<table class="horo-table"><thead><tr><th></th>'+cols.map(c=>'<th>'+c+'</th>').join('')+'</tr></thead><tbody>';
  for(var i=0;i<order.length;i++){
    var row = pts[i]||[];
    html += '<tr><td>'+escapeHtml(order[i])+'</td>'+cols.map((_,ci)=>'<td>'+(row[ci]??'')+'</td>').join('')+'</tr>';
  }
  html += '<tr><th>'+H_t(lang,'total')+'</th>'+cols.map((_,ci)=>'<th>'+(tot[ci]??'')+'</th>').join('')+'</tr>';
  html += '</tbody></table></div></div>';
  return html;
}

function planetSelectHTML(lang){
  var options = PLANET_OPTIONS.map(function(p){
    var label = planetLabel(lang, p);
    return '<option value="'+p+'"'+(p===planetReportPlanet?' selected':'')+'>'+escapeHtml(label)+'</option>';
  }).join('');
  return '<div class="horo-card" style="margin-bottom:1rem;">'+
    '<label class="horo-label" for="horo_planet_select">'+H_t(lang,'planetSelectLabel')+'</label>'+
    '<select id="horo_planet_select" class="horo-input">'+options+'</select>'+
    '</div>';
}

function planetReportHTML(lang, list){
  if(!list || !list.length){
    return '<div class="horo-section"><div class="horo-card"><p>'+escapeHtml(H_t(lang,'planetNoData'))+'</p></div></div>';
  }
  function infoRow(label, value){
    if (value===undefined || value===null || value==='') return '';
    return '<div style="background:#fffaf0;border:1px solid #fed7aa;border-radius:.5rem;padding:.6rem;">'+
      '<div style="font-size:.78rem;color:#ea580c;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem">'+escapeHtml(label)+'</div>'+
      '<div style="font-weight:600;color:#7c2d12;">'+escapeHtml(value)+'</div>'+
    '</div>';
  }
  function textBlock(title, value){
    if(!value) return '';
    return '<div style="background:#fff;border:1px solid #fde68a;border-radius:.65rem;padding:.8rem;margin-top:.6rem;">'+
      '<div style="font-weight:600;color:#92400e;margin-bottom:.3rem">'+escapeHtml(title)+'</div>'+
      '<div style="color:#1f2937; line-height:1.5;">'+escapeHtml(value)+'</div>'+
    '</div>';
  }
  function traitsBlock(title, arr, tone){
    if(!arr || !arr.length) return '';
    var bg = tone==='positive' ? '#dcfce7' : '#fee2e2';
    var border = tone==='positive' ? '#86efac' : '#fecaca';
    var color = tone==='positive' ? '#166534' : '#7f1d1d';
    return '<div style="border:1px solid '+border+';background:'+bg+';color:'+color+';border-radius:.65rem;padding:.7rem;margin-top:.6rem;">'+
      '<div style="font-weight:600;margin-bottom:.4rem">'+escapeHtml(title)+'</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:.4rem;">'+
        arr.map(function(item){return '<span style="background:#fff;padding:.25rem .6rem;border-radius:999px;font-size:.85rem;font-weight:600;color:'+color+'">'+escapeHtml(item)+'</span>';}).join('')+
      '</div>'+
    '</div>';
  }
  var html = '<div class="horo-section">';
  list.forEach(function(item){
    var heading = item.planet_considered || planetLabel(lang, planetReportPlanet);
    html += '<div class="horo-card"><h3 style="margin-bottom:.5rem;color:#c2410c">'+H_t(lang,'planetReportHeading')+': '+escapeHtml(heading)+'</h3>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.75rem;">'+
      infoRow(H_t(lang,'planetConsidered'), item.planet_considered) +
      infoRow(H_t(lang,'planetLocation'), item.planet_location) +
      infoRow(H_t(lang,'planetNativeLocation'), item.planet_native_location) +
      infoRow(H_t(lang,'planetZodiac'), item.planet_zodiac) +
      infoRow(H_t(lang,'zodiacLord'), item.zodiac_lord) +
      infoRow(H_t(lang,'zodiacLordLocation'), item.zodiac_lord_location) +
      infoRow(H_t(lang,'zodiacLordHouse'), item.zodiac_lord_house_location) +
      infoRow(H_t(lang,'zodiacLordStrength'), item.zodiac_lord_strength) +
      infoRow(H_t(lang,'planetStrength'), item.planet_strength) +
      infoRow(H_t(lang,'planetVerbalLocation'), item.verbal_location)
    +'</div>';
    html += textBlock(H_t(lang,'general'), item.general_prediction);
    html += textBlock(H_t(lang,'personalised'), item.personalised_prediction);
    html += textBlock(H_t(lang,'planetZodiacPrediction'), item.planet_zodiac_prediction);
    html += textBlock(H_t(lang,'planetQualitiesLong'), item.qualities_long);
    html += textBlock(H_t(lang,'planetQualitiesShort'), item.qualities_short);
    html += textBlock(H_t(lang,'planetAffliction'), item.affliction);
    html += traitsBlock(H_t(lang,'planetPositiveTraits'), item.character_keywords_positive, 'positive');
    html += traitsBlock(H_t(lang,'planetNegativeTraits'), item.character_keywords_negative, 'negative');
    html += textBlock(H_t(lang,'planetDefinition'), item.planet_definitions);
    html += textBlock(H_t(lang,'planetGayatriMantra'), item.gayatri_mantra);
    html += '</div>';
  });
  html += '</div>';
  return html;
}

function formIsValid(input) {
  return input.dob && input.tob && input.lat && input.lon && input.lang;
}

// Main async rendering logic
function renderOutput(langForceAscReload) {
  var input = formState();
  // Save these for reload-on-tab/asc reload/city if needed
  lastInputValues = input;
  var resDiv = $F('horo_result');
  if (!formIsValid(input)) { resDiv.innerHTML = ''; return; }
  resDiv.innerHTML = tabButtonsHTML()+loadingHTML(input.lang,'loading');
  document.getElementById('horo_tab_planet').onclick = function(){tabSwitch('planet');};
  document.getElementById('horo_tab_ascendant').onclick = function(){tabSwitch('ascendant');};
  var _tabAV = document.getElementById('horo_tab_ashtakvarga'); if(_tabAV){ _tabAV.onclick = function(){tabSwitch('ashtakvarga');}; }
  var _tabPR = document.getElementById('horo_tab_planet_report'); if(_tabPR){ _tabPR.onclick = function(){tabSwitch('planet-report');}; }
  function err(msg) { resDiv.innerHTML = tabButtonsHTML()+'<div class="horo-error">'+escapeHtml(msg)+'</div>'; }
  // --- Start fetching ---
  if (currentTab === 'planet') {
    // 1. fetch chart SVG - show loader
    resDiv.innerHTML = tabButtonsHTML()+loadingHTML(input.lang,'d1ChartLoading');
    ajaxPost('horo_chart_image', input, function(data){
      var svg = data.svg||'';
      // Remove fixed width/height
      svg = svg.replace(/\s(width|height)=\"[^\"]*\"/g, "");
      if (!/viewBox=/.test(svg)) svg = svg.replace('<svg', '<svg viewBox=\"0 0 500 500\"');
      if (!/preserveAspectRatio=/.test(svg)) svg = svg.replace('<svg', '<svg preserveAspectRatio=\"xMidYMid meet\"');
      // 2. fetch planet table (show chart first)
      resDiv.innerHTML = tabButtonsHTML() + svgSectionHTML(svg) + loadingHTML(input.lang, 'planetTable');
      ajaxPost('horo_planet_details', input, function(pd) {
        if (!pd || !pd.response) { return err(H_t(input.lang, 'chartLoadErr')); }
        // 3. fetch divisional chart
        resDiv.innerHTML = tabButtonsHTML() + svgSectionHTML(svg) + planetTableHTML(input.lang,pd.response) + loadingHTML(input.lang,'divisionalTable');
        ajaxPost('horo_divisional_charts', input, function(div) {
          if (!div || !div.response) { return; }
          resDiv.innerHTML = tabButtonsHTML() + svgSectionHTML(svg) + planetTableHTML(input.lang,pd.response) + divisionalTableHTML(input.lang,div.response);
        });
      }, function(){ err(H_t(input.lang,'chartLoadErr')); });
    }, function(){ err(H_t(input.lang,'chartLoadErr')); });
  } else if (currentTab === 'ascendant') {
    resDiv.innerHTML = tabButtonsHTML()+loadingHTML(input.lang,'loading');
    ajaxPost('horo_ascendant_report', input, function(ar){
      if (!ar || !ar.response) { return err(H_t(input.lang,'chartLoadErr')); }
      resDiv.innerHTML = tabButtonsHTML()+ascendantHTML(input.lang,ar.response);
    }, function(){ err(H_t(input.lang,'chartLoadErr')); });
  } else if (currentTab === 'ashtakvarga') {
    resDiv.innerHTML = tabButtonsHTML()+loadingHTML(input.lang,'loading');
    ajaxPost('horo_ashtakvarga', input, function(av){
      if (!av || !av.response) { return err(H_t(input.lang,'chartLoadErr')); }
      resDiv.innerHTML = tabButtonsHTML()+ashtakvargaHTML(input.lang,av.response);
    }, function(){ err(H_t(input.lang,'chartLoadErr')); });
  } else if (currentTab === 'planet-report') {
    var base = tabButtonsHTML()+planetSelectHTML(input.lang)+loadingHTML(input.lang,'loading');
    resDiv.innerHTML = base;
    var payload = Object.assign({}, input, { planet: planetReportPlanet });
    function attachSelect(){
      var select = document.getElementById('horo_planet_select');
      if (select) {
        select.value = planetReportPlanet;
        select.onchange = function(){
          planetReportPlanet = this.value;
          renderOutput();
        };
      }
    }
    ajaxPost('horo_planet_report', payload, function(pr){
      resDiv.innerHTML = tabButtonsHTML()+planetSelectHTML(input.lang)+planetReportHTML(input.lang, pr && pr.response);
      attachSelect();
    }, function(){
      resDiv.innerHTML = tabButtonsHTML()+planetSelectHTML(input.lang)+'<div class="horo-error">'+escapeHtml(H_t(input.lang,'chartLoadErr'))+'</div>';
      attachSelect();
    });
  }
}

function handleSubmit(){
  hideError();
  var input = formState();
  if (!input.lat || !input.lon) { showError(H_t(input.lang||'hi','error_nocity')); return false; }
  renderOutput();
  return false;
}
$F('horoForm').onsubmit = function(e){ e.preventDefault(); return handleSubmit(); };
var _btn=$F('horo_submit_btn'); if(_btn){ _btn.addEventListener('click', function(e){ e.preventDefault(); handleSubmit(); }); }

cityAutocompleteSetup();
updateLabels(currentLang);

 // END plugin JS
})();</script>
<?php return ob_get_clean(); });

// AJAX proxy handlers (to be implemented next):
function horo_geocode_handler() {
  check_ajax_referer('horoscope_nonce');
  $q = isset($_POST['q']) ? sanitize_text_field($_POST['q']) : '';
  if (mb_strlen($q) < 2) wp_send_json(['items'=>[]]);
  $url = 'https://nominatim.openstreetmap.org/search?'.http_build_query([
    'q'=>$q,
    'format'=>'jsonv2', 'addressdetails'=>1,'countrycodes'=>'in','limit'=>8
  ]);
  $resp = wp_remote_get($url, [ 'headers'=>['Accept'=>'application/json','User-Agent'=>'AstroWordPress/1.0'], 'timeout'=>15 ]);
  if (is_wp_error($resp)) wp_send_json(['items'=>[]]);
  $data = json_decode(wp_remote_retrieve_body($resp),true);
  $items = array_map(function($r){ return array(
    'id'=>$r['place_id']??'', 'name'=>$r['display_name']??'',
    'lat'=>$r['lat']??'', 'lon'=>$r['lon']??''
  ); }, (array)$data);
  wp_send_json(['items'=>$items]);
}
add_action('wp_ajax_horo_geocode','horo_geocode_handler');
add_action('wp_ajax_nopriv_horo_geocode','horo_geocode_handler');

function horo_ajax($name,$handler) {
  add_action("wp_ajax_{$name}",$handler);
  add_action("wp_ajax_nopriv_{$name}",$handler);
}
horo_ajax('horo_planet_details',function(){
  check_ajax_referer('horoscope_nonce');
  $params = array_map('sanitize_text_field', $_POST);
  $params['api_key'] = HOROSCOPE_API_KEY;
  $params['tz'] = 5.5;
  $params['house_type'] = 'whole-sign';
  $params['zodiac_type'] = 'sidereal';
  $params['dob'] = horo_date($params['dob']);
  $url = 'https://api.vedicastroapi.com/v3-json/horoscope/planet-details?'.http_build_query($params);
  $resp = wp_remote_get($url,['timeout'=>28]);
  if (is_wp_error($resp)) wp_send_json_error(['error'=>'api_error']);
  $data = json_decode(wp_remote_retrieve_body($resp),true); wp_send_json($data);
});
horo_ajax('horo_ascendant_report',function(){
  check_ajax_referer('horoscope_nonce');
  $params = array_map('sanitize_text_field', $_POST);
  $params['api_key'] = HOROSCOPE_API_KEY;
  $params['tz'] = 5.5;
  $params['dob'] = horo_date($params['dob']);
  $url = 'https://api.vedicastroapi.com/v3-json/horoscope/ascendant-report?'.http_build_query($params);
  $resp = wp_remote_get($url,['timeout'=>18]);
  if (is_wp_error($resp)) wp_send_json_error(['error'=>'api_error']);
  $data = json_decode(wp_remote_retrieve_body($resp),true); wp_send_json($data);
});
horo_ajax('horo_divisional_charts',function(){
  check_ajax_referer('horoscope_nonce');
  $params = array_map('sanitize_text_field', $_POST);
  $params['api_key'] = HOROSCOPE_API_KEY;
  $params['tz'] = 5.5; $params['div'] = 'D1';
  $params['response_type'] = 'planet_object';
  $params['dob'] = horo_date($params['dob']);
  $url = 'https://api.vedicastroapi.com/v3-json/horoscope/divisional-charts?'.http_build_query($params);
  $resp = wp_remote_get($url,['timeout'=>18]);
  if (is_wp_error($resp)) wp_send_json_error(['error'=>'api_error']);
  $data = json_decode(wp_remote_retrieve_body($resp),true); wp_send_json($data);
});
horo_ajax('horo_chart_image',function(){
  check_ajax_referer('horoscope_nonce');
  $params = array_map('sanitize_text_field', $_POST);
  $params['api_key'] = HOROSCOPE_API_KEY;
  $params['tz'] = 5.5; $params['div'] = 'D1';
  $params['style'] = 'north'; $params['color'] = '000000';
  $params['dob'] = horo_date($params['dob']);
  $url = 'https://api.vedicastroapi.com/v3-json/horoscope/chart-image?'.http_build_query($params);
  $resp = wp_remote_get($url,['timeout'=>18]);
  $svg = is_wp_error($resp) ? '' : wp_remote_retrieve_body($resp);
  if (!$svg || strpos($svg,'<svg')===false) wp_send_json_error(['error'=>'chart_error']);
  wp_send_json(['svg'=>$svg]);
});
horo_ajax('horo_ashtakvarga',function(){
  check_ajax_referer('horoscope_nonce');
  $params = array_map('sanitize_text_field', $_POST);
  $params['api_key'] = HOROSCOPE_API_KEY;
  $params['tz'] = 5.5;
  $params['dob'] = horo_date($params['dob']);
  $url = 'https://api.vedicastroapi.com/v3-json/horoscope/ashtakvarga?'.http_build_query($params);
  $resp = wp_remote_get($url,['timeout'=>20]);
  if (is_wp_error($resp)) wp_send_json_error(['error'=>'api_error']);
  $data = json_decode(wp_remote_retrieve_body($resp),true); wp_send_json($data);
});
horo_ajax('horo_planet_report',function(){
  check_ajax_referer('horoscope_nonce');
  $params = array_map('sanitize_text_field', $_POST);
  $params['api_key'] = HOROSCOPE_API_KEY;
  $params['tz'] = 5.5;
  $params['planet'] = $params['planet'] ?? 'Sun';
  $params['dob'] = horo_date($params['dob']);
  $url = 'https://api.vedicastroapi.com/v3-json/horoscope/planet-report?'.http_build_query($params);
  $resp = wp_remote_get($url,['timeout'=>20]);
  if (is_wp_error($resp)) wp_send_json_error(['error'=>'api_error']);
  $data = json_decode(wp_remote_retrieve_body($resp),true); wp_send_json($data);
});
function horo_date($dob) {
  if (strpos($dob,'-')!==false) {
    $a = explode('-',$dob); if(count($a)===3) return "$a[2]/$a[1]/$a[0]";
  }
  return $dob;
}
