<?php
/*
Plugin Name: Matchmaking Prediction (Ashtakoot) — Astrology Consultancy
Description: Beautiful matchmaking (Ashtakoot) page with city autocomplete, server-side API proxy, and SVG kundali charts. Use shortcode: [matchmaking_prediction]
Version: 1.0.0
Author: Astrology Consultancy
*/

if (!defined('ABSPATH')) { exit; }

// Shortcode
add_shortcode('matchmaking_prediction', function() {
    $nonce = wp_create_nonce('mm_nonce');
    ob_start();
    ?>
    <style>
        .mm-gradient-bg { background: linear-gradient(135deg,#fed7aa 0%,#fecaca 50%,#fef3c7 100%); }
        .mm-card { background:#fff; border-radius:12px; box-shadow:0 10px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04); }
        .mm-input { width:100%; padding:.5rem .75rem; border:1px solid #d1d5db; border-radius:.5rem; }
        .mm-label { display:block; font-size:.875rem; font-weight:600; color:#374151; margin-bottom:.25rem; }
        .mm-btn { background:#ea580c; color:#fff; padding:.75rem 1.5rem; font-weight:700; border:none; border-radius:.5rem; cursor:pointer; }
        .mm-btn:hover { background:#c2410c; }
        .mm-muted { color:#6b7280; }
        .mm-table { width:100%; border-collapse:collapse; }
        .mm-table th, .mm-table td { border:1px solid #fdba74; padding:.5rem .75rem; }
        .mm-table thead { background:linear-gradient(90deg,#ffedd5,#fef3c7); }
        .mm-chip { display:inline-block; padding:.5rem 1rem; border-radius:9999px; font-weight:800; }
        .mm-green { background:#dcfce7; color:#16a34a; }
        .mm-yellow { background:#fef9c3; color:#ca8a04; }
        .mm-red { background:#fee2e2; color:#dc2626; }
        .mm-grid { display:grid; gap:1rem; }
        @media(min-width:768px){ .mm-grid-2{ grid-template-columns:1fr 1fr; } }
        .mm-autocomplete { position:relative; }
        .mm-list { position:absolute; z-index:20; margin-top:.25rem; width:100%; background:#fff; border:1px solid #e5e7eb; border-radius:.5rem; box-shadow:0 8px 16px rgba(0,0,0,.08); max-height:16rem; overflow:auto; display:none; color:#111827; }
        .mm-list button { width:100%; text-align:left; padding:.5rem .75rem; border:none; background:#fff; cursor:pointer; color:#111827; }
        .mm-list button:hover { background:#f3f4f6; }
        .mm-box { padding:1.25rem; border:1px solid #fde68a; background:#fffbeb; border-radius:.75rem; }
        .mm-error { padding:1rem; border:1px solid #fecaca; background:#fef2f2; border-radius:.75rem; color:#b91c1c; display:none; }
        .mm-chart { background:linear-gradient(135deg,#eff6ff,#eef2ff); border:2px solid #93c5fd; min-height:320px; border-radius:.75rem; display:flex; align-items:center; justify-content:center; padding:.5rem; overflow:hidden; }
        /* Mobile and SVG responsiveness */
        .mm-card.responsive { overflow-x:auto; }
        #mm_boy_chart svg, #mm_girl_chart svg { max-width:100%; width:100% !important; height:auto !important; display:block; }
    </style>

    <div class="mm-gradient-bg" style="min-height:100%; padding:2rem 1rem;">
      <div style="max-width:1100px; margin:0 auto;">
        <div style="text-align:center; margin-bottom:1.5rem;">
          <h2 style="font-size:2rem; font-weight:800; color:#9a3412; margin:.5rem 0;">🔮 अष्टकूट मिलान</h2>
          <p class="mm-muted">वर-वधू की जन्मकुंडली के आधार पर विवाह अनुकूलता का विश्लेषण</p>
        </div>

        <div class="mm-card" style="padding:1.5rem; margin-bottom:1.5rem;">
          <h3 style="font-size:1.25rem; font-weight:700; color:#9a3412; margin-bottom:1rem;">जन्म विवरण दर्ज करें</h3>
          <form id="mmForm" class="mm-grid mm-grid-2">
            <div class="mm-grid" style="gap:.75rem;">
              <h4 style="font-size:1.125rem; font-weight:700; color:#1d4ed8; border-bottom:2px solid #bfdbfe; padding-bottom:.5rem;">👨 वर</h4>
              <label class="mm-label" for="mm_boy_dob">जन्म तिथि *</label>
              <input class="mm-input" id="mm_boy_dob" type="date" required>
              <label class="mm-label" for="mm_boy_tob">जन्म समय *</label>
              <input class="mm-input" id="mm_boy_tob" type="time" required>
              <label class="mm-label" for="mm_boy_tz">समय क्षेत्र</label>
              <input class="mm-input" id="mm_boy_tz" type="number" step="0.5" value="5.5">
              <label class="mm-label">जन्म स्थान *</label>
              <div class="mm-autocomplete">
                <input class="mm-input" id="mm_boy_city" placeholder="उदा. दिल्ली, मुंबई, पुणे" autocomplete="off">
                <div id="mm_boy_list" class="mm-list"></div>
              </div>
              <input type="hidden" id="mm_boy_lat" value="28.033709">
              <input type="hidden" id="mm_boy_lon" value="79.120544">
            </div>

            <div class="mm-grid" style="gap:.75rem;">
              <h4 style="font-size:1.125rem; font-weight:700; color:#be185d; border-bottom:2px solid #fecdd3; padding-bottom:.5rem;">👩 वधू</h4>
              <label class="mm-label" for="mm_girl_dob">जन्म तिथि *</label>
              <input class="mm-input" id="mm_girl_dob" type="date" required>
              <label class="mm-label" for="mm_girl_tob">जन्म समय *</label>
              <input class="mm-input" id="mm_girl_tob" type="time" required>
              <label class="mm-label" for="mm_girl_tz">समय क्षेत्र</label>
              <input class="mm-input" id="mm_girl_tz" type="number" step="0.5" value="5.5">
              <label class="mm-label">जन्म स्थान *</label>
              <div class="mm-autocomplete">
                <input class="mm-input" id="mm_girl_city" placeholder="उदा. दिल्ली, मुंबई, पुणे" autocomplete="off">
                <div id="mm_girl_list" class="mm-list"></div>
              </div>
              <input type="hidden" id="mm_girl_lat" value="28.679079">
              <input type="hidden" id="mm_girl_lon" value="77.069710">
            </div>

            <div class="mm-grid" style="grid-column:1/-1; gap:.75rem;">
              <label class="mm-label" for="mm_lang">भाषा</label>
              <select class="mm-input" id="mm_lang">
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
                <option value="en">English</option>
              </select>
              <div style="text-align:center; margin-top:.5rem;">
                <button type="submit" class="mm-btn" id="mm_submit">अष्टकूट मिलान करें</button>
              </div>
            </div>
          </form>
        </div>

        <div id="mm_error" class="mm-error"><span></span></div>

        <div id="mm_results" style="display:none;" class="mm-grid" >
          <div class="mm-card" style="text-align:center; padding:1.5rem;">
            <h3 style="font-size:1.5rem; font-weight:800; color:#9a3412; margin-bottom:1rem;">🎯 अष्टकूट मिलान परिणाम</h3>
            <div id="mm_scores" style="margin-bottom:.75rem;"></div>
            <p id="mm_bot" class="mm-muted"></p>
          </div>

          <div class="mm-card responsive" style="padding:1.25rem;">
            <h4 style="font-size:1.25rem; font-weight:700; color:#9a3412; margin-bottom:.75rem;">📊 अष्टकूट विवरण</h4>
            <div style="overflow:auto;">
              <table class="mm-table">
                <thead>
                  <tr>
                    <th>अष्टकूट नाम</th>
                    <th class="mm-muted">वर</th>
                    <th class="mm-muted">वधू</th>
                    <th class="mm-muted">अंक</th>
                    <th class="mm-muted">विवरण</th>
                  </tr>
                </thead>
                <tbody id="mm_dashakoot"></tbody>
              </table>
            </div>
          </div>

          <div class="mm-card responsive" style="padding:1.25rem;">
            <h4 style="font-size:1.25rem; font-weight:700; color:#9a3412; margin-bottom:.75rem;">🏠 कुंडली चार्ट</h4>
            <div class="mm-grid mm-grid-2">
              <div>
                <h5 style="color:#1d4ed8; font-weight:700; margin:.5rem 0;">वर की कुंडली</h5>
                <div id="mm_boy_chart" class="mm-chart"></div>
              </div>
              <div>
                <h5 style="color:#be185d; font-weight:700; margin:.5rem 0;">वधू की कुंडली</h5>
                <div id="mm_girl_chart" class="mm-chart"></div>
              </div>
            </div>
          </div>

          <div class="mm-card responsive" style="padding:1.25rem;">
            <h4 style="font-size:1.25rem; font-weight:700; color:#9a3412; margin-bottom:.75rem;">🌟 ग्रह विवरण</h4>
            <div class="mm-grid mm-grid-2">
              <div>
                <h5 style="color:#1d4ed8; font-weight:700; margin:.5rem 0;">वर के ग्रह</h5>
                <div id="mm_boy_planets"></div>
              </div>
              <div>
                <h5 style="color:#be185d; font-weight:700; margin:.5rem 0;">वधू के ग्रह</h5>
                <div id="mm_girl_planets"></div>
              </div>
            </div>
          </div>

          <div class="mm-card" style="padding:1.25rem;">
            <h4 style="font-size:1.25rem; font-weight:700; color:#9a3412; margin-bottom:.75rem;">✨ ज्योतिष विवरण</h4>
            <div class="mm-grid mm-grid-2">
              <div>
                <h5 style="color:#1d4ed8; font-weight:700; margin:.5rem 0;">वर</h5>
                <div id="mm_boy_astro" class="mm-box"></div>
              </div>
              <div>
                <h5 style="color:#be185d; font-weight:700; margin:.5rem 0;">वधू</h5>
                <div id="mm_girl_astro" class="mm-box"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      (function(){
        const ajaxUrl = <?php echo json_encode(admin_url('admin-ajax.php')); ?>;
        const nonce = <?php echo json_encode($nonce); ?>;

        function ddmmyyyy(iso){ if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; }
        function scoreClass(s){ return s>=7?'mm-green':(s>=5?'mm-yellow':'mm-red'); }

        function setupCity(idInput,idList,idLat,idLon){
          const el = document.getElementById(idInput), list = document.getElementById(idList);
          const latEl = document.getElementById(idLat), lonEl = document.getElementById(idLon);
          let ac=null;
          el.addEventListener('input', ()=>{
            const q = el.value.trim();
            if(q.length<2){ list.style.display='none'; list.innerHTML=''; return; }
            ac && ac.abort && ac.abort(); ac = new AbortController();
            const body = new URLSearchParams({ action:'matchmaking_geocode', q, _wpnonce:nonce });
            fetch(ajaxUrl,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body, signal:ac.signal })
              .then(r=>r.json())
              .then(j=>{
                const items = Array.isArray(j?.items)? j.items : [];
                if(items.length===0){ list.style.display='none'; list.innerHTML=''; return; }
                list.innerHTML = items.map(r=>`<button type="button" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${r.name}"><div>${r.name}</div><div class="mm-muted" style="font-size:.75rem;">${r.lat}, ${r.lon}</div></button>`).join('');
                list.style.display='block';
              })
              .catch(()=>{ list.style.display='none'; list.innerHTML=''; });
          });
          list.addEventListener('click', (e)=>{
            const btn = e.target.closest('button[data-lat]'); if(!btn) return;
            el.value = btn.getAttribute('data-name');
            latEl.value = btn.getAttribute('data-lat');
            lonEl.value = btn.getAttribute('data-lon');
            list.style.display='none'; list.innerHTML='';
          });
          document.addEventListener('click',(e)=>{ if(!list.contains(e.target) && e.target!==el){ list.style.display='none'; }});
        }

        setupCity('mm_boy_city','mm_boy_list','mm_boy_lat','mm_boy_lon');
        setupCity('mm_girl_city','mm_girl_list','mm_girl_lat','mm_girl_lon');

        const form = document.getElementById('mmForm');
        form.addEventListener('submit', function(e){
          e.preventDefault();
          const btn = document.getElementById('mm_submit');
          btn.disabled=true; btn.textContent='मिलान हो रहा है...';
          const err = document.getElementById('mm_error'); err.style.display='none'; err.querySelector('span').textContent='';

          const payload = {
            action: 'matchmaking_fetch',
            _wpnonce: nonce,
            boy_dob: ddmmyyyy(document.getElementById('mm_boy_dob').value),
            boy_tob: document.getElementById('mm_boy_tob').value,
            boy_tz: document.getElementById('mm_boy_tz').value || '5.5',
            boy_lat: document.getElementById('mm_boy_lat').value,
            boy_lon: document.getElementById('mm_boy_lon').value,
            girl_dob: ddmmyyyy(document.getElementById('mm_girl_dob').value),
            girl_tob: document.getElementById('mm_girl_tob').value,
            girl_tz: document.getElementById('mm_girl_tz').value || '5.5',
            girl_lat: document.getElementById('mm_girl_lat').value,
            girl_lon: document.getElementById('mm_girl_lon').value,
            lang: document.getElementById('mm_lang').value
          };

          const body = new URLSearchParams(payload);
          fetch(ajaxUrl,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body })
            .then(r=>r.json())
            .then(data=>{
              if(!data || data.status!==200){ throw new Error(data?.error||'Unexpected error'); }
              renderAll(data);
              // Fetch charts
              fetchChart('mm_boy_chart', { dob: payload.boy_dob, tob: payload.boy_tob, lat: payload.boy_lat, lon: payload.boy_lon, tz: payload.boy_tz, lang: payload.lang });
              fetchChart('mm_girl_chart', { dob: payload.girl_dob, tob: payload.girl_tob, lat: payload.girl_lat, lon: payload.girl_lon, tz: payload.girl_tz, lang: payload.lang });
            })
            .catch(ex=>{ err.style.display='block'; err.querySelector('span').textContent = ex?.message||'कुछ गड़बड़ है'; })
            .finally(()=>{ btn.disabled=false; btn.textContent='अष्टकूट मिलान करें'; });
        });

        function renderAll(resp){
          document.getElementById('mm_results').style.display='grid';
          const score = Number(resp.response?.score||0);
          const cls = (score>=24)?'mm-green':(score>=18?'mm-yellow':'mm-red');
          document.getElementById('mm_scores').innerHTML = `
            <div style="display:flex; gap:1rem; justify-content:center; align-items:center;">
              <div>
                <div class="mm-muted" style="font-size:.875rem; margin-bottom:.25rem;">अष्टकूट</div>
                <div class="mm-chip ${cls}">${score.toFixed(1)}/36</div>
              </div>
            </div>`;
          document.getElementById('mm_bot').textContent = resp.response?.bot_response||'';

          const keys = ['tara','gana','yoni','bhakoot','grahamaitri','vasya','nadi','varna'];
          const tbody = document.getElementById('mm_dashakoot');
          tbody.innerHTML='';
          keys.forEach(k=>{
            const d = resp.response?.[k]; if(!d) return;
            const s = typeof d[k]==='number'? d[k] : 0;
            const color = (s / (d.full_score||1))>=0.7? 'color:#16a34a' : ((s / (d.full_score||1))>=0.5?'color:#ca8a04':'color:#dc2626');
            const boy = d.boy_tara||d.boy_gana||d.boy_yoni||d.boy_rasi_name||d.boy_lord||d.boy_vasya||d.boy_nadi||d.boy_varna||'-';
            const girl = d.girl_tara||d.girl_gana||d.girl_yoni||d.girl_rasi_name||d.girl_lord||d.girl_vasya||d.girl_nadi||d.girl_varna||'-';
            const tr = document.createElement('tr');
            tr.innerHTML = `<td><strong>${d.name}</strong></td><td>${boy}</td><td>${girl}</td><td style="text-align:center;"><span style="${color}; font-weight:700;">${s}/${d.full_score}</span></td><td class=\"mm-muted\">${d.description||''}</td>`;
            tbody.appendChild(tr);
          });

          function table(planets){
            let html = '<table class="mm-table" style="border-color:#f3f4f6">\n<thead><tr><th>ग्रह</th><th>राशि</th><th>भाव</th><th>नक्षत्र</th><th>अंश</th></tr></thead><tbody>';
            Object.values(planets||{}).forEach(p=>{
              const deg = (typeof p.local_degree==='number')? p.local_degree.toFixed(2): p.local_degree;
              html += `<tr><td><strong>${p.name}</strong></td><td>${p.zodiac||'-'}</td><td>${p.house||'-'}</td><td>${p.nakshatra||'-'}</td><td>${deg||'-'}°</td></tr>`;
            });
            html += '</tbody></table>';
            return html;
          }
          document.getElementById('mm_boy_planets').innerHTML = table(resp.response?.boy_planetary_details);
          document.getElementById('mm_girl_planets').innerHTML = table(resp.response?.girl_planetary_details);

          function astro(a){
            if(!a) return '';
            function row(k,v){ return `<div style="display:flex; justify-content:space-between; margin:.25rem 0"><span style="font-weight:600;">${k}:</span><span class="mm-muted">${v}</span></span></div>`; }
            return `
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:.5rem;">
                <div>
                  ${row('गण', a.gana||'-')}
                  ${row('योनि', a.yoni||'-')}
                  ${row('वश्य', a.vasya||'-')}
                  ${row('नाड़ी', a.nadi||'-')}
                  ${row('वर्ण', a.varna||'-')}
                  ${row('पाया', a.paya||'-')}
                </div>
                <div>
                  ${row('तत्व', a.tatva||'-')}
                  ${row('राशि', a.rasi||'-')}
                  ${row('नक्षत्र', a.nakshatra||'-')}
                  ${row('लग्न', a.ascendant_sign||'-')}
                  ${row('वर्तमान दशा', a.current_dasa||'-')}
                </div>
              </div>
              <div style="margin-top:.75rem; padding-top:.5rem; border-top:1px solid #e5e7eb">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:.5rem;">
                  <div><div style="font-weight:600; margin-bottom:.25rem;">शुभ रत्न:</div><div class="mm-muted">${(a.lucky_gem||[]).join(', ')}</div></div>
                  <div><div style="font-weight:600; margin-bottom:.25rem;">शुभ अंक:</div><div class="mm-muted">${(a.lucky_num||[]).join(', ')}</div></div>
                  <div><div style="font-weight:600; margin-bottom:.25rem;">शुभ रंग:</div><div class="mm-muted">${(a.lucky_colors||[]).join(', ')}</div></div>
                  <div><div style="font-weight:600; margin-bottom:.25rem;">शुभ अक्षर:</div><div class="mm-muted">${(a.lucky_letters||[]).join(', ')}</div></div>
                </div>
              </div>`;
          }
          document.getElementById('mm_boy_astro').innerHTML = astro(resp.response?.boy_astro_details);
          document.getElementById('mm_girl_astro').innerHTML = astro(resp.response?.girl_astro_details);
        }

        function normalizeSvg(svg){
          try {
            // Remove fixed width/height
            svg = svg.replace(/\s(width|height)="[^"]+"/g, '');
            // Ensure responsive attributes
            if (!/viewBox=/.test(svg)) {
              // Try to infer a square viewBox if missing
              svg = svg.replace('<svg', '<svg viewBox="0 0 500 500"');
            }
            if (!/preserveAspectRatio=/.test(svg)) {
              svg = svg.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"');
            }
          } catch(e) {}
          return svg;
        }

        function fetchChart(targetId, p){
          const el = document.getElementById(targetId);
          el.innerHTML = '<div class="mm-muted">लोड हो रहा है...</div>';
          const body = new URLSearchParams({ action:'matchmaking_chart', _wpnonce:nonce, dob:p.dob, tob:p.tob, lat:p.lat, lon:p.lon, tz:p.tz, div:'D1', style:'north', color:'000000', lang:p.lang });
          fetch(ajaxUrl,{ method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body })
            .then(r=>r.json())
            .then(j=>{ const raw = j?.svg || ''; el.innerHTML = raw ? normalizeSvg(raw) : '<div class="mm-muted">चार्ट उपलब्ध नहीं</div>'; })
            .catch(()=>{ el.innerHTML = '<div style="color:#dc2626">त्रुटि</div>'; });
        }
      })();
    </script>
    <?php
    return ob_get_clean();
});

// AJAX: Geocode via Nominatim (server-side to avoid CORS)
add_action('wp_ajax_matchmaking_geocode', 'mm_geocode');
add_action('wp_ajax_nopriv_matchmaking_geocode', 'mm_geocode');
function mm_geocode() {
    if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], 'mm_nonce')) {
        wp_send_json(array('error' => 'invalid_nonce'), 403);
    }
    $q = isset($_POST['q']) ? sanitize_text_field(wp_unslash($_POST['q'])) : '';
    if (strlen($q) < 2) wp_send_json(array('items'=>array()));
    $url = add_query_arg(array(
        'q' => rawurlencode($q),
        'format' => 'jsonv2',
        'limit' => 8,
        'addressdetails' => 1,
        'countrycodes' => 'in'
    ), 'https://nominatim.openstreetmap.org/search');
    $resp = wp_remote_get($url, array(
        'headers' => array('Accept' => 'application/json','User-Agent' => 'AstrologyConsultancy/1.0'),
        'timeout' => 15
    ));
    if (is_wp_error($resp)) wp_send_json(array('items'=>array()));
    $data = json_decode(wp_remote_retrieve_body($resp), true);
    $items = array();
    if (is_array($data)) {
        foreach ($data as $r) {
            $items[] = array(
                'id' => isset($r['place_id']) ? $r['place_id'] : '',
                'name' => isset($r['display_name']) ? $r['display_name'] : '',
                'lat' => isset($r['lat']) ? $r['lat'] : '',
                'lon' => isset($r['lon']) ? $r['lon'] : '',
            );
        }
    }
    wp_send_json(array('items'=>$items));
}

// AJAX: Matchmaking fetch
add_action('wp_ajax_matchmaking_fetch', 'mm_fetch');
add_action('wp_ajax_nopriv_matchmaking_fetch', 'mm_fetch');
function mm_fetch(){
    if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], 'mm_nonce')) {
        wp_send_json(array('error'=>'invalid_nonce'), 403);
    }
    $p = array();
    $p['boy_dob'] = sanitize_text_field(wp_unslash($_POST['boy_dob'] ?? ''));
    $p['boy_tob'] = sanitize_text_field(wp_unslash($_POST['boy_tob'] ?? ''));
    $p['boy_tz']  = floatval($_POST['boy_tz'] ?? 5.5);
    $p['boy_lat'] = sanitize_text_field(wp_unslash($_POST['boy_lat'] ?? '28.033709'));
    $p['boy_lon'] = sanitize_text_field(wp_unslash($_POST['boy_lon'] ?? '79.120544'));
    $p['girl_dob'] = sanitize_text_field(wp_unslash($_POST['girl_dob'] ?? ''));
    $p['girl_tob'] = sanitize_text_field(wp_unslash($_POST['girl_tob'] ?? ''));
    $p['girl_tz']  = floatval($_POST['girl_tz'] ?? 5.5);
    $p['girl_lat'] = sanitize_text_field(wp_unslash($_POST['girl_lat'] ?? '28.679079'));
    $p['girl_lon'] = sanitize_text_field(wp_unslash($_POST['girl_lon'] ?? '77.069710'));
    $p['lang']     = sanitize_text_field(wp_unslash($_POST['lang'] ?? 'hi'));

    if (!$p['boy_dob'] || !$p['boy_tob'] || !$p['girl_dob'] || !$p['girl_tob']) {
        wp_send_json(array('error'=>'Missing required fields'), 400);
    }

    $payload = array(
        'boy_dob' => $p['boy_dob'],
        'boy_tob' => $p['boy_tob'],
        'boy_tz'  => $p['boy_tz'],
        'boy_lat' => $p['boy_lat'],
        'boy_lon' => $p['boy_lon'],
        'girl_dob'=> $p['girl_dob'],
        'girl_tob'=> $p['girl_tob'],
        'girl_tz' => $p['girl_tz'],
        'girl_lat'=> $p['girl_lat'],
        'girl_lon'=> $p['girl_lon'],
        'lang'    => $p['lang'],
        'api_key' => '6bff3246-afb9-5027-92c1-f2c6f1c182f5',
    );

    $url = 'https://api.vedicastroapi.com/v3-json/matching/ashtakoot-with-astro-details';
    $query = add_query_arg(array_map('strval', $payload), $url);
    $resp = wp_remote_get($query, array('timeout'=>25));
    if (!is_wp_error($resp) && wp_remote_retrieve_response_code($resp)===200) {
        $data = json_decode(wp_remote_retrieve_body($resp), true);
        if ($data) { wp_send_json($data); }
    }
    // fallback POST form-urlencoded
    $resp2 = wp_remote_post($url, array(
        'timeout'=>25,
        'headers'=> array('Content-Type'=>'application/x-www-form-urlencoded'),
        'body'=> http_build_query($payload)
    ));
    if (!is_wp_error($resp2) && wp_remote_retrieve_response_code($resp2)===200) {
        $data2 = json_decode(wp_remote_retrieve_body($resp2), true);
        if ($data2) { wp_send_json($data2); }
    }
    $err = is_wp_error($resp) ? $resp->get_error_message() : wp_remote_retrieve_body($resp);
    wp_send_json(array('error'=>'Upstream error','detail'=>$err), 502);
}

// AJAX: Chart SVG
add_action('wp_ajax_matchmaking_chart', 'mm_chart');
add_action('wp_ajax_nopriv_matchmaking_chart', 'mm_chart');
function mm_chart(){
    if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], 'mm_nonce')) {
        wp_send_json(array('error'=>'invalid_nonce'), 403);
    }
    $dob = sanitize_text_field(wp_unslash($_POST['dob'] ?? ''));
    $tob = sanitize_text_field(wp_unslash($_POST['tob'] ?? ''));
    $lat = sanitize_text_field(wp_unslash($_POST['lat'] ?? '28.033709'));
    $lon = sanitize_text_field(wp_unslash($_POST['lon'] ?? '79.120544'));
    $tz  = sanitize_text_field(wp_unslash($_POST['tz'] ?? '5.5'));
    $div = sanitize_text_field(wp_unslash($_POST['div'] ?? 'D1'));
    $style = sanitize_text_field(wp_unslash($_POST['style'] ?? 'north'));
    $color = sanitize_text_field(wp_unslash($_POST['color'] ?? '000000'));
    $lang = sanitize_text_field(wp_unslash($_POST['lang'] ?? 'hi'));

    if (!$dob || !$tob) { wp_send_json(array('error'=>'missing_fields'), 400); }

    // Ensure date is DD/MM/YYYY (accept both formats)
    if (strpos($dob,'-')!==false) { $parts = explode('-', $dob); if (count($parts)===3) { $dob = $parts[2].'/'.$parts[1].'/'.$parts[0]; } }

    $payload = array(
        'dob'=>$dob,'tob'=>$tob,'lat'=>$lat,'lon'=>$lon,'tz'=>$tz,'div'=>$div,'style'=>$style,'color'=>$color,'lang'=>$lang,'api_key'=>'6bff3246-afb9-5027-92c1-f2c6f1c182f5'
    );
    $url = 'https://api.vedicastroapi.com/v3-json/horoscope/chart-image';
    $query = add_query_arg(array_map('strval',$payload), $url);
    $resp = wp_remote_get($query, array('timeout'=>25));
    if (!is_wp_error($resp) && wp_remote_retrieve_response_code($resp)===200) {
        $svg = wp_remote_retrieve_body($resp);
        wp_send_json(array('svg'=>$svg));
    }
    // fallback POST form-urlencoded
    $resp2 = wp_remote_post($url, array(
        'timeout'=>25,
        'headers'=> array('Content-Type'=>'application/x-www-form-urlencoded'),
        'body'=> http_build_query($payload)
    ));
    if (!is_wp_error($resp2) && wp_remote_retrieve_response_code($resp2)===200) {
        $svg2 = wp_remote_retrieve_body($resp2);
        wp_send_json(array('svg'=>$svg2));
    }
    $err = is_wp_error($resp) ? $resp->get_error_message() : wp_remote_retrieve_body($resp);
    wp_send_json(array('error'=>'chart_error','detail'=>$err), 502);
}


