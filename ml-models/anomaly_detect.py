import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from datetime import datetime
import warnings

# Suppress specific pandas warnings
warnings.filterwarnings('ignore', category=UserWarning, module='pandas')
warnings.filterwarnings('ignore', category=pd.errors.SettingWithCopyWarning)

# ------------------------------
# Step 1: Sample Dataset Creation
# ------------------------------

# Load the data
data = pd.read_csv('anomaly.csv')

# Print column names to verify what's actually in the file
# print("Available columns:", data.columns.tolist())

# Clean the data
# Remove duplicates
data = data.drop_duplicates()

# Handle missing values - using the EXACT column names from your data
transaction_amount_col = 'Transaction Amount'
land_area_col = 'Land Area (sq.m)'
market_value_col = 'Market Value'
transaction_date_col = 'Transaction Date'
parcel_id_col = 'Parcel ID'

data = data.fillna({
    transaction_amount_col: data[transaction_amount_col].median(),
    land_area_col: data[land_area_col].median(),
    market_value_col: data[market_value_col].median()
})

# Convert date columns to datetime - specifying dayfirst=True to fix the warning
if not pd.api.types.is_datetime64_dtype(data[transaction_date_col]):
    data[transaction_date_col] = pd.to_datetime(data[transaction_date_col], dayfirst=True, errors='coerce')

# Remove rows with invalid dates
data = data.dropna(subset=[transaction_date_col])

# Ensure numeric columns are correct type
numeric_cols = [transaction_amount_col, land_area_col, market_value_col]
for col in numeric_cols:
    data[col] = pd.to_numeric(data[col], errors='coerce')

# Remove rows with zero or negative values in critical columns
data = data[(data[transaction_amount_col] > 0) & (data[land_area_col] > 0)]

# Now create feature engineering columns
data['price_per_sqm'] = data[transaction_amount_col] / data[land_area_col]

# Ratio of transaction amount to market value
data['price_ratio'] = data[transaction_amount_col] / data[market_value_col]

# Days since previous transaction on same parcel
if parcel_id_col in data.columns:
    data = data.sort_values([parcel_id_col, transaction_date_col])
    data['prev_date'] = data.groupby(parcel_id_col)[transaction_date_col].shift(1)
    data['days_since_prev'] = (data[transaction_date_col] - data['prev_date']).dt.days.fillna(0)

# ------------------------------
# Step 3: Anomaly Detection
# ------------------------------

if 'price_per_sqm' in data.columns and 'price_ratio' in data.columns:
    # Select features for anomaly detection - create a copy to avoid the SettingWithCopyWarning
    features = data[['price_per_sqm', 'price_ratio']].copy()
    if 'days_since_prev' in data.columns:
        features['days_since_prev'] = data['days_since_prev']

    # Isolation Forest for anomaly detection
    model = IsolationForest(contamination=0.2, random_state=42)
    data['anomaly_score'] = model.fit_predict(features)

    # Mark anomalies
    data['is_anomaly'] = data['anomaly_score'] == -1

    # ------------------------------
    # Step 4: Results
    # ------------------------------

    cols_to_display = [parcel_id_col, transaction_date_col, 'price_per_sqm', 'price_ratio']
    if 'days_since_prev' in data.columns:
        cols_to_display.append('days_since_prev')
    cols_to_display.extend(['anomaly_score', 'is_anomaly'])
    
    # Display summary of anomalies
    anomaly_count = data['is_anomaly'].sum()
    total_count = len(data)
    print(f"\nFound {anomaly_count} anomalies out of {total_count} transactions ({anomaly_count/total_count:.1%})")
    
    # Display anomalies
    print("\nTop suspicious transactions:")
    print(data[data['is_anomaly'] == True][cols_to_display].head(10))
else:
    print("Could not create required features for anomaly detection")
