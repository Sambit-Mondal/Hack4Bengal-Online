# land_valuation_model.py

import pandas as pd
import numpy as np
import requests
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# --- 1. Load Dataset ---
data = pd.read_csv("land_data.csv")
print("Columns in the dataset:")
print(data.columns)

# --- 2. Feature Engineering ---
# Since we don't have latitude/longitude data, we'll use the available features
# Comment out or remove the OpenStreetMap API functionality
"""
# --- 2. Get Nearby Infrastructure using OpenStreetMap Overpass API ---
def get_nearby_amenities(lat, lon, amenity_type, radius=1000):
    overpass_url = "http://overpass-api.de/api/interpreter"
    query = f'''
    [out:json];
    (node["amenity"="{amenity_type}"](around:{radius},{lat},{lon}););
    out body;
    '''
    response = requests.post(overpass_url, data=query)
    results = response.json()
    if 'elements' in results:
        distances = [geodesic((lat, lon), (el['lat'], el['lon'])).meters for el in results['elements']]
        return min(distances) if distances else np.nan
    return np.nan

# Apply infrastructure features
for amenity in ['hospital', 'school', 'place_of_worship']:
    data[f'distance_to_{amenity}'] = data.apply(
        lambda row: get_nearby_amenities(row['latitude'], row['longitude'], amenity), axis=1
    )
"""

# --- 3. Preprocessing ---
# Handle categorical variables
data = pd.get_dummies(data, columns=['Location', 'Property_Type'], drop_first=True)

# No need to drop NA values if dataset is clean
# data.dropna(inplace=True)

# Select features
X = data[['Area_SqFt', 'Proximity_to_Highway_km', 'Land_Quality_Rating'] + 
         [col for col in data.columns if col.startswith('Location_') or col.startswith('Property_Type_')]]
y = data['Price_INR']

# --- 4. Model Training ---
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# --- 5. Evaluation ---
y_pred = model.predict(X_test)
print("MAE:", mean_absolute_error(y_test, y_pred))
print("RMSE:", np.sqrt(mean_squared_error(y_test, y_pred)))
print("R²:", r2_score(y_test, y_pred))

# --- 6. Feature Importance ---
feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': model.feature_importances_
}).sort_values('Importance', ascending=False)

# print("\nFeature Importance:")
# print(feature_importance)


# --- 7. Save the Model ---
import joblib

# Get unique locations and property types from original data
original_data = pd.read_csv("land_data.csv")
locations = list(original_data['Location'].unique())
property_types = list(original_data['Property_Type'].unique())

# Save model and metadata
model_data = {
    'model': model,
    'locations': locations,
    'property_types': property_types,
    'feature_columns': X.columns.tolist()
}

joblib.dump(model_data, 'land_model.pkl')
print("Model and metadata saved successfully!")