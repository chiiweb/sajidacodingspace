# npm start 
to run!

# sajida's coding space — extravaganza

an upgraded interactive coding classroom built with html, css, javascript, node.js, and express.

## what was improved

- all navigation links jump to real sections
- resource cards now have working lesson modals and official documentation links
- project desk with starter ideas (now includes a car dodge game idea and several magic-themed ideas)
- persistent idea notebook using localStorage
- classroom search overlay
- resource filtering and searching
- focus mode
- random project idea button
- progress celebration button
- working node.js api status panel
- expanded terminal commands
- server health and resource/project api routes
- responsive mobile layout
- image fallbacks so the site still loads when assets are temporarily missing
- theme preference is remembered
- keyboard shortcuts: ctrl+k for terminal and / for search

## ✦ new extravaganza features

- **6 themes** — click the ☼ icon to pick Midnight, Daylight, Ocean Breeze, Sunset Glow, Enchanted Forest, or Magic Galaxy
- **toolkit popover** (✦ icon) with:
  - a pomodoro-style focus timer (15/25/45 min presets)
  - an achievements/badges panel that unlocks as you use the site
  - a magic cursor sparkle-trail toggle
- **daily coding challenge** card with a "new challenge" shuffle button
- **mini web browser** — type any address (or use the quick links) to load other sites inside the classroom in an iframe
- **color palette generator** — generate random 5-color palettes, lock colors you like, click to copy hex codes
- **cooler live preview**:
  - device toggle to preview your code as desktop / tablet / mobile
  - a console tab that captures `console.log` / `warn` / `error` from your running code
  - fullscreen preview button
- **two new starter templates**: a playable 🚗 car dodge game (arrow keys) and a ✨ magic spell generator

## add the images

put the real image files in `public/assets/`:

- `fairylights.png`
- `chiikawa.png`
- `chiisai.png`
- `chiikawastar.png`

## run it

1. open a terminal in this folder
2. run `npm install`
3. run `npm start`
4. open `http://localhost:3000`

## important

there are no external image files included in this zip because they were not uploaded. the site has a fallback for the missing images and will automatically use the real ones once placed in `public/assets/` with the filenames above.


## Assets
Put your asset files directly in `public/assets/`:
- `fairylights.png`
- `chiikawa.png`
- `chiisai.png`
- `chiikawastar.png`
- `soundeffect.mp3`

The loader is independent of audio playback, so a browser blocking autoplay will no longer keep the loading screen stuck. The sound is attempted on load and retried on the first click/key press.
