// Use vanilla JavaScript to avoid jQuery conflicts
document.addEventListener('DOMContentLoaded', function() {
    console.log('Astrology plugin script loaded'); // Debug log
    
    // Set today's date
    function setToday() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        document.getElementById('astrology-date').value = dd + '/' + mm + '/' + yyyy;
    }

    function setHoroscopeToday() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        document.getElementById('astrology-horoscope-date').value = dd + '/' + mm + '/' + yyyy;
    }

    // Set today's date on page load
    setToday();
    setHoroscopeToday();

    // Today button handlers
    document.getElementById('astrology-today-btn').addEventListener('click', setToday);
    document.getElementById('astrology-horoscope-today-btn').addEventListener('click', setHoroscopeToday);
    
    // Test city search button
    document.getElementById('astrology-test-city').addEventListener('click', function() {
        var query = document.getElementById('astrology-city').value;
        if (query.length < 2) {
            alert('Please enter at least 2 characters');
            return;
        }
        console.log('Manual city search test for:', query);
        searchCities(query);
    });

    // City search functionality
    var citySearchTimeout;
    document.getElementById('astrology-city').addEventListener('input', function() {
        var query = this.value;
        console.log('City input changed:', query); // Debug log
        
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

    function searchCities(query) {
        console.log('Making city search request...');
        
        var formData = new FormData();
        formData.append('action', 'astrology_geocode');
        formData.append('nonce', astrology_ajax.nonce);
        formData.append('q', query);
        formData.append('limit', '8');
        formData.append('countrycodes', 'in');
        
        fetch(astrology_ajax.ajax_url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('City search response:', data); // Debug log
            if (data.success && data.data.length > 0) {
                // Auto-select first result
                var firstResult = data.data[0];
                document.getElementById('astrology-lat').value = firstResult.lat;
                document.getElementById('astrology-lon').value = firstResult.lon;
                document.getElementById('astrology-city').value = firstResult.display_name;
                document.getElementById('astrology-coords-display').textContent = firstResult.lat + ', ' + firstResult.lon;
                
                console.log('Coordinates set:', firstResult.lat, firstResult.lon); // Debug log
                alert('City found! Coordinates: ' + firstResult.lat + ', ' + firstResult.lon);
            } else {
                console.log('No cities found for:', query);
                alert('No cities found for: ' + query);
            }
        })
        .catch(error => {
            console.log('City search error:', error);
            alert('City search failed: ' + error.message);
        });
    }

    // Panchang form submission
    document.getElementById('astrology-panchang-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        var btn = document.getElementById('astrology-panchang-btn');
        var errorDiv = document.getElementById('astrology-panchang-error');
        var resultDiv = document.getElementById('astrology-panchang-result');
        
        btn.innerHTML = '<span class="astrology-loading"></span> पंचांग मिळवत आहे...';
        btn.disabled = true;
        errorDiv.classList.add('astrology-hidden');
        resultDiv.classList.add('astrology-hidden');

        // AJAX call to WordPress
        var formData = new FormData();
        formData.append('action', 'astrology_panchang');
        formData.append('nonce', astrology_ajax.nonce);
        formData.append('date', document.getElementById('astrology-date').value);
        formData.append('lat', document.getElementById('astrology-lat').value);
        formData.append('lon', document.getElementById('astrology-lon').value);
        formData.append('tz', document.getElementById('astrology-tz').value);
        formData.append('lang', document.getElementById('astrology-lang').value);
        
        fetch(astrology_ajax.ajax_url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
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

    // Horoscope form submission
    document.getElementById('astrology-horoscope-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        var btn = document.getElementById('astrology-horoscope-btn');
        var errorDiv = document.getElementById('astrology-horoscope-error');
        var resultDiv = document.getElementById('astrology-horoscope-result');
        
        btn.innerHTML = '<span class="astrology-loading"></span> राशिफल मिळवत आहे...';
        btn.disabled = true;
        errorDiv.classList.add('astrology-hidden');
        resultDiv.classList.add('astrology-hidden');

        // AJAX call to WordPress
        var formData = new FormData();
        formData.append('action', 'astrology_horoscope');
        formData.append('nonce', astrology_ajax.nonce);
        formData.append('date', document.getElementById('astrology-horoscope-date').value);
        formData.append('zodiac', document.getElementById('astrology-zodiac').value);
        
        fetch(astrology_ajax.ajax_url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showHoroscopeResult(data.data);
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

    function showPanchangResult(data) {
        var resultDiv = document.getElementById('astrology-panchang-result');
        console.log('Panchang API Response:', data); // Debug log
        
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
        
        // Add more fields from your API response
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
        var html = 
            '<div class="astrology-result-card astrology-horoscope-card">' +
                '<h3>आजचे भविष्य</h3>' +
                '<div class="astrology-result-row">' +
                    '<span class="astrology-result-label">एकूण गुण</span>' +
                    '<span class="astrology-result-value">' + (data.total_score || 'N/A') + '/100</span>' +
                '</div>' +
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
        
        // Life areas section
        if (data.health || data.career || data.finances || data.relationship || data.family || data.friends || data.travel) {
            html += '<div class="astrology-result-card astrology-horoscope-card">' +
                '<h3>जीवनाचे क्षेत्र</h3>';
            
            if (data.health) {
                html += '<div class="astrology-result-row">' +
                    '<span class="astrology-result-label">आरोग्य</span>' +
                    '<span class="astrology-result-value">' + data.health + '/100</span>' +
                '</div>';
            }
            if (data.career) {
                html += '<div class="astrology-result-row">' +
                    '<span class="astrology-result-label">करिअर</span>' +
                    '<span class="astrology-result-value">' + data.career + '/100</span>' +
                '</div>';
            }
            if (data.finances) {
                html += '<div class="astrology-result-row">' +
                    '<span class="astrology-result-label">पैसा</span>' +
                    '<span class="astrology-result-value">' + data.finances + '/100</span>' +
                '</div>';
            }
            if (data.relationship) {
                html += '<div class="astrology-result-row">' +
                    '<span class="astrology-result-label">प्रेम संबंध</span>' +
                    '<span class="astrology-result-value">' + data.relationship + '/100</span>' +
                '</div>';
            }
            if (data.family) {
                html += '<div class="astrology-result-row">' +
                    '<span class="astrology-result-label">कुटुंब</span>' +
                    '<span class="astrology-result-value">' + data.family + '/100</span>' +
                '</div>';
            }
            if (data.friends) {
                html += '<div class="astrology-result-row">' +
                    '<span class="astrology-result-label">मित्र</span>' +
                    '<span class="astrology-result-value">' + data.friends + '/100</span>' +
                '</div>';
            }
            if (data.travel) {
                html += '<div class="astrology-result-row">' +
                    '<span class="astrology-result-label">प्रवास</span>' +
                    '<span class="astrology-result-value">' + data.travel + '/100</span>' +
                '</div>';
            }
            html += '</div>';
        }
        
        // Prediction text
        if (data.bot_response) {
            html += '<div class="astrology-prediction-box">' +
                '<h3>आजचे भविष्यवाणी</h3>' +
                '<p class="astrology-prediction-text">' + data.bot_response + '</p>' +
            '</div>';
        }
        
        resultDiv.innerHTML = html;
        resultDiv.classList.remove('astrology-hidden');
    }
});
