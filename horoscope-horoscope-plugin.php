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

if (!defined('ASTROLOGY_SERVICES_API_KEY')) {
    define('ASTROLOGY_SERVICES_API_KEY', '8cd7eb94-8f04-5d0a-b06e-f102f0dfa053');
}
if (!defined('ASTROLOGY_SERVICES_AJAX_ACTION')) {
    define('ASTROLOGY_SERVICES_AJAX_ACTION', 'astrology_services_proxy');
}
if (!defined('ASTROLOGY_SERVICES_NONCE_ACTION')) {
    define('ASTROLOGY_SERVICES_NONCE_ACTION', 'astrology_services_nonce');
}

$GLOBALS['astrology_services_should_enqueue'] = false;

add_shortcode('astrology_services', function () {
    $GLOBALS['astrology_services_should_enqueue'] = true;
    
    // Force enqueue scripts if not already done
    if (!wp_style_is('astrology-services-inline-style', 'enqueued')) {
        astrology_services_enqueue_assets();
    }
    
    $config = [
        'ajaxUrl'      => admin_url('admin-ajax.php'),
        'nonce'        => wp_create_nonce(ASTROLOGY_SERVICES_NONCE_ACTION),
        'action'       => ASTROLOGY_SERVICES_AJAX_ACTION,
        'defaultLang'  => 'hi',
    ];

    ob_start();
    ?>
    <div class="astrology-services-container">
        <div class="astrology-services-widget" data-config="<?php echo esc_attr(wp_json_encode($config)); ?>"></div>
    </div>
    <?php
    return ob_get_clean();
});

// Function to enqueue assets
if (!function_exists('astrology_services_enqueue_assets')) {
    function astrology_services_enqueue_assets() {
        $css = <<<CSS
.astrology-services-container{max-width:1100px;margin:40px auto;padding:0 16px;font-family:'Noto Sans Devanagari','Inter',sans-serif;color:#7a3417;}
.horoscope-card{background:#fff8f1;border-radius:28px;padding:28px;box-shadow:0 30px 60px rgba(245,158,11,.15);border:1px solid #fcd7b6;}
.horoscope-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px;}
.horoscope-form label{display:block;font-weight:600;margin-bottom:6px;color:#7a3417;}
.horoscope-input,.horoscope-select{width:100%;padding:10px 14px;border-radius:10px;border:1px solid #f5b98f;background:#fff;}
.horoscope-submit{grid-column:1/-1;text-align:center;}
.horoscope-submit button{background:#ea580c;color:#fff;border:none;padding:12px 48px;border-radius:999px;font-weight:700;cursor:pointer;}
.horoscope-tabs{display:flex;gap:8px;overflow-x:auto;padding-bottom:12px;margin-bottom:16px;}
.horoscope-tabs button{flex:0 0 auto;padding:10px 18px;border-radius:999px;border:1px solid transparent;background:#fff;color:#7a3417;font-weight:600;white-space:nowrap;cursor:pointer;}
.horoscope-tabs button.active{background:#ffedd5;border-color:#f97316;}
.horoscope-section{display:none;margin-bottom:28px;}
.horoscope-section.active{display:block;}
.horoscope-table{width:100%;border-collapse:collapse;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 15px 30px rgba(0,0,0,.07);}
.horoscope-table th{background:#ffedd5;text-align:left;padding:10px 12px;font-weight:600;color:#7a3417;}
.horoscope-table td{padding:8px 12px;border-top:1px solid #fde6d0;font-size:14px;}
.horoscope-card-block{background:#fff;border-radius:20px;padding:18px;border:1px solid #fde6d0;box-shadow:0 10px 25px rgba(0,0,0,.06);margin-bottom:18px;}
.horoscope-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;}
.horoscope-grid .chart-card{background:#fff;border-radius:18px;padding:12px;border:1px solid #fed7aa;text-align:center;}
.horoscope-loading,.horoscope-error{text-align:center;font-weight:600;padding:14px;}
.horoscope-loading{color:#c2410c;}
.horoscope-error{color:#b91c1c;}
.horoscope-remedy-list{list-style:disc;margin-left:20px;}
.horoscope-flex{display:flex;flex-direction:column;gap:16px;}
.horoscope-autocomplete{position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #f5b98f;border-radius:10px;max-height:200px;overflow-y:auto;z-index:1000;box-shadow:0 10px 25px rgba(0,0,0,.15);margin-top:4px;}
.horoscope-suggestion{padding:10px 14px;cursor:pointer;border-bottom:1px solid #fde6d0;}
.horoscope-suggestion:hover{background:#ffedd5;}
.horoscope-suggestion:last-child{border-bottom:none;}
@media(max-width:640px){
  .horoscope-form{grid-template-columns:1fr;}
  .horoscope-tabs{scrollbar-width:none;}
}
CSS;

        wp_register_style('astrology-services-inline-style', false);
        wp_enqueue_style('astrology-services-inline-style');
        wp_add_inline_style('astrology-services-inline-style', $css);
        
        // Get the JS from the main enqueue function
        astrology_services_enqueue_js();
    }
}

if (!function_exists('astrology_services_enqueue_js')) {
    function astrology_services_enqueue_js() {
        $js = <<<'EOT'
(function(){
  const translations = {
    hi:{dateLabel:"जन्म तिथि",timeLabel:"जन्म समय",placeLabel:"शहर खोजें",langLabel:"भाषा",reportBtn:"रिपोर्ट प्राप्त करें",loading:"लोड हो रहा है...",cityPlaceholder:"शहर का नाम टाइप करें...",tabs:["ग्रह तालिका","लग्न रिपोर्ट","अष्टकवर्ग","भिन्नाष्टकवर्ग","भावों में ग्रह","ग्रह रिपोर्ट","व्यक्तिगत विशेषताएँ","AI भविष्यवाणी","ग्रह दृष्टियाँ","सभी चार्ट","वर्तमान साढ़ेसाती","KP ग्रह व भाव"],kpPlanetHeading:"KP ग्रह",kpHouseHeading:"KP भाव"},
    en:{dateLabel:"Birth Date",timeLabel:"Birth Time",placeLabel:"Search City",langLabel:"Language",reportBtn:"Get Report",loading:"Loading...",cityPlaceholder:"Type city name...",tabs:["Planet Table","Ascendant","Ashtakvarga","Bhinnashtakvarga","Planets & Houses","Planet Report","Personal Traits","AI Prediction","Planetary Aspects","All Charts","Current Sade Sati","KP Planets & Houses"],kpPlanetHeading:"KP Planets",kpHouseHeading:"KP Houses"},
    mr:{dateLabel:"जन्मतारीख",timeLabel:"जन्मवेळ",placeLabel:"शहर शोधा",langLabel:"भाषा",reportBtn:"रिपोर्ट मिळवा",loading:"माहिती लोड होते आहे...",cityPlaceholder:"शहराचे नाव टाइप करा...",tabs:["ग्रह सारणी","लग्न अहवाल","अष्टकवर्ग","भिन्नाष्टकवर्ग","भावांतील ग्रह","ग्रह अहवाल","वैयक्तिक गुण","AI भाकीत","ग्रह दृष्ट्या","सर्व चार्ट","सध्याचे साडेसाती","KP ग्रह व भाव"],kpPlanetHeading:"KP ग्रह",kpHouseHeading:"KP भाव"}
  };
  const planetsList = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Rahu","Ketu"];
  const API_KEY = "8cd7eb94-8f04-5d0a-b06e-f102f0dfa053";
  const BASE_URL = "https://api.vedicastroapi.com/v3-json";
  const DIRECT_ROUTES = {
    "planet-details": "/horoscope/planet-details",
    "divisional": "/horoscope/divisional-charts",
    "chart-image": "/horoscope/chart-image",
    "ascendant-report": "/horoscope/ascendant-report",
    "ashtakvarga": "/horoscope/ashtakvarga",
    "ashtakvarga-chart": "/horoscope/ashtakvarga-chart-image",
    "bhinnashtakvarga": "/horoscope/binnashtakvarga",
    "planets-in-houses": "/horoscope/planets-in-houses",
    "planetary-aspects": "/horoscope/planetary-aspects",
    "planet-report": "/horoscope/planet-report",
    "personal-characteristics": "/horoscope/personal-characteristics",
    "ai-prediction": "/horoscope/ai-12-month-prediction",
    "current-sade-sati": "/extended-horoscope/current-sade-sati",
    "kp-planets": "/extended-horoscope/kp-planets",
    "kp-houses": "/extended-horoscope/kp-houses"
  };
  class AstrologyServicesWidget{
    constructor(root,config){
      this.root=root;
      this.config=config;
      this.tabs=["planet","ascendant","ashtak","bhinn","houses","planet-report","personal","ai","aspects","charts","sadesati","kp"];
      this.chartDivs=["D1","D3","D3-s","D7","D9","D10","D10-R","D12","D16","D20","D24","D24-R","D30"];
      this.state={lang:config.defaultLang||"hi",tab:0,form:{dob:"",tob:"",city:"",lat:"28.6139",lon:"77.2090"},data:{},loading:false,error:"",citySuggestions:[],showSuggestions:false};
      this.render();this.attachEvents();
    }
    t(key){return (translations[this.state.lang]||translations.hi)[key]||key;}
    render(){
      const t=this.t.bind(this);
      this.root.innerHTML=`
        <div class="horoscope-card">
          <div class="horoscope-form">
            ${this.field('dob',t('dateLabel'),'date')}
            ${this.field('tob',t('timeLabel'),'time')}
            <div style="position:relative;">
              <label>${t('placeLabel')}</label>
              <input type="text" class="horoscope-input" data-field="city" data-autocomplete placeholder="${t('cityPlaceholder')}" value="${this.state.form.city||''}" autocomplete="off">
              ${this.state.showSuggestions&&this.state.citySuggestions.length>0?`<div class="horoscope-autocomplete">${this.state.citySuggestions.map((item,idx)=>`<div class="horoscope-suggestion" data-index="${idx}">${item.label}</div>`).join('')}</div>`:''}
            </div>
            <div>
              <label>${t('langLabel')}</label>
              <select class="horoscope-select" data-field="lang">
                <option value="hi"${this.state.lang==='hi'?' selected':''}>हिंदी</option>
                <option value="mr"${this.state.lang==='mr'?' selected':''}>मराठी</option>
                <option value="en"${this.state.lang==='en'?' selected':''}>English</option>
              </select>
            </div>
            <div class="horoscope-submit">
              <button type="button" data-action="submit">${t('reportBtn')}</button>
            </div>
          </div>
          <div class="horoscope-tabs">
            ${translations[this.state.lang].tabs.map((label,idx)=>`<button data-tab="${idx}" class="${this.state.tab===idx?'active':''}">${label}</button>`).join('')}
          </div>
          ${this.state.loading?`<div class="horoscope-loading">${t('loading')}</div>`:''}
          ${this.state.error?`<div class="horoscope-error">${this.state.error}</div>`:''}
          ${this.tabs.map((tab,idx)=>`<section class="horoscope-section ${idx===this.state.tab?'active':''}" data-section="${tab}">${this.renderSection(tab)}</section>`).join('')}
        </div>`;
    }
    field(key,label,type){return `<div><label>${label}</label><input type="${type}" class="horoscope-input" data-field="${key}" value="${this.state.form[key]||''}"></div>`;}
    renderSection(tab){
      const data=this.state.data;
      switch(tab){
        case'planet':return data.planets?`${this.renderChart(data.chart||'')}${this.renderPlanetTable(data.planets)}${data.divisional?this.renderDivisionalTable(data.divisional):''}`:this.placeholder();
        case'ascendant':return data.ascendant?`<div class="horoscope-card-block">${data.ascendant}</div>`:this.placeholder();
        case'ashtak':return data.ashtak?`${this.renderChart(data.ashtakSvg||'')}${this.renderAshtakTable(data.ashtak)}`:this.placeholder();
        case'bhinn':return data.bhinn?this.renderBhinn(data.bhinn):this.placeholder();
        case'houses':return data.houses?this.renderHouses(data.houses):this.placeholder();
        case'planet-report':return data.planetReport?data.planetReport:this.placeholder();
        case'personal':return data.personal?data.personal:this.placeholder();
        case'ai':return data.ai?data.ai:this.placeholder();
        case'aspects':return data.aspects?data.aspects:this.placeholder();
        case'charts':return data.charts?data.charts:this.placeholder();
        case'sadesati':return data.sadesati?data.sadesati:this.placeholder();
        case'kp':return data.kp?data.kp:this.placeholder();
        default:return '';
      }
    }
    placeholder(){return `<div class="horoscope-loading">${this.t('loading')}</div>`;}
    renderChart(svg){return `<div class="horoscope-card-block">${svg||''}</div>`;}
    renderPlanetTable(data){
      const rows=Object.values(data||{})
        .filter(p=>p && (p.full_name||p.name))
        .map(p=>`<tr><td>${p.full_name||p.name}</td><td>${p.zodiac||''}</td><td>${p.house||''}</td><td>${p.nakshatra||''}</td></tr>`)
        .join('');
      return `<table class="horoscope-table"><thead><tr><th>Planet</th><th>Zodiac</th><th>House</th><th>Nakshatra</th></tr></thead><tbody>${rows}</tbody></table>`;
    }
    renderDivisionalTable(data){
      const rows=Object.values(data||{})
        .filter(p=>p && (p.full_name||p.name))
        .map(p=>`<tr><td>${p.full_name||p.name}</td><td>${p.divisional||''}</td><td>${p.zodiac||''}</td><td>${p.house||''}</td><td>${p.retro?'R':''}</td></tr>`)
        .join('');
      return `<table class="horoscope-table"><thead><tr><th>Planet</th><th>Chart</th><th>Zodiac</th><th>House</th><th>Retro</th></tr></thead><tbody>${rows}</tbody></table>`;
    }
    renderAshtakTable(data){
      if(!data.ashtakvarga_order)return '';
      const head=Array.from({length:12}).map((_,i)=>`<th>${i+1}</th>`).join('');
      const orders=(data.ashtakvarga_order||[]).filter(Boolean);
      const rows=orders.map((planet,idx)=>`<tr><td>${planet}</td>${(data.ashtakvarga_points[idx]||[]).map(val=>`<td>${val}</td>`).join('')}</tr>`).join('');
      return `<table class="horoscope-table"><thead><tr><th>Planet</th>${head}</tr></thead><tbody>${rows}</tbody></table>`;
    }
    renderBhinn(data){
      const head=Array.from({length:12}).map((_,i)=>`<th>${i+1}</th>`).join('');
      const rows=Object.entries(data||{})
        .filter(([planet])=>planet && planet!=='undefined')
        .map(([planet,vals])=>`<tr><td>${planet}</td>${(vals||[]).map(v=>`<td>${v}</td>`).join('')}</tr>`)
        .join('');
      return `<table class="horoscope-table"><thead><tr><th>Planet</th>${head}</tr></thead><tbody>${rows}</tbody></table>`;
    }
    renderHouses(data){
      const rows=Object.values(data||{}).map(row=>`<tr><td>${row.house}</td><td>${row.zodiac}</td><td>${(row.planets||[]).join(', ')||'-'}</td><td>${row.signification||''}</td></tr>`).join('');
      return `<table class="horoscope-table"><thead><tr><th>House</th><th>Zodiac</th><th>Planets</th><th>Meaning</th></tr></thead><tbody>${rows}</tbody></table>`;
    }
    attachEvents(){
      this.root.addEventListener('input',e=>{
        const target=e.target;
        if(!target.matches('[data-field]'))return;
        const key=target.getAttribute('data-field');
        if(key==='lang'){this.state.lang=target.value;this.render();this.attachEvents();return;}
        if(key==='city'&&target.hasAttribute('data-autocomplete')){
          this.state.form.city=target.value;
          if(target.value.length>=2){
            this.searchCity(target.value);
          }else{
            this.state.showSuggestions=false;
            this.render();this.attachEvents();
          }
          return;
        }
        this.state.form[key]=target.value;
      });
      this.root.addEventListener('click',e=>{
        const tab=e.target.closest('[data-tab]');
        if(tab){this.state.tab=Number(tab.dataset.tab);this.render();this.attachEvents();this.fetchForActiveTab();}
        if(e.target.closest('[data-action="submit"]')){this.handleSubmit();}
        const suggestion=e.target.closest('.horoscope-suggestion');
        if(suggestion){
          const idx=Number(suggestion.getAttribute('data-index'));
          const item=this.state.citySuggestions[idx];
          if(item){
            this.state.form.city=item.label;
            this.state.form.lat=item.lat;
            this.state.form.lon=item.lon;
            this.state.showSuggestions=false;
            this.render();this.attachEvents();
          }
        }
      });
      document.addEventListener('click',e=>{
        if(!this.root.contains(e.target)){
          this.state.showSuggestions=false;
          this.render();this.attachEvents();
        }
      });
    }
    async searchCity(query){
      try{
        const url=new URL(this.config.ajaxUrl);
        url.searchParams.append('action','astrology_services_geocode');
        url.searchParams.append('nonce',this.config.nonce);
        url.searchParams.append('q',query);
        url.searchParams.append('limit','8');
        const res=await fetch(url);
        if(!res.ok)return;
        const json=await res.json();
        if(json.items){
          this.state.citySuggestions=json.items;
          this.state.showSuggestions=true;
          this.render();this.attachEvents();
        }
      }catch(err){}
    }
    async handleSubmit(){
      if(!this.state.form.dob||!this.state.form.tob){
        this.state.error='Please enter DOB & TOB';
        this.render();this.attachEvents();
        return;
      }
      if(!this.state.form.lat||!this.state.form.lon){
        this.state.error='Please select a city';
        this.render();this.attachEvents();
        return;
      }
      this.state.error='';
      await this.fetchPlanetDetails();
    }
    toDdMmYyyy(dateStr){
      if(!dateStr) return "";
      if(dateStr.includes("/")) return dateStr;
      const parts=dateStr.split("-");
      if(parts.length!==3) return dateStr;
      return `${parts[2].padStart(2,"0")}/${parts[1].padStart(2,"0")}/${parts[0]}`;
    }
    buildParamsFor(action,payload){
      const base={
        dob:this.toDdMmYyyy(this.state.form.dob),
        tob:this.state.form.tob,
        lat:this.state.form.lat,
        lon:this.state.form.lon,
        tz:5.5,
        lang:this.state.lang
      };
      const extra=Object.assign({},payload);
      if(action==="planet-details"){
        extra.house_type="whole-sign";
        extra.zodiac_type="sidereal";
      }
      if(action==="ai-prediction" && !extra.start_date){
        const now=new Date();
        const dd=String(now.getDate()).padStart(2,"0");
        const mm=String(now.getMonth()+1).padStart(2,"0");
        const yyyy=now.getFullYear();
        extra.start_date=`${dd}/${mm}/${yyyy}`;
      }
      return Object.assign({},base,extra,{api_key:API_KEY});
    }
    async callApi(action,payload){
      const route=DIRECT_ROUTES[action];
      if(!route) throw new Error("Unknown API action: "+action);
      const isSvg=action==="chart-image"||action==="ashtakvarga-chart";
      const params=this.buildParamsFor(action,payload||{});
      const qs=new URLSearchParams();
      Object.entries(params).forEach(([k,v])=>{
        if(v!==undefined && v!==null && String(v)!==""){
          qs.append(k,String(v));
        }
      });
      const url=`${BASE_URL}${route}?${qs.toString()}`;
      const res=await fetch(url,{method:"GET"});
      if(!res.ok){
        const text=await res.text();
        throw new Error(`Network error ${res.status}: ${text.substring(0,120)}`);
      }
      if(isSvg){
        const svg=await res.text();
        return {svg};
      }
      const json=await res.json();
      if(!json || json.status!==200){
        throw new Error(json?.response||json?.error||json?.message||"API error");
      }
      return json;
    }
    async fetchPlanetDetails(){
      this.state.loading=true;this.render();this.attachEvents();
      try{
        const [planets,divisional,chart]=await Promise.all([
          this.callApi('planet-details',{}),
          this.callApi('divisional',{}),
          this.callApi('chart-image',{div:'D1',style:'north'})
        ]);
        this.state.data.planets=planets.response||planets;
        this.state.data.divisional=divisional.response||divisional;
        this.state.data.chart=chart.svg||'';
      }catch(err){
        this.state.error=err.message||'An error occurred';
        console.error('API Error:',err);
      }
      this.state.loading=false;this.render();this.attachEvents();
    }
    async fetchAscendant(){
      if(this.state.data.ascendant) return;
      try{
        const resp=await this.callApi('ascendant-report',{});
        this.state.data.ascendant=(resp.response||[]).map(r=>`<p>${r.general_prediction||''}</p>`).join('');
      }catch(err){
        this.state.error=err.message||'Unable to load Ascendant report';
        console.error('Ascendant error:',err);
      }
      this.render();this.attachEvents();
    }
    async fetchAshtak(){
      if(this.state.data.ashtak) return;
      try{
        const [table,chart]=await Promise.all([
          this.callApi('ashtakvarga',{}),
          this.callApi('ashtakvarga-chart',{planet:'Sun'})
        ]);
        this.state.data.ashtak=table.response||table;
        this.state.data.ashtakSvg=chart.svg||'';
      }catch(err){
        this.state.error=err.message||'Unable to load Ashtakvarga';
        console.error('Ashtakvarga error:',err);
      }
      this.render();this.attachEvents();
    }
    async fetchBhinn(){
      if(this.state.data.bhinn) return;
      try{
        const resp=await this.callApi('bhinnashtakvarga',{planet:'Sun'});
        this.state.data.bhinn=resp.response||resp;
      }catch(err){
        this.state.error=err.message||'Unable to load Bhinnashtakvarga';
        console.error('Bhinnashtakvarga error:',err);
      }
      this.render();this.attachEvents();
    }
    async fetchHouses(){
      if(this.state.data.houses) return;
      try{
        const resp=await this.callApi('planets-in-houses',{});
        this.state.data.houses=resp.response||resp;
      }catch(err){
        this.state.error=err.message||'Unable to load Planets in Houses';
        console.error('Houses error:',err);
      }
      this.render();this.attachEvents();
    }
    async fetchPlanetReport(){
      if(this.state.data.planetReport) return;
      try{
        const resp=await this.callApi('planet-report',{planet:'Sun'});
        const data=resp.response||{};
        const blocks=Object.entries(data).map(([key,val])=>`<div class="horoscope-card-block"><h4>${key}</h4><p>${val.description||''}</p></div>`).join('');
        this.state.data.planetReport=blocks;
      }catch(err){
        this.state.error=err.message||'Unable to load Planet Report';
        console.error('Planet report error:',err);
      }
      this.render();this.attachEvents();
    }
    async fetchPersonal(){
      if(this.state.data.personal) return;
      try{
        const resp=await this.callApi('personal-characteristics',{});
        const list=(resp.response||[]).map(item=>`<div class="horoscope-card-block"><h4>${item.title||''}</h4><p>${item.description||''}</p></div>`).join('');
        this.state.data.personal=list;
      }catch(err){
        this.state.error=err.message||'Unable to load Personal Characteristics';
        console.error('Personal characteristics error:',err);
      }
      this.render();this.attachEvents();
    }
    async fetchAI(){
      if(this.state.data.ai) return;
      try{
        const today=new Date();
        const start=`${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;
        const resp=await this.callApi('ai-prediction',{start_date:start});
        const rows=(resp.response||[]).map(item=>`<div class="horoscope-card-block"><h4>${item.month||''}</h4><p>${item.prediction||''}</p></div>`).join('');
        this.state.data.ai=rows;
      }catch(err){
        this.state.error=err.message||'Unable to load AI prediction';
        console.error('AI prediction error:',err);
      }
      this.render();this.attachEvents();
    }
    async fetchAspects(){
      if(this.state.data.aspects) return;
      try{
        const resp=await this.callApi('planetary-aspects',{aspect_response_type:'houses'});
        const list=Object.entries(resp.response||{}).map(([planet,details])=>{
          const rows=(details||[]).map(entry=>`<tr><td>${entry.aspecting_planet}</td><td>${entry.house}</td><td>${entry.influence}</td><td>${entry.details||''}</td></tr>`).join('');
          return `<div class="horoscope-card-block"><h4>${planet}</h4><table class="horoscope-table"><thead><tr><th>Aspector</th><th>House</th><th>Influence</th><th>Details</th></tr></thead><tbody>${rows}</tbody></table></div>`;
        }).join('');
        this.state.data.aspects=list;
      }catch(err){
        this.state.error=err.message||'Unable to load Planetary Aspects';
        console.error('Aspects error:',err);
      }
      this.render();this.attachEvents();
    }
    async fetchAllCharts(){
      if(this.state.data.charts) return;
      try{
        const cards=[];
        for(const div of this.chartDivs){
          const svgResp=await this.callApi('chart-image',{div,style:'north'});
          const svgContent=svgResp.svg||'';
          cards.push(`<div class="chart-card"><h4>${div}</h4>${svgContent}</div>`);
        }
        this.state.data.charts=`<div class="horoscope-grid">${cards.join('')}</div>`;
      }catch(err){
        this.state.error=err.message||'Unable to load charts';
        console.error('Charts error:',err);
      }
      this.render();this.attachEvents();
    }
    async fetchSadesati(){
      if(this.state.data.sadesati) return;
      try{
        const resp=await this.callApi('current-sade-sati',{});
        const data=resp.response||{};
        const remedies=Array.isArray(data.remedies)?`<ul class="horoscope-remedy-list">${data.remedies.map(r=>`<li>${r}</li>`).join('')}</ul>`:'';
        this.state.data.sadesati=`<div class="horoscope-card-block"><p><strong>Date:</strong> ${data.date_considered||'-'}</p><p><strong>Phase:</strong> ${data.shani_period_type||'-'}</p><p>${data.bot_response||''}</p><p>${data.description||''}</p>${remedies}</div>`;
      }catch(err){
        this.state.error=err.message||'Unable to load Sade Sati';
        console.error('Sade Sati error:',err);
      }
      this.render();this.attachEvents();
    }
    async fetchKP(){
      if(this.state.data.kp) return;
      try{
        const [planets,houses]=await Promise.all([this.callApi('kp-planets',{}),this.callApi('kp-houses',{})]);
        const planetRows=Object.values(planets.response||{}).map(p=>`<tr><td>${p.full_name||p.name}</td><td>${p.zodiac}</td><td>${p.house}</td><td>${p.sub_lord||'-'}</td></tr>`).join('');
        const houseRows=(houses.response||[]).map(h=>`<tr><td>${h.house}</td><td>${h.start_rasi} → ${h.end_rasi}</td><td>${(h.planets||[]).map(pl=>pl.full_name||pl.name).join(', ')||'-'}</td></tr>`).join('');
        this.state.data.kp=
          `<div class="horoscope-flex">
            <div>
              <h3>${this.t('kpPlanetHeading')}</h3>
              <table class="horoscope-table"><thead><tr><th>Planet</th><th>Zodiac</th><th>House</th><th>Sub-Lord</th></tr></thead><tbody>${planetRows}</tbody></table>
            </div>
            <div>
              <h3>${this.t('kpHouseHeading')}</h3>
              <table class="horoscope-table"><thead><tr><th>House</th><th>Zodiac Range</th><th>Occupants</th></tr></thead><tbody>${houseRows}</tbody></table>
            </div>
          </div>`;
      }catch(err){
        this.state.error=err.message||'Unable to load KP data';
        console.error('KP error:',err);
      }
      this.render();this.attachEvents();
    }
    fetchForActiveTab(){
      const actions={
        'planet':()=>this.fetchPlanetDetails(),
        'ascendant':()=>this.fetchAscendant(),
        'ashtak':()=>this.fetchAshtak(),
        'bhinn':()=>this.fetchBhinn(),
        'houses':()=>this.fetchHouses(),
        'planet-report':()=>this.fetchPlanetReport(),
        'personal':()=>this.fetchPersonal(),
        'ai':()=>this.fetchAI(),
        'aspects':()=>this.fetchAspects(),
        'charts':()=>this.fetchAllCharts(),
        'sadesati':()=>this.fetchSadesati(),
        'kp':()=>this.fetchKP()
      };
      const key=this.tabs[this.state.tab];
      if(actions[key]) actions[key]();
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('.astrology-services-widget').forEach(root=>{
      const config=JSON.parse(root.getAttribute('data-config')||'{}');
      new AstrologyServicesWidget(root,config);
    });
  });
})();
EOT;
        
        wp_register_script('astrology-services-inline-script', '', [], '1.0.0', true);
        wp_enqueue_script('astrology-services-inline-script');
        wp_add_inline_script('astrology-services-inline-script', $js);
    }
}

add_action('wp_enqueue_scripts', function () {
    global $post;
    
    // Check if shortcode exists in current post
    $should_enqueue = false;
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'astrology_services')) {
        $should_enqueue = true;
    }
    
    // Also check if flag was set (for widgets, etc.)
    if (!empty($GLOBALS['astrology_services_should_enqueue'])) {
        $should_enqueue = true;
    }
    
    if ($should_enqueue) {
        astrology_services_enqueue_assets();
    }
});

// Fallback: Enqueue in footer if shortcode was used but scripts weren't enqueued
add_action('wp_footer', function() {
    if (!empty($GLOBALS['astrology_services_should_enqueue'])) {
        // Double-check scripts are enqueued
        if (!wp_script_is('astrology-services-inline-script', 'enqueued')) {
            $css = <<<CSS
.astrology-services-container{max-width:1100px;margin:40px auto;padding:0 16px;font-family:'Noto Sans Devanagari','Inter',sans-serif;color:#7a3417;}
.horoscope-card{background:#fff8f1;border-radius:28px;padding:28px;box-shadow:0 30px 60px rgba(245,158,11,.15);border:1px solid #fcd7b6;}
.horoscope-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px;}
.horoscope-form label{display:block;font-weight:600;margin-bottom:6px;color:#7a3417;}
.horoscope-input,.horoscope-select{width:100%;padding:10px 14px;border-radius:10px;border:1px solid #f5b98f;background:#fff;}
.horoscope-submit{grid-column:1/-1;text-align:center;}
.horoscope-submit button{background:#ea580c;color:#fff;border:none;padding:12px 48px;border-radius:999px;font-weight:700;cursor:pointer;}
.horoscope-tabs{display:flex;gap:8px;overflow-x:auto;padding-bottom:12px;margin-bottom:16px;}
.horoscope-tabs button{flex:0 0 auto;padding:10px 18px;border-radius:999px;border:1px solid transparent;background:#fff;color:#7a3417;font-weight:600;white-space:nowrap;cursor:pointer;}
.horoscope-tabs button.active{background:#ffedd5;border-color:#f97316;}
.horoscope-section{display:none;margin-bottom:28px;}
.horoscope-section.active{display:block;}
.horoscope-table{width:100%;border-collapse:collapse;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 15px 30px rgba(0,0,0,.07);}
.horoscope-table th{background:#ffedd5;text-align:left;padding:10px 12px;font-weight:600;color:#7a3417;}
.horoscope-table td{padding:8px 12px;border-top:1px solid #fde6d0;font-size:14px;}
.horoscope-card-block{background:#fff;border-radius:20px;padding:18px;border:1px solid #fde6d0;box-shadow:0 10px 25px rgba(0,0,0,.06);margin-bottom:18px;}
.horoscope-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;}
.horoscope-grid .chart-card{background:#fff;border-radius:18px;padding:12px;border:1px solid #fed7aa;text-align:center;}
.horoscope-loading,.horoscope-error{text-align:center;font-weight:600;padding:14px;}
.horoscope-loading{color:#c2410c;}
.horoscope-error{color:#b91c1c;}
.horoscope-remedy-list{list-style:disc;margin-left:20px;}
.horoscope-flex{display:flex;flex-direction:column;gap:16px;}
@media(max-width:640px){
  .horoscope-form{grid-template-columns:1fr;}
  .horoscope-tabs{scrollbar-width:none;}
}
CSS;
            wp_add_inline_style('astrology-services-inline-style', $css);
        }
    }
}, 999);

// Geocode endpoint for city search
if (!function_exists('astrology_services_handle_geocode')) {
    add_action('wp_ajax_astrology_services_geocode', 'astrology_services_handle_geocode');
    add_action('wp_ajax_nopriv_astrology_services_geocode', 'astrology_services_handle_geocode');
    
    function astrology_services_handle_geocode() {
        $nonce = isset($_GET['nonce']) ? sanitize_text_field($_GET['nonce']) : '';
        if (!wp_verify_nonce($nonce, ASTROLOGY_SERVICES_NONCE_ACTION)) {
            wp_send_json_error(['message' => 'Security check failed.'], 403);
            return;
        }
        
        $query = isset($_GET['q']) ? sanitize_text_field($_GET['q']) : '';
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 8;
        
        if (empty($query)) {
            wp_send_json(['items' => []]);
            return;
        }
        
        $url = add_query_arg([
            'q' => $query,
            'format' => 'json',
            'limit' => $limit,
            'countrycodes' => 'in',
            'addressdetails' => 1
        ], 'https://nominatim.openstreetmap.org/search');
        
        $response = wp_remote_get($url, [
            'timeout' => 10,
            'headers' => [
                'User-Agent' => 'WordPress Astrology Services Plugin'
            ]
        ]);
        
        if (is_wp_error($response)) {
            wp_send_json(['items' => []]);
            return;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (!is_array($data)) {
            wp_send_json(['items' => []]);
            return;
        }
        
        $items = [];
        foreach ($data as $item) {
            if (isset($item['lat']) && isset($item['lon'])) {
                $items[] = [
                    'label' => $item['display_name'] ?? '',
                    'lat' => floatval($item['lat']),
                    'lon' => floatval($item['lon'])
                ];
            }
        }
        
        wp_send_json(['items' => $items]);
    }
}

if (!function_exists('astrology_services_handle_proxy')) {
    add_action('wp_ajax_' . ASTROLOGY_SERVICES_AJAX_ACTION, 'astrology_services_handle_proxy');
    add_action('wp_ajax_nopriv_' . ASTROLOGY_SERVICES_AJAX_ACTION, 'astrology_services_handle_proxy');
    
    function astrology_services_handle_proxy() {
    // Verify nonce
    $nonce = isset($_POST['nonce']) ? sanitize_text_field($_POST['nonce']) : '';
    if (!wp_verify_nonce($nonce, ASTROLOGY_SERVICES_NONCE_ACTION)) {
        wp_send_json_error(['message' => 'Security check failed. Please refresh the page.'], 403);
        return;
    }

    $sub_action = isset($_POST['sub_action']) ? sanitize_key($_POST['sub_action']) : '';
    if (empty($sub_action)) {
        wp_send_json_error(['message' => 'Missing sub_action parameter.'], 400);
        return;
    }
    
    $payload_raw = isset($_POST['payload']) ? $_POST['payload'] : '{}';
    $payload = json_decode(stripslashes($payload_raw), true);
    if (!is_array($payload)) {
        $payload = [];
    }

    $response = astrology_services_route_request($sub_action, $payload);
    if (is_wp_error($response)) {
        wp_send_json_error([
            'message' => $response->get_error_message(),
            'code' => $response->get_error_code()
        ], 400);
        return;
    }

    $body = wp_remote_retrieve_body($response['http']);
    if ($response['type'] === 'json') {
        $decoded = json_decode($body, true);
        if ($decoded === null) {
            wp_send_json_error(['message' => 'Malformed upstream response'], 502);
            return;
        }
        wp_send_json_success($decoded);
        return;
    }

    wp_send_json_success([
        'svg'   => $body,
    ]);
    }
}

if (!function_exists('astrology_services_route_request')) {
    function astrology_services_route_request($sub_action, $payload) {
    if (empty($sub_action)) {
        return new WP_Error('astrology_services_missing_action', 'Missing sub action.');
    }

    // Convert date format from YYYY-MM-DD to DD/MM/YYYY
    foreach (['dob', 'start_date'] as $date_field) {
        if (!empty($payload[$date_field])) {
            $date_value = $payload[$date_field];
            // Check if it's in YYYY-MM-DD format
            if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $date_value, $matches)) {
                $payload[$date_field] = sprintf('%02d/%02d/%04d', $matches[3], $matches[2], $matches[1]);
            }
        }
    }
    
    // Ensure required parameters are present (skip for certain actions)
    $skip_validation = in_array($sub_action, ['geocode']);
    if (!$skip_validation) {
        if (empty($payload['dob']) || trim($payload['dob']) === '') {
            return new WP_Error('astrology_services_missing_dob', 'Date of birth is required.');
        }
        if (empty($payload['tob']) || trim($payload['tob']) === '') {
            return new WP_Error('astrology_services_missing_tob', 'Time of birth is required.');
        }
        $lat = isset($payload['lat']) ? floatval($payload['lat']) : 0;
        $lon = isset($payload['lon']) ? floatval($payload['lon']) : 0;
        if ($lat == 0 || $lon == 0) {
            return new WP_Error('astrology_services_missing_coords', 'Latitude and longitude are required.');
        }
    }

    $routes = [
        'planet-details'          => ['https://api.vedicastroapi.com/v3-json/horoscope/planet-details', 'GET', 'json'],
        'divisional'              => ['https://api.vedicastroapi.com/v3-json/horoscope/divisional-charts', 'GET', 'json'],
        'chart-image'             => ['https://api.vedicastroapi.com/v3-json/horoscope/chart-image', 'GET', 'svg'],
        'ascendant-report'        => ['https://api.vedicastroapi.com/v3-json/horoscope/ascendant-report', 'GET', 'json'],
        'ashtakvarga'             => ['https://api.vedicastroapi.com/v3-json/horoscope/ashtakvarga', 'GET', 'json'],
        'ashtakvarga-chart'       => ['https://api.vedicastroapi.com/v3-json/horoscope/ashtakvarga-chart-image', 'GET', 'svg'],
        'bhinnashtakvarga'        => ['https://api.vedicastroapi.com/v3-json/horoscope/binnashtakvarga', 'GET', 'json'],
        'planets-in-houses'       => ['https://api.vedicastroapi.com/v3-json/horoscope/planets-in-houses', 'GET', 'json'],
        'planetary-aspects'       => ['https://api.vedicastroapi.com/v3-json/horoscope/planetary-aspects', 'GET', 'json'],
        'planet-report'           => ['https://api.vedicastroapi.com/v3-json/horoscope/planet-report', 'GET', 'json'],
        'personal-characteristics'=> ['https://api.vedicastroapi.com/v3-json/horoscope/personal-characteristics', 'GET', 'json'],
        'ai-prediction'           => ['https://api.vedicastroapi.com/v3-json/horoscope/ai-12-month-prediction', 'GET', 'json'],
        'current-sade-sati'       => ['https://api.vedicastroapi.com/v3-json/extended-horoscope/current-sade-sati', 'GET', 'json'],
        'kp-planets'              => ['https://api.vedicastroapi.com/v3-json/extended-horoscope/kp-planets', 'GET', 'json'],
        'kp-houses'               => ['https://api.vedicastroapi.com/v3-json/extended-horoscope/kp-houses', 'GET', 'json'],
    ];

    if (!isset($routes[$sub_action])) {
        return new WP_Error('astrology_services_invalid_action', 'Unknown sub action.');
    }

    [$url, $method, $type] = $routes[$sub_action];
    
    // Build parameters - ensure all required fields are included
    $params = [
        'api_key' => ASTROLOGY_SERVICES_API_KEY,
        'dob'     => isset($payload['dob']) ? sanitize_text_field($payload['dob']) : '',
        'tob'     => isset($payload['tob']) ? sanitize_text_field($payload['tob']) : '',
        'lat'     => isset($payload['lat']) ? floatval($payload['lat']) : 0,
        'lon'     => isset($payload['lon']) ? floatval($payload['lon']) : 0,
        'tz'      => isset($payload['tz']) ? floatval($payload['tz']) : 5.5,
        'lang'    => isset($payload['lang']) ? sanitize_text_field($payload['lang']) : 'hi',
    ];
    
    // Add any additional parameters from payload (like div, style, planet, etc.)
    foreach ($payload as $key => $value) {
        if (!in_array($key, ['dob', 'tob', 'lat', 'lon', 'tz', 'lang', 'api_key'])) {
            $params[$key] = sanitize_text_field($value);
        }
    }

    $args = ['timeout' => 30];
    if ($method === 'GET') {
        $url = add_query_arg(array_map('wp_unslash', $params), $url);
    } else {
        $args['body'] = $params;
    }

    $request = wp_remote_request($url, $args);
    if (is_wp_error($request)) {
        return $request;
    }

    return ['http' => $request, 'type' => $type];
    }
}


