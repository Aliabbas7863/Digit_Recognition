"""
Flask app for digit recognition using a trained neural network
"""
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import io
import base64
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# Load the trained model
MODEL_PATH = 'models/digit_recognition_model.h5'
if not os.path.exists(MODEL_PATH):
    print(f"Warning: Model not found at {MODEL_PATH}")
    print("Please run train_model.py first to train the model")
    model = None
else:
    model = keras.models.load_model(MODEL_PATH)
    print(f"Model loaded from {MODEL_PATH}")

@app.route('/')
def home():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """
    Receive image data and predict the digit
    Expects JSON with 'image' field containing base64 encoded image
    """
    if model is None:
        return jsonify({
            'error': 'Model not loaded. Please train the model first using train_model.py'
        }), 500
    
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to grayscale if needed
        if image.mode != 'L':
            image = image.convert('L')
        
        # Resize to 28x28 (MNIST format)
        image = image.resize((28, 28))
        
        # Convert to numpy array and normalize
        img_array = np.array(image).astype('float32') / 255.0
        
        # Flatten to 784 values (28x28)
        img_array = img_array.reshape(1, 784)
        
        # Make prediction
        predictions = model.predict(img_array, verbose=0)
        predicted_digit = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_digit]) * 100
        
        # Get all probabilities for visualization
        all_probabilities = {
            str(i): float(predictions[0][i]) * 100 
            for i in range(10)
        }
        
        return jsonify({
            'digit': int(predicted_digit),
            'confidence': round(confidence, 2),
            'probabilities': all_probabilities
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    model_loaded = model is not None
    return jsonify({
        'status': 'ok',
        'model_loaded': model_loaded
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
