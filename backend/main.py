import os
import json
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib

app = FastAPI(title="SmartCart Predictor API", description="API serving the customer segment ML model")

# Allow CORS from any origin for ease of local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models and meta
ohe = None
scaler = None
pca = None
clf = None
meta = None

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

@app.on_event("startup")
def load_models():
    global ohe, scaler, pca, clf, meta
    try:
        meta_path = os.path.join(MODELS_DIR, "meta.json")
        ohe_path = os.path.join(MODELS_DIR, "ohe.joblib")
        scaler_path = os.path.join(MODELS_DIR, "scaler.joblib")
        pca_path = os.path.join(MODELS_DIR, "pca.joblib")
        clf_path = os.path.join(MODELS_DIR, "model.joblib")
        
        if not all(os.path.exists(p) for p in [meta_path, ohe_path, scaler_path, pca_path, clf_path]):
            raise FileNotFoundError("One or more model files are missing from the models directory. Run train_model.py first.")
            
        with open(meta_path, "r") as f:
            meta = json.load(f)
            
        ohe = joblib.load(ohe_path)
        scaler = joblib.load(scaler_path)
        pca = joblib.load(pca_path)
        clf = joblib.load(clf_path)
        
        print("Models and metadata successfully loaded.")
    except Exception as e:
        print(f"Error during startup model loading: {e}")

class CustomerInputSchema(BaseModel):
    Year_Birth: int = Field(..., ge=1940, le=2015)
    Education: str = Field(..., description="Undergraduate, Graduate, or Postgraduate")
    Marital_Status: str = Field(..., description="Single, Together, Married, Divorced, Widow")
    Income: float = Field(..., ge=0)
    Kidhome: int = Field(..., ge=0, le=3)
    Teenhome: int = Field(..., ge=0, le=3)
    Recency: int = Field(..., ge=0, le=100)
    MntWines: float = Field(0, ge=0)
    MntFruits: float = Field(0, ge=0)
    MntMeatProducts: float = Field(0, ge=0)
    MntFishProducts: float = Field(0, ge=0)
    MntSweetProducts: float = Field(0, ge=0)
    MntGoldProds: float = Field(0, ge=0)
    NumDealsPurchases: int = Field(0, ge=0)
    NumWebPurchases: int = Field(0, ge=0)
    NumCatalogPurchases: int = Field(0, ge=0)
    NumStorePurchases: int = Field(0, ge=0)
    NumWebVisitsMonth: int = Field(0, ge=0)
    Complain: int = Field(0, ge=0, le=1)
    Response: int = Field(0, ge=0, le=1)

@app.post("/api/predict")
async def predict_segment(input_data: CustomerInputSchema):
    if clf is None or scaler is None or pca is None or ohe is None or meta is None:
        raise HTTPException(status_code=503, detail="Machine learning models are not loaded on server.")
        
    try:
        # 1. Feature Engineering
        age = 2026 - input_data.Year_Birth
        total_spending = (
            input_data.MntWines + input_data.MntFruits + input_data.MntMeatProducts +
            input_data.MntFishProducts + input_data.MntSweetProducts + input_data.MntGoldProds
        )
        total_children = input_data.Kidhome + input_data.Teenhome
        customer_tenure = meta.get("default_tenure_days", 355)
        
        # 2. Map Categoricals
        education_mapped = input_data.Education
        if education_mapped not in ["Undergraduate", "Graduate", "Postgraduate"]:
            # Fallback to mappings used in notebook if other formats are received
            if education_mapped in ["Basic", "2n Cycle"]:
                education_mapped = "Undergraduate"
            elif education_mapped in ["Graduation"]:
                education_mapped = "Graduate"
            elif education_mapped in ["Master", "PhD"]:
                education_mapped = "Postgraduate"
            else:
                education_mapped = "Graduate" # sensible default
                
        marital_status = input_data.Marital_Status
        living_with = "Alone"
        if marital_status in ["Married", "Together", "Partner"]:
            living_with = "Partner"
        elif marital_status in ["Single", "Divorced", "Widow", "Alone", "Absurd", "YOLO"]:
            living_with = "Alone"
            
        # Create temporary dictionary of numerical features
        num_features = {
            "Income": input_data.Income,
            "Recency": input_data.Recency,
            "NumDealsPurchases": input_data.NumDealsPurchases,
            "NumWebPurchases": input_data.NumWebPurchases,
            "NumCatalogPurchases": input_data.NumCatalogPurchases,
            "NumStorePurchases": input_data.NumStorePurchases,
            "NumWebVisitsMonth": input_data.NumWebVisitsMonth,
            "Complain": input_data.Complain,
            "Response": input_data.Response,
            "Age": age,
            "Customer_Tenure_Days": customer_tenure,
            "Total_Spending": total_spending,
            "Total_Children": total_children
        }
        
        # Create dataframe for categorical encoder
        cat_df = pd.DataFrame([{"Education": education_mapped, "Living_With": living_with}])
        enc_cols = ohe.transform(cat_df)
        enc_df = pd.DataFrame(enc_cols, columns=ohe.get_feature_names_out(["Education", "Living_With"]))
        
        # Create full dataframe of numerical features
        num_df = pd.DataFrame([num_features])
        
        # Combine numerical and categorical one-hot features
        full_df = pd.concat([num_df, enc_df], axis=1)
        
        # Align column order with feature columns in training
        feature_order = meta["feature_columns"]
        full_df = full_df[feature_order]
        
        # 3. Standardize scaling
        scaled_features = scaler.transform(full_df)
        
        # 4. Dimensionality Reduction (PCA)
        pca_features = pca.transform(scaled_features)
        
        # 5. Predict Cluster Class using Classifier
        cluster_pred = int(clf.predict(pca_features)[0])
        probabilities = clf.predict_proba(pca_features)[0].tolist()
        
        # 6. Map Model Cluster back to Frontend Segment ID
        # Cluster 0 -> 1 (Deal Seekers)
        # Cluster 1 -> 0 (Premium Loyalists)
        # Cluster 2 -> 2 (Budget Starters)
        # Cluster 3 -> 3 (Rising Stars)
        cluster_to_segment = {0: 1, 1: 0, 2: 2, 3: 3}
        segment_id = cluster_to_segment.get(cluster_pred, 1)
        
        # Map model probabilities to frontend segment probabilities
        # scores index: 0 = Premium, 1 = Deal, 2 = Budget, 3 = Rising
        # model probabilities: prob[0]=Cluster 0 (Deal), prob[1]=Cluster 1 (Premium), prob[2]=Cluster 2 (Budget), prob[3]=Cluster 3 (Rising)
        scores = [0.0] * 4
        scores[0] = probabilities[1] # Premium
        scores[1] = probabilities[0] # Deal
        scores[2] = probabilities[2] # Budget
        scores[3] = probabilities[3] # Rising
        
        # Normalize just in case
        total_scores = sum(scores) or 1.0
        scores = [s / total_scores for s in scores]
        
        # Compute confidence as percentage
        confidence = int(round(scores[segment_id] * 100))
        
        return {
            "segmentId": segment_id,
            "confidence": confidence,
            "scores": scores
        }
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "ok", "models_loaded": clf is not None}
