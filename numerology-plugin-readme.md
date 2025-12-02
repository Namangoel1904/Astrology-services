# Numerology Prediction WordPress Plugin

A complete numerology prediction plugin for WordPress with beautiful table structure and API integration.

## Features

- 🔮 **Complete Numerology Analysis**: 7 different aspects of numerology
- 🌟 **Beautiful UI**: Modern gradient design with glass-morphism effects
- 📱 **Responsive Design**: Works perfectly on all devices
- 🌍 **Multi-language Support**: Hindi, English, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam
- ⚡ **Real-time API Integration**: Live data from VedicAstroAPI
- 🎨 **Customizable**: Easy to customize colors and styling

## Numerology Aspects Covered

1. **भाग्य (Destiny)** - Your life path and purpose
2. **व्यक्तित्व (Personality)** - Your inner personality traits
3. **रवैया (Attitude)** - How you approach life situations
4. **चरित्र (Character)** - Your public and social qualities
5. **आत्मा से आग्रह (Soul Urge)** - Your soul's deepest desires
6. **गुप्त एजेंडा (Hidden Agenda)** - Your subconscious motivations
7. **ईश्वरीय उद्देश्य (Divine Purpose)** - Your spiritual mission

## Installation

1. **Download the Plugin**: Get the `numerology-prediction-v1.0.0.zip` file
2. **Upload to WordPress**: 
   - Go to WordPress Admin → Plugins → Add New
   - Click "Upload Plugin"
   - Choose the ZIP file and upload
3. **Activate the Plugin**: Activate the "Numerology Prediction Plugin"
4. **Add to Page**: Use the shortcode `[numerology_prediction]` on any page or post

## Usage

### Basic Shortcode
```
[numerology_prediction]
```

### Custom Shortcode with Parameters
```
[numerology_prediction title="Your Custom Title" subtitle="Your Custom Subtitle"]
```

### Example Page Setup
1. Create a new page in WordPress
2. Add the shortcode: `[numerology_prediction]`
3. Publish the page
4. Visit the page to see the numerology form

## How It Works

1. **User Input**: Users enter their name, birth date, and preferred language
2. **API Call**: The plugin makes a secure API call to VedicAstroAPI
3. **Data Processing**: The response is processed and formatted
4. **Beautiful Display**: Results are displayed in an organized, table-like structure
5. **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## API Integration

The plugin integrates with VedicAstroAPI for accurate numerology calculations:
- **Endpoint**: `https://api.vedicastroapi.com/v3-json/prediction/numerology`
- **Multiple Request Methods**: GET, POST form data, POST JSON
- **Error Handling**: Graceful fallback if API is unavailable
- **Security**: All API calls are made server-side for security

## Customization

### CSS Customization
You can customize the appearance by modifying the CSS file:
- **File**: `assets/numerology-plugin-style.css`
- **Colors**: Change gradient backgrounds, text colors, etc.
- **Layout**: Modify spacing, fonts, and responsive breakpoints

### Shortcode Parameters
- `title`: Custom title for the numerology section
- `subtitle`: Custom subtitle for the numerology section

## Technical Details

- **WordPress Version**: 5.0+
- **PHP Version**: 7.4+
- **Dependencies**: None (uses WordPress built-in functions)
- **Security**: Nonce verification, input sanitization, output escaping
- **Performance**: Optimized CSS and JavaScript, minimal resource usage

## Troubleshooting

### Common Issues

1. **Plugin Not Working**: 
   - Check if the plugin is activated
   - Verify the shortcode is correct: `[numerology_prediction]`

2. **API Errors**:
   - Check your internet connection
   - Verify the API key is valid
   - Check WordPress error logs

3. **Styling Issues**:
   - Clear any caching plugins
   - Check for theme conflicts
   - Verify CSS file is loading

### Debug Mode
To enable debug mode, add this to your `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## Support

For support and customization requests:
- Check the plugin documentation
- Review WordPress error logs
- Contact the plugin developer

## Changelog

### Version 1.0.0
- Initial release
- Complete numerology analysis
- Beautiful responsive design
- Multi-language support
- API integration
- WordPress compatibility

## License

This plugin is licensed under GPL v2 or later.

## Credits

- **API Provider**: VedicAstroAPI
- **Design**: Modern gradient design with glass-morphism effects
- **Icons**: Unicode emoji icons for better compatibility
