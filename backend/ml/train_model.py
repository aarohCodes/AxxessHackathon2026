"""
MaternalGuard — Model Training Pipeline
Trains 5 XGBoost classifiers (one per postpartum outcome) and saves them.
"""

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import roc_auc_score
from xgboost import XGBClassifier
import joblib

TARGETS = [
    "pph_outcome",
    "preeclampsia_postpartum",
    "sepsis_outcome",
    "cardiomyopathy_outcome",
    "ppd_outcome",
]

TARGET_LABELS = {
    "pph_outcome": "Postpartum Hemorrhage",
    "preeclampsia_postpartum": "Postpartum Preeclampsia",
    "sepsis_outcome": "Postpartum Sepsis",
    "cardiomyopathy_outcome": "Peripartum Cardiomyopathy",
    "ppd_outcome": "Postpartum Depression",
}

CATEGORICAL_FEATURES = ["race_ethnicity", "insurance_type", "mode_of_delivery"]


def train_models():
    data_dir = os.path.join(os.path.dirname(__file__), "saved_models")
    csv_path = os.path.join(data_dir, "synthetic_patients.csv")

    if not os.path.exists(csv_path):
        print("Data file not found. Generating synthetic data first...")
        from synthetic_data import generate_data
        generate_data()

    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} records from {csv_path}\n")

    # Separate features and targets
    feature_cols = [c for c in df.columns if c not in TARGETS]
    X = df[feature_cols].copy()
    y_dict = {t: df[t] for t in TARGETS}

    # Encode categoricals
    label_encoders = {}
    for col in CATEGORICAL_FEATURES:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        label_encoders[col] = le

    # Save feature names and label encoders
    joblib.dump(label_encoders, os.path.join(data_dir, "label_encoders.joblib"))
    joblib.dump(feature_cols, os.path.join(data_dir, "feature_names.joblib"))

    # Train-test split
    X_train, X_test, indices_train, indices_test = train_test_split(
        X, np.arange(len(X)), test_size=0.2, random_state=42
    )

    print("=" * 60)
    print("TRAINING RESULTS")
    print("=" * 60)

    for target_name in TARGETS:
        y = y_dict[target_name]
        y_train = y.iloc[indices_train]
        y_test = y.iloc[indices_test]

        # Calculate scale_pos_weight for imbalanced classes
        n_pos = y_train.sum()
        n_neg = len(y_train) - n_pos
        spw = n_neg / max(n_pos, 1)

        model = XGBClassifier(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.1,
            scale_pos_weight=spw,
            eval_metric="logloss",
            random_state=42,
            use_label_encoder=False,
            verbosity=0,
        )

        model.fit(X_train, y_train)

        # Evaluate
        y_pred_proba = model.predict_proba(X_test)[:, 1]
        try:
            auc = roc_auc_score(y_test, y_pred_proba)
        except ValueError:
            auc = 0.0

        label = TARGET_LABELS[target_name]
        print(f"\n{label} ({target_name})")
        print(f"  Train positives: {y_train.sum()}/{len(y_train)} ({y_train.mean():.2%})")
        print(f"  Test  positives: {y_test.sum()}/{len(y_test)} ({y_test.mean():.2%})")
        print(f"  AUC-ROC: {auc:.4f}")

        # Save model
        model_path = os.path.join(data_dir, f"{target_name}_model.joblib")
        joblib.dump(model, model_path)
        print(f"  Saved → {model_path}")

    print("\n" + "=" * 60)
    print("All models trained and saved successfully!")
    print("=" * 60)


if __name__ == "__main__":
    train_models()
