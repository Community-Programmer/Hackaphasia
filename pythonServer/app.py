from fastapi import FastAPI, HTTPException
import joblib
import requests
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

model = joblib.load('crop_recommendation_model.pkl')

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
OPENWEATHER_API_KEY = '1ee80fe86619a2df2d56593f5c6d8e57' 
OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

label_mapping = {
    0: {"name": "apple", "image": "https://m.media-amazon.com/images/I/61vaD-P9BoL._AC_UF1000,1000_QL80_.jpg"},
    1: {"name": "banana", "image": "https://www.happysprout.com/wp-content/uploads/sites/4/2021/02/banana-tree-with-ripe-fruit.jpg"},
    2: {"name": "blackgram", "image": "https://apseeds.ap.gov.in/Assets/Images/inner-pages-img/Blackgram.jpg"},
    3: {"name": "chickpea", "image": "https://gruloda.com/wp-content/uploads/2023/03/The-Ultimate-Guide-to-Growing-Chickpeas-min.jpg"},
    4: {"name": "coconut", "image": "https://cdn.britannica.com/67/143467-050-D161947F/Coconut-palm.jpg"},
    5: {"name": "coffee", "image": "https://methodicalcoffee.com/cdn/shop/articles/coffee_beans_1024x.jpg?v=1690475666"},
    6: {"name": "cotton", "image": "https://www.theenvironmentalblog.org/wp-content/uploads/2024/10/Cotton-from-Plant.jpeg"},
    7: {"name": "grapes", "image": "https://seasol.com.au/wp-content/uploads/2021/09/31490001_L-e1652140275372.jpg"},
    8: {"name": "jute", "image": "https://img.ehowcdn.com/640/cme-data/getty%2F83bc254ce0ae4fdcbbeb22378de615fa.jpg"},
    9: {"name": "kidneybeans", "image": "https://minnetonkaorchards.com/wp-content/uploads/2022/09/Kidney-Bean-Pods-SS-1447247864.jpg"},
    10: {"name": "lentil", "image": "https://www.nativeseeds.org/cdn/shop/products/Raramuri_TarahumaraPinks_Lentils_LE002_550x.jpg?v=1660689386"},
    11: {"name": "maize", "image": "https://agritech.tnau.ac.in/agriculture//maize-272894_1280.jpg"},
    12: {"name": "mango", "image": "https://m.media-amazon.com/images/I/71u-Dvj9FkL.jpg"},
    13: {"name": "mothbeans", "image": "https://thepaharilife.com/cdn/shop/products/Soybeans_300x300.jpg?v=1597947077"},
    14: {"name": "mungbean", "image": "https://www.shutterstock.com/image-photo/mung-bean-crop-planting-thailand-260nw-1250959141.jpg"},
    15: {"name": "muskmelon", "image": "https://plantic.in/pimg/pl-muskmelon-f1-hybrid-nirupama/pl-muskmelon-f1-hybrid-nirupama1.png"},
    16: {"name": "orange", "image": "https://plantparadise.in/cdn/shop/files/valencia_orange_tree_2000x.jpg2.jpg?v=1691936340"},
    17: {"name": "papaya", "image": "https://m.media-amazon.com/images/I/61NHIM4UzqL._AC_UF1000,1000_QL80_.jpg"},
    18: {"name": "pigeonpeas", "image": "https://i.pinimg.com/736x/f5/07/0a/f5070a9150c58be51e3843de3f613fe2.jpg"},
    19: {"name": "pomegranate", "image": "https://nurserylive.com/cdn/shop/products/nurserylive-pomegranate-annar-anar-grafted-plant-368942.jpg?v=1679750942"},
    20: {"name": "rice", "image": "https://eos.com/wp-content/uploads/2023/04/rice-field.jpg.webp"},
    21: {"name": "watermelon", "image": "https://bonnieplants.com/cdn/shop/articles/BONNIE_watermelon_iStock-181067852-1800px_28032150-26a6-4cda-be5b-c4408112e3a6.jpg?v=1642541981"},
}

@app.get("/")
def home():
    return {"message": "Welcome to the Crop Recommendation API"}


@app.post("/recommend_crop/")
def recommend_crop(data: dict):
    """
    Crop Recommendation API
    Args:
    - JSON Input:
        - lat (float): Latitude of the location
        - lon (float): Longitude of the location
        - N (int): Nitrogen content in soil
        - P (int): Phosphorus content in soil
        - K (int): Potassium content in soil
        - ph (float): Soil pH value
        - rainfall (float): Rainfall in mm
    Returns:
    - Recommended crop based on input features.
    """
    try:
        lat = data.get("lat")
        lon = data.get("lon")
        N = data.get("N")
        P = data.get("P")
        K = data.get("K")
        ph = data.get("ph")
        rainfall = data.get("rainfall")
        
        if not all([lat, lon, N, P, K, ph, rainfall]):
            raise HTTPException(status_code=400, detail="Missing required input parameters.")
        
        weather_response = requests.get(
            OPENWEATHER_URL,
            params={
                'lat': lat,
                'lon': lon,
                'appid': OPENWEATHER_API_KEY,
                'units': 'metric'
            }
        )
        weather_data = weather_response.json()
        if weather_response.status_code != 200:
            raise HTTPException(status_code=weather_response.status_code, detail=weather_data.get('message', 'Error fetching weather data'))
        
        temperature = weather_data['main']['temp']
        humidity = weather_data['main']['humidity']
    
        input_data = pd.DataFrame([{
            'N': N,
            'P': P,
            'K': K,
            'temperature': temperature,
            'humidity': humidity,
            'ph': ph,
            'rainfall': rainfall
        }])
    
        prediction = model.predict(input_data)[0]
        
        crop_info = label_mapping.get(prediction, {"name": "Unknown Crop", "image": ""})
        return {
                    "recommended_crop": crop_info["name"],
                    "crop_image_url": crop_info["image"],
                    "weather_data": {
                        "temperature": float(temperature),  # Ensure it's a Python float
                        "humidity": int(humidity)          # Ensure it's a Python int
                    },
                    "input_data": {
                        "N": int(N),
                        "P": int(P),
                        "K": int(K),
                        "ph": float(ph),
                        "rainfall": float(rainfall)
                    }
                }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")
