# Astrology Panchang & Horoscope WordPress Plugin

A complete astrology solution with Panchang and Daily Horoscope features for WordPress.

## Features

- **Panchang (Hindu Calendar)** - Daily almanac with tithi, nakshatra, yoga, etc.
- **Daily Horoscope** - Personalized predictions based on zodiac signs
- **Responsive Design** - Works on all devices
- **Temple Theme** - Saffron colors throughout
- **AJAX Powered** - Fast, seamless user experience
- **WordPress Compatible** - No conflicts with other plugins

## Installation

### Method 1: Manual Installation

1. **Create Plugin Directory**
   ```
   /wp-content/plugins/astrology-panchang-horoscope/
   ```

2. **Upload Files**
   - Copy `astrology-plugin.php` to the plugin directory
   - Create `assets/` folder in the plugin directory
   - Copy `assets/style.css` and `assets/script.js` to the assets folder

3. **Activate Plugin**
   - Go to WordPress Admin → Plugins
   - Find "Astrology Panchang & Horoscope"
   - Click "Activate"

### Method 2: ZIP Upload

1. **Create ZIP File**
   - Create folder: `astrology-panchang-horoscope`
   - Add all files to the folder
   - Create ZIP: `astrology-panchang-horoscope.zip`

2. **Upload via WordPress**
   - Go to WordPress Admin → Plugins → Add New
   - Click "Upload Plugin"
   - Choose the ZIP file
   - Click "Install Now" → "Activate"

## Usage

### Shortcode Method (Recommended)

Add this shortcode to any page or post:

```
[astrology_page]
```

### Custom Attributes

```
[astrology_page title="Custom Title" subtitle="Custom Subtitle"]
```

### Page Template Method

Create a new page and add the shortcode:

1. Go to **Pages → Add New**
2. Add title: "Astrology Services"
3. Add shortcode: `[astrology_page]`
4. Publish

## Customization

### Colors
Edit `assets/style.css` to change colors:
- Header gradient: `.astrology-header`
- Card borders: `.astrology-card`
- Button colors: `.astrology-btn-primary`, `.astrology-btn-secondary`

### API Integration
Edit `astrology-plugin.php` to add real API calls:
- `handle_panchang_request()` - Add Panchang API
- `handle_horoscope_request()` - Add Horoscope API

## File Structure

```
astrology-panchang-horoscope/
├── astrology-plugin.php          # Main plugin file
├── assets/
│   ├── style.css                 # Plugin styles
│   └── script.js                 # Plugin JavaScript
└── README.md                     # This file
```

## Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- jQuery (included with WordPress)

## Support

For support or customization requests, contact your developer.

## Changelog

### Version 1.0.0
- Initial release
- Panchang functionality
- Daily horoscope
- Responsive design
- WordPress integration