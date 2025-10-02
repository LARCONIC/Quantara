# SonicWave

SonicWave-Light is an advanced audio visualization web application that allows users to upload audio and video files (including MP4), play them, and view real-time, interactive visualizations. The app supports multiple visualization modes, including Bars, Wave, Circular, Spectrum, Particle, Galaxy, and an advanced Koch Snowflake fractal visualizer. SonicWave-Light features modern theming, keyboard shortcuts, and an intuitive user interface inspired by professional-grade audio visualizers.

---

## Features

- **Audio & Video Upload**: Supports `audio/*` and `video/*` (including MP4). Automatically extracts and visualizes audio from uploaded videos.
- **Multiple Visualization Modes**:
  - **Bars**: Classic bar graph frequency visualization.
  - **Wave**: Smooth waveform visualization with enhanced shadow effects.
  - **Circular**: Radial spectrum visualization with animated rotation.
  - **Spectrum**: Colorful dynamic bars with hue cycling.
  - **Particle**: Physics-inspired, reactive particles that connect and move with sound.
  - **Galaxy**: Star field and spiral galaxy visualizer, with twinkling stars and spiral arms.
  - **Koch Snowflake**: Fractal visualization, highly customizable, reacts to audio.
- **Koch Fractal Controls**:
  - Detail level, size, color modes (spectrum, theme, custom), audio reactivity, intensity, presets.
- **Theming**: Five built-in themes (Aurora, Sunset, Emerald, Cosmic, Crimson) for unique color palettes and backgrounds.
- **Keyboard Shortcuts**: Easily switch visualization modes, control playback, volume, and mute with intuitive keys.
- **Demo Track**: Instantly preview visualizations with a built-in demo audio file.
- **Volume and Sensitivity Controls**: Fine-tune visual quality and audio sensitivity.

---

## Live Demo

> _You can try SonicWave-Light by opening `index.html` locally or hosting the repository on a static web server._

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/LARCONIC/SonicWave-Light.git
cd SonicWave-Light
```

### 2. Run Locally

Simply open `index.html` in your browser. All scripts and styles are included and require no build step.

### 3. Upload Audio/Video

- Drag and drop or use the upload button to select files.
- Supported formats: Any audio type, plus MP4 video (audio is extracted and visualized).

---

## Keyboard Shortcuts

| Action            | Key         |
|-------------------|-------------|
| Play/Pause        | Space       |
| Bars Mode         | B           |
| Wave Mode         | W           |
| Circular Mode     | C           |
| Spectrum Mode     | S           |
| Particle Mode     | P           |
| Galaxy Mode       | G           |
| Koch Snowflake    | K           |
| Mute/Unmute       | M           |
| Volume Up         | ↑           |
| Volume Down       | ↓           |

Shortcut panel can be toggled in the UI for reference.

---

## Visualization Controls

- **Quality**: Adjust rendering quality and performance.
- **Audio Sensitivity**: Boost or dampen animation response to audio.
- **Koch Fractal**:
  - Detail Level: Set recursion depth for the fractal.
  - Size: Change overall snowflake size.
  - Color Mode: Choose spectrum, theme, or custom color.
  - Audio Reactivity: Enable/disable reactivity and tune its intensity.
  - Presets: Instantly apply recommended settings.
- **Theme Selector**: Instantly switch between built-in themes.

---

## File Structure

```
.
├── index.html          # Main HTML file
├── style.css           # Full UI and visualization styles
├── 2.0.js              # Main JS file (all visualizers + logic)
├── script.js           # (Duplicate/minified JS, optional)
├── README.md           # Project documentation
└── .github/
    └── workflows/
        └── mirror.yml  # GitHub Actions for repo mirroring
```

---

## Technologies Used

- **HTML5 & CSS3**
- **JavaScript (ES6+)**
- **Web Audio API** for real-time audio data analysis
- **Canvas API** for graphics rendering
- **Font Awesome** for icons
- **Google Fonts** for typography

---

## Advanced Visualizers

### Koch Snowflake Fractal

- Highly interactive fractal visualization responding to audio.
- Custom controls for recursion, color, reactivity, and presets.
- Uses efficient caching for fractal computation.

### Galaxy & Particle Modes

- Physics-inspired visuals with star fields, spiral arms, and dynamic particles.
- Responsive to bass, mid, and treble frequencies.

---

## Customization

- **Theming**: Easily add or modify CSS variables for new themes.
- **Visualizer Modes**: Extend or modify by updating `2.0.js`.
- **Controls**: All controls are modular and extensible.

---

## Contributing

Pull requests, feature suggestions, and bug reports are welcome. Please open an issue or PR with a detailed description.

---

## License

This project is released under the [MIT License](LICENSE).

---

## Credits

- Developed by [LARCONIC](https://github.com/LARCONIC)
- Iconography: Font Awesome
- Fonts: Google Fonts (Outfit, Montserrat)
- Inspired by modern audio visualization tools.

---

## Troubleshooting

- If you encounter issues loading files, ensure browser permissions for audio/video are enabled.
- For best performance, use a modern browser (Chrome, Firefox, Edge).

---

## GitHub Actions

- `.github/workflows/mirror.yml`: Automatically mirrors this repo to a personal backup on every push.

---

## Contact & Social

- [GitHub](https://github.com/LARCONIC/SonicWave-Light)
- [Twitter](#)
- [Instagram](#)

---

Enjoy exploring music and visuals with **SonicWave-Light**!