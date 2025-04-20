import pandas as pd
import numpy as np
import joblib
import os
import pickle
from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

# Load the trained model and preprocessing info
try:
    if os.path.exists('land_model.pkl'):
        # Try different loading approaches
        try:
            # First try joblib
            model_data = joblib.load('land_model.pkl')
            # Test if it's a dictionary with expected keys
            if not isinstance(model_data, dict) or 'model' not in model_data:
                # If it's just the model itself, adapt
                print("Model format is different than expected, adapting...")
                model = model_data  # The loaded object is the model itself
                # Load metadata separately if possible
                original_data = pd.read_csv("land_data.csv")
                locations = list(original_data['Location'].unique())
                property_types = list(original_data['Property_Type'].unique())
            else:
                # It's as expected
                model = model_data['model']
                locations = model_data['locations']
                property_types = model_data['property_types']
                feature_columns = model_data['feature_columns']
        except:
            # If joblib fails, try pickle
            with open('land_model.pkl', 'rb') as f:
                model_data = pickle.load(f)
            model = model_data['model']
            locations = model_data['locations']
            property_types = model_data['property_types']
            feature_columns = model_data['feature_columns']
    else:
        # If model doesn't exist, run the training script
        print("Model not found. Training model...")
        import subprocess
        subprocess.run(['python', 'land_valuation.py'])
        model_data = joblib.load('land_model.pkl')
        model = model_data['model']
        locations = model_data['locations']
        property_types = model_data['property_types']
        feature_columns = model_data['feature_columns']
except Exception as e:
    print(f"Error loading model: {str(e)}")
    raise

@app.route('/')
def home():
    return render_template('index.html', locations=locations, property_types=property_types)

@app.route('/predict', methods=['POST'])
def predict():
    # Get input values from form
    location = request.form.get('location')
    area_sqft = float(request.form.get('area_sqft'))
    property_type = request.form.get('property_type')
    proximity_to_highway = float(request.form.get('proximity_to_highway'))
    land_quality = int(request.form.get('land_quality'))
    
    # Create a dataframe with the input data
    input_data = {
        'Area_SqFt': [area_sqft],
        'Proximity_to_Highway_km': [proximity_to_highway],
        'Land_Quality_Rating': [land_quality],
        'Location': [location],
        'Property_Type': [property_type]
    }
    
    # Create dataframe and perform one-hot encoding exactly as in training
    input_df = pd.DataFrame(input_data)
    input_df = pd.get_dummies(input_df, columns=['Location', 'Property_Type'], drop_first=True)
    
    # Get the expected features
    if 'feature_columns' in locals() or 'feature_columns' in globals():
        expected_columns = feature_columns  
    else:
        # Fallback to load from training data
        training_data = pd.read_csv("land_data.csv")
        training_df = pd.get_dummies(training_data, columns=['Location', 'Property_Type'], drop_first=True)
        expected_columns = ['Area_SqFt', 'Proximity_to_Highway_km', 'Land_Quality_Rating'] + [
            col for col in training_df.columns if col.startswith('Location_') or col.startswith('Property_Type_')
        ]
    
    # Ensure all expected columns are present (with 0 for missing ones)
    for col in expected_columns:
        if col not in input_df.columns:
            input_df[col] = 0
    
    # Remove any extra columns not seen during training
    input_df = input_df[expected_columns]
    
    # Make prediction
    prediction = model.predict(input_df)[0]
    
    # Format prediction as currency
    formatted_prediction = f"₹{prediction:,.2f}"
    
    return render_template('index.html', 
                          prediction=formatted_prediction,
                          locations=locations,
                          property_types=property_types,
                          selected_location=location,
                          area_sqft=area_sqft,
                          selected_property_type=property_type,
                          proximity_to_highway=proximity_to_highway,
                          land_quality=land_quality)

if __name__ == '__main__':
    app.run(debug=True)