# SonicWave Pro

**SonicWave Pro** is an advanced music visualizer web application that transforms audio and video files into stunning, interactive visual experiences. Designed with premium effects, responsive controls, and theme customization, it offers users an immersive way to enjoy music visually.

**Live Demo:** [sonicwavepro.netlify.app](https://sonicwavepro.netlify.app)

---

## Features

- **Audio & Video Visualization:** Supports both audio (MP3, WAV) and video (MP4) files.
- **Multiple Visualization Modes:** 
  - Bars
  - Wave
  - Circular
  - Spectrum
  - Particles
  - Galaxy
- **Responsive Visuals:** Real-time, high-quality graphics and smooth animations.
- **Theme Customization:** Five distinct themes (Aurora, Sunset, Emerald, Cosmic, Crimson) for personalized aesthetics.
- **Audio Equalizer:** 10-band equalizer with presets (Flat, Bass Boost, Treble Boost, Vocal, Electronic).
- **Playlist Manager:** Create, save, load, and clear playlists. Track management with play/remove controls.
- **Playback Controls:** Play/pause, seek, volume control, mute/unmute, and floating controls for quick access.
- **Keyboard Shortcuts:** Intuitive hotkeys for fast operation (see below).
- **Social Sharing:** Capture visualizations and share them on Twitter, Facebook, WhatsApp, Telegram.
- **Fullscreen & Quality Switching:** Toggle fullscreen mode and switch between standard/high quality analysis.
- **Animated Logo & UI Effects:** Attractive branding and smooth transitions for a premium feel.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/LARCONIC/SonicWave-Pro.git
cd SonicWave-Pro
```

### 2. Open the Application

No build steps required. Simply open `index.html` in your browser.

> **Note:** For full functionality, use the latest version of Chrome, Firefox, or Edge. Web Audio API support is required.

---

## Usage

1. **Select an Audio/Video File:**  
   Use the "Choose File" button to upload your own music or video file. Or try the "Load Demo Track" for a sample.

2. **Play & Visualize:**  
   Click **Play** to start playback and watch the visualization respond in real time.

3. **Change Visualization Mode:**  
   Use the mode buttons (Bars, Wave, etc.) or keyboard shortcuts (`1` for Bars, `2` for Wave, etc.) to switch styles.

4. **Customize Theme:**  
   Select from five color themes using the theme selector.

5. **Tune Audio:**  
   Open the equalizer, adjust sliders or select a preset to shape your sound.

6. **Manage Playlists:**  
   Add tracks, save your playlist as a JSON file, or load a previously saved playlist.

7. **Capture & Share:**  
   Click "Capture Visualization" to take a snapshot. Download or share it on social platforms.

8. **Keyboard Shortcuts:**  
   - **Space:** Play/Pause
   - **F:** Fullscreen
   - **M:** Mute/Unmute
   - **1–6:** Select visualization mode
   - **↑/↓:** Volume up/down
   - **←/→:** Seek backward/forward

---

## File Structure

- `index.html` – Main app HTML, UI layout.
- `styles.css` – All styling, theme variables, responsive design, and animations.
- `2.5.js` – Application logic: visualization rendering, audio processing, playlist & UI management.
- `.github/workflows/mirror.yml` – GitHub Actions workflow for repo mirroring.
- `README.md` – Project documentation.

---

## Development Notes

- **No dependencies required:** All logic is vanilla JS/CSS/HTML. External libraries are only used for icons and fonts.
- **Audio Processing:** Uses Web Audio API for real-time analysis and equalization.
- **Visualization:** Dynamic canvas rendering for all visual effects.
- **Playlist Format:** Playlists are saved as JSON, but do **not** include actual audio data – users must reload files after importing a playlist.

---

## Contributing

Pull requests, feature suggestions, and bug reports are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is not open source. but you can with if you have any idea Or just want to contribute.
---

## Credits

Created by [LARCONIC](https://github.com/LARCONIC)

Special thanks to:
- [Font Awesome](https://fontawesome.com/)
- [Google Fonts](https://fonts.google.com/)
- [Pixabay](https://pixabay.com/music/) for demo track

---

## Contact

For questions, feedback, or support:
- Email: yourancient0@gmail.com
- GitHub Issues: [Create Issue](https://github.com/LARCONIC/SonicWave-Pro/issues)

---

Enjoy a new dimension of music with SonicWave Pro!