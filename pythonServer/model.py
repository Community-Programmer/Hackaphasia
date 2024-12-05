import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

crop_recommendation = pd.read_csv('./dataset/Crop_recommendation.csv')

X_crop = crop_recommendation[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]]
y_crop = crop_recommendation["label"]

y_crop_encoded = y_crop.astype("category").cat.codes
label_mapping = dict(enumerate(crop_recommendation["label"].astype("category").cat.categories))
print(label_mapping)

X_train_crop, X_test_crop, y_train_crop, y_test_crop = train_test_split(X_crop, y_crop_encoded, test_size=0.2, random_state=42)

rf_crop_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_crop_model.fit(X_train_crop, y_train_crop)

y_pred_crop = rf_crop_model.predict(X_test_crop)

crop_accuracy = accuracy_score(y_test_crop, y_pred_crop)
crop_classification_report = classification_report(y_test_crop, y_pred_crop, target_names=y_crop.astype("category").cat.categories)

print(f"Model Accuracy: {crop_accuracy}")
print("Classification Report:\n", crop_classification_report)

joblib.dump(rf_crop_model, 'crop_recommendation_model.pkl')