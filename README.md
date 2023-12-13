# Prompt Pal Chrome Extension

## Description
The **Prompt Pal** Chrome Extension is designed to enhance the browsing experience on the OpenAI website by providing reading time estimates for documentation articles.

## Usage
1. **Installation**:
   - Download or clone this repository to your local machine.
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable 'Developer mode' in the top right corner.
   - Click on 'Load unpacked' and select the directory where the extension files are located.

2. **Activation**:
   - Once installed, visit any documentation article on the OpenAI website.
   - The extension will automatically calculate and display the estimated reading time for the article.

## Development Details
- **Technologies Used**: JavaScript.
- **Files**: Content scripts (`scripts/content.js` and `scripts/hud.js`).
- **Manifest File**: Specifies extension details, content scripts, permissions, and popup behavior.

## Errors Resolved
- **Content Script Loading**: Corrected issues related to content scripts not loading on specific OpenAI documentation pages.
- **Popup Display**: Fixed errors preventing the popup from appearing when the extension was clicked.

## Known Issues
1. **Reading Time Accuracy**: The reading time estimation might not be entirely accurate for all types of content or layouts.
2. **Compatibility**: Future updates to the OpenAI website structure could affect the extension's functionality.
