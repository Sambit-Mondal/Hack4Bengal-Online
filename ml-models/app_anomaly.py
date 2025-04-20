from flask import Flask, request, jsonify
from sklearn.ensemble import IsolationForest
import pandas as pd
from datetime import datetime

app = Flask(__name__)

# Historical data for anomaly detection (you should replace this with real data)
historical_data = pd.DataFrame({
    "price_per_sqm": [3000, 3200, 3100, 2900, 3050, 4500, 10000],
    "price_ratio": [0.9, 1.0, 1.1, 0.95, 1.2, 1.0, 1.8],
    "days_since_prev": [365, 180, 400, 220, 300, 60, 10]
})

# Train the model on startup
model = IsolationForest(contamination=0.2, random_state=42)
model.fit(historical_data)

@app.route("/", methods=["GET", "POST"])
def check_fraud():
    if request.method == "GET":
        # Return a simple form without predefined values
        return """
        <html>
        <head>
            <title>Land Transaction Anomaly Check</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .form-group { margin-bottom: 15px; }
                label { display: block; margin-bottom: 5px; font-weight: bold; }
                input { width: 100%; padding: 8px; box-sizing: border-box; }
                button { background-color: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer; }
                button:hover { background-color: #45a049; }
            </style>
        </head>
        <body>
            <h1>Land Transaction Anomaly Detection</h1>
            <p>Enter transaction details to check for potential anomalies:</p>
            
            <form method="post" action="/">
                <div class="form-group">
                    <label for="parcel_id">Parcel ID:</label>
                    <input type="text" id="parcel_id" name="parcel_id" placeholder="e.g., P123456" required>
                </div>
                
                <div class="form-group">
                    <label for="transaction_date">Transaction Date:</label>
                    <input type="date" id="transaction_date" name="transaction_date" required>
                </div>
                
                <div class="form-group">
                    <label for="sale_price">Sale Price (₹):</label>
                    <input type="number" id="sale_price" name="sale_price" placeholder="e.g., 350000" required>
                </div>
                
                <div class="form-group">
                    <label for="market_value">Market Value (₹):</label>
                    <input type="number" id="market_value" name="market_value" placeholder="e.g., 320000" required>
                </div>
                
                <div class="form-group">
                    <label for="land_area">Land Area (sq.m):</label>
                    <input type="number" id="land_area" name="land_area" placeholder="e.g., 100" step="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="days_since_prev">Days Since Previous Transaction:</label>
                    <input type="number" id="days_since_prev" name="days_since_prev" placeholder="e.g., 180" value="0">
                </div>
                
                <button type="submit">Check Transaction</button>
            </form>
        </body>
        </html>
        """
    else:  # POST request
        # Fix the data handling to properly handle forms
        if request.is_json:
            data = request.json
        else:
            data = request.form.to_dict()

        try:
            # Extract values
            parcel_id = data.get("parcel_id")
            transaction_date = data.get("transaction_date")
            sale_price = data.get("sale_price")
            market_value = data.get("market_value")
            land_area = data.get("land_area")
            days_since_prev = data.get("days_since_prev", "0")

            # Convert to appropriate types with validation
            if not transaction_date:
                return jsonify({"error": "Transaction date is required"}), 400
            
            transaction_date = datetime.strptime(transaction_date, "%Y-%m-%d")
            
            try:
                sale_price = float(sale_price)
                if sale_price <= 0:
                    return jsonify({"error": "Sale price must be positive"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid sale price"}), 400
                
            try:
                market_value = float(market_value)
                if market_value <= 0:
                    return jsonify({"error": "Market value must be positive"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid market value"}), 400
                
            try:
                land_area = float(land_area)
                if land_area <= 0:
                    return jsonify({"error": "Land area must be positive"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid land area"}), 400
                
            try:
                days_since_prev = float(days_since_prev)
            except (ValueError, TypeError):
                days_since_prev = 0

            # Calculate features
            price_per_sqm = sale_price / land_area
            price_ratio = sale_price / market_value

            # Predict using the trained model
            feature_df = pd.DataFrame([[price_per_sqm, price_ratio, days_since_prev]],
                                      columns=["price_per_sqm", "price_ratio", "days_since_prev"])
            prediction = model.predict(feature_df)[0]
            is_anomaly = prediction == -1

            # For API requests
            if request.is_json:
                return jsonify({
                    "risk_level": "High Risk" if is_anomaly else "Low Risk",
                    "parcel_id": parcel_id,
                    "price_per_sqm": round(price_per_sqm, 2),
                    "price_ratio": round(price_ratio, 2),
                    "days_since_prev": days_since_prev,
                    "is_anomaly": is_anomaly
                })
            # For form submissions, return HTML response
            else:
                risk_color = "#ffdddd" if is_anomaly else "#ddffdd"
                risk_level = "High Risk" if is_anomaly else "Low Risk"
                
                return f"""
                <html>
                <head>
                    <title>Anomaly Detection Result</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .result {{ background-color: {risk_color}; padding: 20px; border-radius: 5px; margin-bottom: 20px; }}
                        .back-button {{ background-color: #4CAF50; color: white; padding: 10px 15px; 
                                      border: none; text-decoration: none; display: inline-block; }}
                        table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
                        th, td {{ padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }}
                        th {{ background-color: #f2f2f2; }}
                    </style>
                </head>
                <body>
                    <h1>Transaction Analysis Result</h1>
                    
                    <div class="result">
                        <h2>Risk Assessment: {risk_level}</h2>
                        <p>This transaction has been flagged as {"suspicious" if is_anomaly else "normal"}.</p>
                    </div>
                    
                    <h3>Transaction Details:</h3>
                    <table>
                        <tr><th>Parcel ID</th><td>{parcel_id}</td></tr>
                        <tr><th>Transaction Date</th><td>{transaction_date.strftime('%Y-%m-%d')}</td></tr>
                        <tr><th>Sale Price</th><td>₹{sale_price:,.2f}</td></tr>
                        <tr><th>Market Value</th><td>₹{market_value:,.2f}</td></tr>
                        <tr><th>Land Area</th><td>{land_area:,.2f} sq.m</td></tr>
                        <tr><th>Price per sq.m</th><td>₹{price_per_sqm:,.2f}</td></tr>
                        <tr><th>Price to Market Ratio</th><td>{price_ratio:.2f}</td></tr>
                        <tr><th>Days Since Previous</th><td>{int(days_since_prev)}</td></tr>
                    </table>
                    
                    <p><a href="/" class="back-button">Check Another Transaction</a></p>
                </body>
                </html>
                """

        except ValueError as e:
            return jsonify({"error": "Invalid input format: " + str(e)}), 400
        except ZeroDivisionError:
            return jsonify({"error": "Cannot divide by zero"}), 400
        except Exception as e:
            return jsonify({"error": "Unexpected error: " + str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)