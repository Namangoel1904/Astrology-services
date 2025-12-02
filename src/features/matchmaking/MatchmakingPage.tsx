'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CitySearch, { CityItem } from '@/components/ui/CitySearch';

interface DashakootData {
  dina: { boy_star: string; girl_star: string; dina: number; description: string; name: string; full_score: number };
  gana: { boy_gana: string; girl_gana: string; gana: number; description: string; name: string; full_score: number };
  mahendra: { boy_star: string; girl_star: string; mahendra: number; description: string; name: string; full_score: number };
  sthree: { boy_star: string; girl_star: string; sthree: number; description: string; name: string; full_score: number };
  yoni: { boy_yoni: string; girl_yoni: string; yoni: number; description: string; name: string; full_score: number };
  rasi: { boy_rasi: string; girl_rasi: string; rasi: number; description: string; name: string; full_score: number };
  rasiathi: { boy_lord: string; girl_lord: string; rasiathi: number; description: string; name: string; full_score: number };
  vasya: { boy_rasi: string; girl_rasi: string; vasya: number; description: string; name: string; full_score: number };
  rajju: { boy_rajju: string; girl_rajju: string; rajju: number; description: string; name: string; full_score: number };
  vedha: { boy_star: string; girl_star: string; vedha: number; description: string; name: string; full_score: number };
  score: number;
  bot_response: string;
}

interface PlanetaryDetails {
  [key: string]: {
    name: string;
    full_name: string;
    local_degree: number;
    global_degree: number;
    progress_in_percentage: number;
    rasi_no: number;
    zodiac: string;
    house: number;
    nakshatra: string;
    nakshatra_lord: string;
    nakshatra_pada: number;
    nakshatra_no: number;
    zodiac_lord: string;
    is_planet_set?: boolean;
    lord_status: string;
    basic_avastha?: string;
    is_combust?: boolean;
    retro?: boolean;
    speed_radians_per_day?: number;
    mean_values?: any;
    tithi_no?: string;
  };
}

interface AstroDetails {
  gana: string;
  yoni: string;
  vasya: string;
  nadi: string;
  varna: string;
  paya: string;
  tatva: string;
  birth_dasa: string;
  current_dasa: string;
  birth_dasa_time: string;
  current_dasa_time: string;
  lucky_gem: string[];
  lucky_num: number[];
  lucky_colors: string[];
  lucky_letters: string[];
  lucky_name_start: string[];
  rasi: string;
  nakshatra: string;
  nakshatra_pada: number;
  ascendant_sign: string;
}

interface MatchmakingResponse {
  status: number;
  response: {
    dina: any;
    gana: any;
    mahendra: any;
    sthree: any;
    yoni: any;
    rasi: any;
    rasiathi: any;
    vasya: any;
    rajju: any;
    vedha: any;
    score: number;
    bot_response: string;
    boy_planetary_details: PlanetaryDetails;
    girl_planetary_details: PlanetaryDetails;
    boy_astro_details: AstroDetails;
    girl_astro_details: AstroDetails;
  };
}

export default function MatchmakingPage() {
  const [formData, setFormData] = useState({
    boy_dob: '',
    boy_tob: '',
    boy_tz: 5.5,
    boy_lat: '28.033709',
    boy_lon: '79.120544',
    girl_dob: '',
    girl_tob: '',
    girl_tz: 5.5,
    girl_lat: '28.679079',
    girl_lon: '77.069710',
    lang: 'hi'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchmakingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [boyChartSvg, setBoyChartSvg] = useState<string | null>(null);
  const [girlChartSvg, setGirlChartSvg] = useState<string | null>(null);
  const [chartLoading, setChartLoading] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCitySelect = (person: 'boy' | 'girl') => (item: CityItem) => {
    setFormData(prev => ({
      ...prev,
      [`${person}_lat`]: item.lat,
      [`${person}_lon`]: item.lon,
      [`${person}_city`]: item.name
    }));
  };

  const fetchChartImage = async (dob: string, tob: string, lat: string, lon: string) => {
    try {
      const chartResponse = await fetch('/api/chart-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dob,
          tob,
          lat,
          lon,
          tz: formData.boy_tz,
          lang: formData.lang
        }),
      });

      if (chartResponse.ok) {
        const chartData = await chartResponse.json();
        // Return the SVG content directly
        return chartData.svg || chartData;
      }
      return null;
    } catch (err) {
      console.error('Error fetching chart:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setBoyChartSvg(null);
    setGirlChartSvg(null);

    try {
      console.log('Form data:', formData);
      
      const response = await fetch('/api/matchmaking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch matchmaking data');
      }

      const data = await response.json();
      console.log('Matchmaking data:', data);
      setResult(data);

      // Fetch chart images after getting matchmaking results
      setChartLoading(true);
      const [boyChart, girlChart] = await Promise.all([
        fetchChartImage(formData.boy_dob, formData.boy_tob, formData.boy_lat, formData.boy_lon),
        fetchChartImage(formData.girl_dob, formData.girl_tob, formData.girl_lat, formData.girl_lon)
      ]);
      
      setBoyChartSvg(boyChart);
      setGirlChartSvg(girlChart);
      setChartLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 7) return 'bg-green-100';
    if (score >= 5) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getPlanetInHouse = (planetaryDetails: PlanetaryDetails, houseNumber: number) => {
    const planetsInHouse = Object.entries(planetaryDetails)
      .filter(([_, planet]) => planet.house === houseNumber)
      .map(([key, planet]) => planet.name);
    
    return planetsInHouse.length > 0 ? planetsInHouse.join(', ') : '-';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">
            🔮 दशकूट मिलान
          </h1>
          <p className="text-lg text-gray-700">
            वर-वधू की जन्मकुंडली के आधार पर विवाह अनुकूलता का विश्लेषण
          </p>
        </div>

        {/* Form */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-orange-700 mb-6">
              जन्म विवरण दर्ज करें
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Boy's Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-200 pb-2">
                    👨 वर का विवरण
                  </h3>
                  
                  <div>
                    <Label htmlFor="boy_dob">जन्म तिथि *</Label>
                    <Input
                      id="boy_dob"
                      type="date"
                      value={formData.boy_dob}
                      onChange={(e) => handleInputChange('boy_dob', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="boy_tob">जन्म समय *</Label>
                    <Input
                      id="boy_tob"
                      type="time"
                      value={formData.boy_tob}
                      onChange={(e) => handleInputChange('boy_tob', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="boy_tz">समय क्षेत्र</Label>
                    <Input
                      id="boy_tz"
                      type="number"
                      step="0.5"
                      value={formData.boy_tz}
                      onChange={(e) => handleInputChange('boy_tz', parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>जन्म स्थान *</Label>
                    <CitySearch 
                      placeholder="उदा. दिल्ली, मुंबई, पुणे" 
                      countrycodes="in" 
                      onSelect={handleCitySelect('boy')} 
                    />
                  </div>
                  {/* Hidden lat/lon inputs (auto-filled by city selection) */}
                  <input name="boy_lat" value={formData.boy_lat} hidden readOnly />
                  <input name="boy_lon" value={formData.boy_lon} hidden readOnly />
                </div>

                {/* Girl's Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-pink-700 border-b-2 border-pink-200 pb-2">
                    👩 वधू का विवरण
                  </h3>
                  
                  <div>
                    <Label htmlFor="girl_dob">जन्म तिथि *</Label>
                    <Input
                      id="girl_dob"
                      type="date"
                      value={formData.girl_dob}
                      onChange={(e) => handleInputChange('girl_dob', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="girl_tob">जन्म समय *</Label>
                    <Input
                      id="girl_tob"
                      type="time"
                      value={formData.girl_tob}
                      onChange={(e) => handleInputChange('girl_tob', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="girl_tz">समय क्षेत्र</Label>
                    <Input
                      id="girl_tz"
                      type="number"
                      step="0.5"
                      value={formData.girl_tz}
                      onChange={(e) => handleInputChange('girl_tz', parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>जन्म स्थान *</Label>
                    <CitySearch 
                      placeholder="उदा. दिल्ली, मुंबई, पुणे" 
                      countrycodes="in" 
                      onSelect={handleCitySelect('girl')} 
                    />
                  </div>
                  {/* Hidden lat/lon inputs (auto-filled by city selection) */}
                  <input name="girl_lat" value={formData.girl_lat} hidden readOnly />
                  <input name="girl_lon" value={formData.girl_lon} hidden readOnly />
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <Label htmlFor="lang">भाषा</Label>
                <Select
                  value={formData.lang}
                  onValueChange={(value) => handleInputChange('lang', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="भाषा चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="mr">मराठी</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  {loading ? 'मिलान हो रहा है...' : 'दशकूट मिलान करें'}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <div className="p-6">
              <p className="text-red-700 text-center">{error}</p>
            </div>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Overall Score */}
            <Card className="text-center">
              <div className="p-8">
                <h2 className="text-3xl font-bold text-orange-800 mb-4">
                  🎯 दशकूट मिलान परिणाम
                </h2>
                
                {/* Display both Dashakoot and Ashtakoot scores */}
                {(() => {
                  const dashakootScore = result.response.score;
                  const ashtakootEquivalent = (dashakootScore / 10) * 36;
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">दशकूट</p>
                          <div className={`inline-block px-6 py-3 rounded-full text-3xl font-bold ${getScoreBgColor(dashakootScore)} ${getScoreColor(dashakootScore)}`}>
                            {dashakootScore}/10
                          </div>
                        </div>
                        <div className="text-gray-400 text-2xl">⟷</div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">अष्टकूट समतुल्य</p>
                          <div className={`inline-block px-6 py-3 rounded-full text-3xl font-bold ${getScoreBgColor(dashakootScore)} ${getScoreColor(dashakootScore)}`}>
                            {ashtakootEquivalent.toFixed(1)}/36
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                
                <p className="text-lg text-gray-700 mt-6">
                  {result.response.bot_response}
                </p>
              </div>
            </Card>

            {/* Dashakoot Details */}
            <Card>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-orange-700 mb-6">
                  📊 दशकूट विवरण
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-orange-100 to-yellow-100">
                        <th className="px-4 py-3 text-left font-semibold text-orange-800 border border-orange-300">दशकूट नाम</th>
                        <th className="px-4 py-3 text-left font-semibold text-blue-700 border border-orange-300">वर</th>
                        <th className="px-4 py-3 text-left font-semibold text-pink-700 border border-orange-300">वधू</th>
                        <th className="px-4 py-3 text-center font-semibold text-orange-800 border border-orange-300">अंक</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 border border-orange-300">विवरण</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(result.response).filter(([key]) => 
                        !['score', 'bot_response', 'boy_planetary_details', 'girl_planetary_details', 'boy_astro_details', 'girl_astro_details'].includes(key)
                      ).map(([key, data]: [string, any]) => (
                        <tr key={key} className="hover:bg-orange-50 transition-colors">
                          <td className="px-4 py-3 border border-orange-200 font-semibold text-orange-800">{data.name}</td>
                          <td className="px-4 py-3 border border-orange-200 text-blue-700">{data.boy_star || data.boy_gana || data.boy_yoni || data.boy_rasi || data.boy_lord || data.boy_rajju}</td>
                          <td className="px-4 py-3 border border-orange-200 text-pink-700">{data.girl_star || data.girl_gana || data.girl_yoni || data.girl_rasi || data.girl_lord || data.girl_rajju}</td>
                          <td className="px-4 py-3 border border-orange-200 text-center">
                            <span className={`font-bold ${getScoreColor(data[key])}`}>
                              {data[key]}/{data.full_score}
                            </span>
                          </td>
                          <td className="px-4 py-3 border border-orange-200 text-gray-700 italic">{data.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* Horoscopic Charts */}
            <Card>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-orange-700 mb-6">
                  🏠 कुंडली चार्ट
                </h3>
                {chartLoading && (
                  <div className="text-center py-8">
                    <p className="text-lg text-gray-600">लोड हो रहे हैं...</p>
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Boy's Chart */}
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-blue-700 mb-4">वर की कुंडली</h4>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-300 flex justify-center items-center min-h-[500px]">
                      {boyChartSvg ? (
                        <div dangerouslySetInnerHTML={{ __html: boyChartSvg }} />
                      ) : (
                        <p className="text-gray-500">कुंडली लोड हो रही है...</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Girl's Chart */}
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-pink-700 mb-4">वधू की कुंडली</h4>
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-lg border-2 border-pink-300 flex justify-center items-center min-h-[500px]">
                      {girlChartSvg ? (
                        <div dangerouslySetInnerHTML={{ __html: girlChartSvg }} />
                      ) : (
                        <p className="text-gray-500">कुंडली लोड हो रही है...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Planetary Details */}
            <Card>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-orange-700 mb-6">
                  🌟 ग्रह विवरण
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Boy's Planetary Details */}
                  <div>
                    <h4 className="text-xl font-semibold text-blue-700 mb-4">वर के ग्रह</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm bg-white rounded-lg shadow-sm">
                        <thead className="bg-blue-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-blue-800">ग्रह</th>
                            <th className="px-3 py-2 text-left font-semibold text-blue-800">राशि</th>
                            <th className="px-3 py-2 text-left font-semibold text-blue-800">भाव</th>
                            <th className="px-3 py-2 text-left font-semibold text-blue-800">नक्षत्र</th>
                            <th className="px-3 py-2 text-left font-semibold text-blue-800">अंश</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(result.response.boy_planetary_details).map(([key, planet]) => (
                            <tr key={key} className="border-b border-gray-100 hover:bg-blue-50">
                              <td className="px-3 py-2 font-medium text-blue-700">{planet.name}</td>
                              <td className="px-3 py-2 text-gray-700">{planet.zodiac}</td>
                              <td className="px-3 py-2 text-gray-700">{planet.house}</td>
                              <td className="px-3 py-2 text-gray-700">{planet.nakshatra}</td>
                              <td className="px-3 py-2 text-gray-700">{planet.local_degree.toFixed(2)}°</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Girl's Planetary Details */}
                  <div>
                    <h4 className="text-xl font-semibold text-pink-700 mb-4">वधू के ग्रह</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm bg-white rounded-lg shadow-sm">
                        <thead className="bg-pink-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-pink-800">ग्रह</th>
                            <th className="px-3 py-2 text-left font-semibold text-pink-800">राशि</th>
                            <th className="px-3 py-2 text-left font-semibold text-pink-800">भाव</th>
                            <th className="px-3 py-2 text-left font-semibold text-pink-800">नक्षत्र</th>
                            <th className="px-3 py-2 text-left font-semibold text-pink-800">अंश</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(result.response.girl_planetary_details).map(([key, planet]) => (
                            <tr key={key} className="border-b border-gray-100 hover:bg-pink-50">
                              <td className="px-3 py-2 font-medium text-pink-700">{planet.name}</td>
                              <td className="px-3 py-2 text-gray-700">{planet.zodiac}</td>
                              <td className="px-3 py-2 text-gray-700">{planet.house}</td>
                              <td className="px-3 py-2 text-gray-700">{planet.nakshatra}</td>
                              <td className="px-3 py-2 text-gray-700">{planet.local_degree.toFixed(2)}°</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Astro Details */}
            <Card>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-orange-700 mb-6">
                  ✨ ज्योतिष विवरण
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Boy's Astro Details */}
                  <div>
                    <h4 className="text-xl font-semibold text-blue-700 mb-4">वर का ज्योतिष विवरण</h4>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">गण:</span>
                            <span className="text-blue-700">{result.response.boy_astro_details.gana}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">योनि:</span>
                            <span className="text-blue-700">{result.response.boy_astro_details.yoni}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">वश्य:</span>
                            <span className="text-blue-700">{result.response.boy_astro_details.vasya}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">नाड़ी:</span>
                            <span className="text-blue-700">{result.response.boy_astro_details.nadi}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">वर्ण:</span>
                            <span className="text-blue-700">{result.response.boy_astro_details.varna}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">पाया:</span>
                            <span className="text-blue-700">{result.response.boy_astro_details.paya}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">तत्व:</span>
                            <span className="text-blue-700">{result.response.boy_astro_details.tatva}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">राशि:</span>
                            <span className="text-blue-700">{result.response.boy_astro_details.rasi}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">नक्षत्र:</span>
                            <span className="text-blue-700">{result.response.boy_astro_details.nakshatra}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">लग्न:</span>
                            <span className="text-blue-700">{result.response.boy_astro_details.ascendant_sign}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">वर्तमान दशा:</span>
                            <span className="text-blue-700">{result.response.boy_astro_details.current_dasa}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Lucky Elements */}
                      <div className="mt-6 pt-4 border-t border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-3">शुभ तत्व</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-blue-700 mb-1">शुभ रत्न:</div>
                            <div className="text-blue-600">{result.response.boy_astro_details.lucky_gem.join(', ')}</div>
                          </div>
                          <div>
                            <div className="font-medium text-blue-700 mb-1">शुभ अंक:</div>
                            <div className="text-blue-600">{result.response.boy_astro_details.lucky_num.join(', ')}</div>
                          </div>
                          <div>
                            <div className="font-medium text-blue-700 mb-1">शुभ रंग:</div>
                            <div className="text-blue-600">{result.response.boy_astro_details.lucky_colors.join(', ')}</div>
                          </div>
                          <div>
                            <div className="font-medium text-blue-700 mb-1">शुभ अक्षर:</div>
                            <div className="text-blue-600">{result.response.boy_astro_details.lucky_letters.join(', ')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Girl's Astro Details */}
                  <div>
                    <h4 className="text-xl font-semibold text-pink-700 mb-4">वधू का ज्योतिष विवरण</h4>
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-lg border border-pink-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-pink-800">गण:</span>
                            <span className="text-pink-700">{result.response.girl_astro_details.gana}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-pink-800">योनि:</span>
                            <span className="text-pink-700">{result.response.girl_astro_details.yoni}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-pink-800">वश्य:</span>
                            <span className="text-pink-700">{result.response.girl_astro_details.vasya}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-pink-800">नाड़ी:</span>
                            <span className="text-pink-700">{result.response.girl_astro_details.nadi}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-pink-800">वर्ण:</span>
                            <span className="text-pink-700">{result.response.girl_astro_details.varna}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-pink-800">पाया:</span>
                            <span className="text-pink-700">{result.response.girl_astro_details.paya}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-pink-800">तत्व:</span>
                            <span className="text-pink-700">{result.response.girl_astro_details.tatva}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-pink-800">राशि:</span>
                            <span className="text-pink-700">{result.response.girl_astro_details.rasi}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-pink-800">नक्षत्र:</span>
                            <span className="text-pink-700">{result.response.girl_astro_details.nakshatra}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-pink-800">लग्न:</span>
                            <span className="text-pink-700">{result.response.girl_astro_details.ascendant_sign}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-pink-800">वर्तमान दशा:</span>
                            <span className="text-pink-700">{result.response.girl_astro_details.current_dasa}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Lucky Elements */}
                      <div className="mt-6 pt-4 border-t border-pink-200">
                        <h5 className="font-semibold text-pink-800 mb-3">शुभ तत्व</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-pink-700 mb-1">शुभ रत्न:</div>
                            <div className="text-pink-600">{result.response.girl_astro_details.lucky_gem.join(', ')}</div>
                          </div>
                          <div>
                            <div className="font-medium text-pink-700 mb-1">शुभ अंक:</div>
                            <div className="text-pink-600">{result.response.girl_astro_details.lucky_num.join(', ')}</div>
                          </div>
                          <div>
                            <div className="font-medium text-pink-700 mb-1">शुभ रंग:</div>
                            <div className="text-pink-600">{result.response.girl_astro_details.lucky_colors.join(', ')}</div>
                          </div>
                          <div>
                            <div className="font-medium text-pink-700 mb-1">शुभ अक्षर:</div>
                            <div className="text-pink-600">{result.response.girl_astro_details.lucky_letters.join(', ')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
