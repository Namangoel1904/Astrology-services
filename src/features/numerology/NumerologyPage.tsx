'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumerologyResult {
  destiny: {
    title: string;
    category: string;
    number: string;
    master: boolean;
    meaning: string;
    description: string;
  };
  personality: {
    title: string;
    category: string;
    number: string;
    master: boolean;
    meaning: string;
    description: string;
  };
  attitude: {
    title: string;
    category: string;
    number: string;
    master: boolean;
    meaning: string;
    description: string;
  };
  character: {
    title: string;
    category: string;
    number: string;
    master: boolean;
    meaning: string;
    description: string;
  };
  soul: {
    title: string;
    category: string;
    number: string;
    master: boolean;
    meaning: string;
    description: string;
  };
  agenda: {
    title: string;
    category: string;
    number: string;
    master: boolean;
    meaning: string;
    description: string;
  };
  purpose: {
    title: string;
    category: string;
    number: string;
    master: boolean;
    meaning: string;
    description: string;
  };
}

export default function NumerologyPage() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    lang: 'hi'
  });
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/numerology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 200 && data.response) {
        setResult(data.response);
      } else {
        throw new Error(data.message || 'Failed to fetch numerology data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  const setToday = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB');
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔮 अंक ज्योतिष
          </h1>
          <p className="text-xl text-blue-200">
            आपके नाम और जन्म तिथि से जानें आपका भविष्य
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Form */}
          <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">
                अंक ज्योतिष विश्लेषण
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white font-semibold">
                      नाम *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="अपना पूरा नाम लिखें"
                      required
                      className="mt-2 bg-white/20 border-white/30 text-white placeholder-gray-300"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date" className="text-white font-semibold">
                      जन्म तिथि *
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="bg-white/20 border-white/30 text-white"
                      />
                      <Button
                        type="button"
                        onClick={setToday}
                        variant="outline"
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                      >
                        आज
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="lang" className="text-white font-semibold">
                    भाषा
                  </Label>
                  <select
                    id="lang"
                    name="lang"
                    value={formData.lang}
                    onChange={handleInputChange}
                    className="mt-2 w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
                  >
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

                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold"
                  >
                    {loading ? 'विश्लेषण हो रहा है...' : 'अंक ज्योतिष विश्लेषण करें'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="mb-8 bg-red-500/20 border-red-500/30">
              <CardContent className="pt-6">
                <p className="text-red-200 text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  आपका अंक ज्योतिष विश्लेषण
                </h2>
                <p className="text-blue-200">
                  नाम: <span className="font-semibold">{formData.name}</span> | 
                  जन्म तिथि: <span className="font-semibold">{formatDate(formData.date)}</span>
                </p>
              </div>

              {/* Numerology Results Table */}
              <div className="grid gap-6">
                {Object.entries(result).map(([key, data]) => (
                  <Card key={key} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl text-white">
                          {data.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-yellow-400">
                            {data.number}
                          </span>
                          {data.master && (
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-semibold">
                              मास्टर
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-blue-200 mb-2">
                          अर्थ:
                        </h4>
                        <p className="text-white leading-relaxed">
                          {data.meaning}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-blue-200 mb-2">
                          विवरण:
                        </h4>
                        <p className="text-white leading-relaxed">
                          {data.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
