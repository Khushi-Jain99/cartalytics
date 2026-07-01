import os
import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import AgglomerativeClustering
from sklearn.ensemble import RandomForestClassifier
import joblib

def main():
    print("Starting training pipeline...")
    
    # 1. Load data
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "smartcart_customers.csv"))
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Could not find smartcart_customers.csv at {csv_path}")
        
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} records from CSV.")
    
    # Fill missing values
    df["Income"] = df["Income"].fillna(df["Income"].median())
    
    # 2. Feature Engineering
    df["Age"] = 2026 - df["Year_Birth"]
    df["Dt_Customer"] = pd.to_datetime(df["Dt_Customer"], dayfirst=True)
    reference_date = df["Dt_Customer"].max()
    df["Customer_Tenure_Days"] = (reference_date - df["Dt_Customer"]).dt.days
    df["Total_Spending"] = (
        df["MntWines"] + df["MntFruits"] + df["MntMeatProducts"] + 
        df["MntFishProducts"] + df["MntSweetProducts"] + df["MntGoldProds"]
    )
    df["Total_Children"] = df["Kidhome"] + df["Teenhome"]
    
    # Calculate median tenure days to use for new predictions
    default_tenure = int(df["Customer_Tenure_Days"].median())
    print(f"Computed default customer tenure: {default_tenure} days")
    
    # Mapping categorical values
    df["Education"] = df["Education"].replace({
        "Basic": "Undergraduate", "2n Cycle": "Undergraduate",
        "Graduation": "Graduate",
        "Master": "Postgraduate", "PhD": "Postgraduate"
    })
    
    df["Living_With"] = df["Marital_Status"].replace({
        "Married": "Partner", "Together": "Partner",
        "Single": "Alone", "Divorced": "Alone",
        "Widow": "Alone", "Absurd": "Alone", "YOLO": "Alone"
    })
    
    # 3. Clean Outliers
    print(f"Data size before filtering outliers: {len(df)}")
    df_cleaned = df[(df["Age"] < 90) & (df["Income"] < 600000)].copy()
    print(f"Data size after filtering outliers: {len(df_cleaned)}")
    
    # 4. Drop columns not used directly in standardized scaling
    cols_to_drop = [
        "ID", "Year_Birth", "Marital_Status", "Kidhome", "Teenhome", "Dt_Customer",
        "MntWines", "MntFruits", "MntMeatProducts", "MntFishProducts", "MntSweetProducts", "MntGoldProds"
    ]
    df_features = df_cleaned.drop(columns=cols_to_drop)
    
    # 5. OneHotEncoder for Categorical features
    ohe = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    cat_cols = ["Education", "Living_With"]
    enc_cols = ohe.fit_transform(df_features[cat_cols])
    enc_df = pd.DataFrame(enc_cols, columns=ohe.get_feature_names_out(cat_cols), index=df_features.index)
    df_encoded = pd.concat([df_features.drop(columns=cat_cols), enc_df], axis=1)
    
    # Save the order of columns to align features at inference
    feature_columns = list(df_encoded.columns)
    print(f"Feature columns: {feature_columns}")
    
    # 6. Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df_encoded)
    
    # 7. Dimensionality Reduction (PCA)
    pca = PCA(n_components=3)
    X_pca = pca.fit_transform(X_scaled)
    
    # 8. Agglomerative Clustering (Generate target classes)
    print("Fitting Agglomerative Clustering...")
    agg_clf = AgglomerativeClustering(n_clusters=4, linkage="ward")
    labels = agg_clf.fit_predict(X_pca)
    
    # 9. Train Classifier to Learn Decision Boundaries
    print("Training Random Forest classifier on clusters...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_pca, labels)
    
    # 10. Save all artifacts
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(ohe, os.path.join(models_dir, "ohe.joblib"))
    joblib.dump(scaler, os.path.join(models_dir, "scaler.joblib"))
    joblib.dump(pca, os.path.join(models_dir, "pca.joblib"))
    joblib.dump(clf, os.path.join(models_dir, "model.joblib"))
    
    # Save reference metadata
    meta = {
        "reference_date": reference_date.strftime("%Y-%m-%d"),
        "default_tenure_days": default_tenure,
        "feature_columns": feature_columns,
        "education_categories": ohe.categories_[0].tolist(),
        "living_with_categories": ohe.categories_[1].tolist()
    }
    with open(os.path.join(models_dir, "meta.json"), "w") as f:
        json.dump(meta, f, indent=2)
        
    print("Model training and export complete. Artifacts saved in backend/models/")

if __name__ == "__main__":
    main()
