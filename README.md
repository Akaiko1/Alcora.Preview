# AI Demo Applications - Getting Started Guide

This repository contains three AI demo applications showcasing different capabilities:

1. **Big Data Dashboard** 📊 - Data visualization and analysis application
2. **Computer Vision Demo** 📷 - Real-time object detection using webcam
3. **Speech Text Demo** 🎤 - Natural language processing with speech recognition

## System Requirements

- **Node.js** (v18.0.0+)
- **npm** (v8.0.0+)
- A modern browser with support for:
  - WebRTC (camera access)
  - Web Speech API (speech recognition)
  - WebGL (TensorFlow.js)
- Webcam (for the Computer Vision Demo)
- Microphone (for the Speech Text Demo)

## Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Akaiko1/Alcora.Preview.git
cd Alcora.Preview
```

### 2. Big Data Dashboard (Vite + React)

```bash
# Navigate to the project directory
cd bigdata-demo

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### 3. Computer Vision Demo (Create React App)

```bash
# Navigate to the project directory
cd computer-vision-demo

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at `http://localhost:3000`.

### 4. Speech Text Demo (Vite + React)

```bash
# Navigate to the project directory
cd speech-text-demo

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Application Features

### Big Data Dashboard Demo

This application demonstrates data visualization and analysis with React and Recharts:

- Multiple chart types: Line, Bar, Area, and Scatter charts
- Statistical analysis with mean, median, standard deviation, quartiles
- Linear regression with trend lines
- Anomaly detection and correlation analysis
- Mock data generation for demonstration purposes

### Computer Vision Demo

This application shows real-time object detection using TensorFlow.js:

- Uses COCO-SSD model for object detection
- Processes video stream from your webcam
- Identifies common objects and displays confidence scores
- Draws bounding boxes around detected objects

### Speech Text Demo

This application demonstrates NLP capabilities:

- Speech recognition for voice input
- Text processing (tokenization, stemming, stopword removal)
- Intent detection (questions, commands, statements)
- Sentiment analysis (positive, negative, neutral)
- Text-to-speech for audible responses

## Troubleshooting

### Common Issues

#### Big Data Dashboard Demo (Vite)

- If charts aren't rendering correctly, make sure your browser is up to date
- For Vite-specific issues, check the [Vite documentation](https://vitejs.dev/guide/)

#### Computer Vision Demo (Create React App)

- Camera not working? Check your browser permissions
- Running slowly? Close other resource-intensive applications
- TensorFlow.js errors? Make sure your browser supports WebGL
- For CRA-specific issues, check the [Create React App documentation](https://create-react-app.dev/docs/getting-started/)

#### Speech Text Demo (Vite)

- Speech recognition works best in Chrome
- Check microphone permissions if voice input isn't working
- Make sure your volume is up for text-to-speech responses
- For Vite-specific issues, check the [Vite documentation](https://vitejs.dev/guide/)

### Browser Compatibility

For the best experience, we recommend:
- Google Chrome (latest version)
- Microsoft Edge (latest version)
- Firefox (latest version)

Safari has limited support for some features, particularly speech recognition.

## Additional Information

These demos showcase how modern web technologies can implement AI capabilities directly in the browser without requiring server-side processing. All processing happens locally on your device.

The applications use different React setups:
- Big Data Dashboard and Speech Text Demo use Vite
- Computer Vision Demo uses Create React App for a standard React setup
