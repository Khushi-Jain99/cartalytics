import urllib.request
import json

url = "http://127.0.0.1:8000/api/predict"
data = {
    "Year_Birth": 1975,
    "Education": "Graduate",
    "Marital_Status": "Married",
    "Income": 72400.0,
    "Kidhome": 0,
    "Teenhome": 0,
    "Recency": 30,
    "MntWines": 500,
    "MntFruits": 50,
    "MntMeatProducts": 300,
    "MntFishProducts": 80,
    "MntSweetProducts": 50,
    "MntGoldProds: ": 100, # Typo/extra, but the pydantic model has gold
    "MntGoldProds": 100,
    "NumDealsPurchases": 1,
    "NumWebPurchases": 6,
    "NumCatalogPurchases": 6,
    "NumStorePurchases": 9,
    "NumWebVisitsMonth": 3,
    "Complain": 0,
    "Response": 0
}

req = urllib.request.Request(
    url, 
    data=json.dumps(data).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode('utf-8'))
        print("Success! Prediction output:")
        print(json.dumps(res, indent=2))
except Exception as e:
    print(f"Failed to connect or predict: {e}")
