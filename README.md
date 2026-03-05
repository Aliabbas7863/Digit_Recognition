# Digit Recognition

A web-based digit recognition application using a neural network trained on the MNIST dataset. Draw digits on the canvas and watch the AI recognize them in real-time!

## Features

✨ **Interactive Canvas** - Draw digits (0-9) with smooth mouse/touch input
🤖 **Neural Network** - Deep learning model trained on 70,000+ handwritten digit samples
📊 **Confidence Scores** - View prediction confidence and probabilities for all digits
🎨 **Beautiful UI** - Modern, responsive web interface
⚡ **Real-time Prediction** - Instant digit recognition

## Project Structure

```
.
├── train_model.py          # Script to train the neural network
├── app.py                  # Flask backend API
├── requirements.txt        # Python dependencies
├── templates/
│   └── index.html         # Web interface
├── static/
│   ├── style.css          # Styling
│   └── script.js          # Canvas and prediction logic
└── models/
    └── digit_recognition_model.h5  # Trained model (created after training)
```

## Installation & Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Train the Model

This downloads the MNIST dataset and trains a neural network (takes ~5-10 minutes):

```bash
python train_model.py
```

You should see accuracy around 97-98% on the test set.

### 3. Run the Web Application

```bash
python app.py
```

The app will start on `http://localhost:5000`

## How to Use

1. Open your browser and go to `http://localhost:5000`
2. Draw a digit (0-9) on the white canvas
3. Click "Predict" to recognize the digit
4. View the prediction with confidence score
5. Click "Clear" to draw another digit

## Model Architecture

The neural network consists of:
- Input layer: 784 neurons (28×28 pixel images flattened)
- Hidden layer 1: 128 neurons + ReLU + Dropout(0.2)
- Hidden layer 2: 64 neurons + ReLU + Dropout(0.2)
- Hidden layer 3: 32 neurons + ReLU + Dropout(0.2)
- Output layer: 10 neurons (digits 0-9) + Softmax

**Training details:**
- Dataset: MNIST (60,000 training images)
- Epochs: 15
- Batch size: 128
- Optimizer: Adam
- Loss: Sparse Categorical Crossentropy

## Technology Stack

- **Backend**: Flask, TensorFlow/Keras
- **Frontend**: HTML5, CSS3, JavaScript Canvas
- **ML Framework**: TensorFlow 2.13
- **Dataset**: MNIST

## Tips for Best Results

- Draw digits in the center of the canvas
- Use a brush size similar to the canvas size
- Keep strokes smooth and connected
- Avoid too much noise/extra marks

## Troubleshooting

**Error: "Model not loaded"**
- Make sure you ran `python train_model.py` first
- Check that `models/digit_recognition_model.h5` exists

**Low accuracy predictions**
- Try drawing digits more clearly
- Ensure the digit takes up a good portion of the canvas
- The model works best with centered digits

## License

MIT License - Feel free to use and modify!