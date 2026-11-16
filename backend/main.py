# mottai/backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from datetime import datetime
from predictor import BreadPredictor

app = FastAPI(title="MOTTAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AIモデルの読み込み
predictor = BreadPredictor("model.pkl")

# 想定店舗（山口市周辺の座標例）
LATITUDE = 34.178
LONGITUDE = 131.473

@app.get("/api/dashboard")
def get_dashboard():
    # 1. リアル気象データの取得（Open-Meteo）
    weather_url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": LATITUDE,
        "longitude": LONGITUDE,
        "daily": ["weather_code", "temperature_2m_max", "precipitation_sum"],
        "timezone": "Asia/Tokyo"
    }
    res = requests.get(weather_url, params=params).json()
    
    today_temp_max = res["daily"]["temperature_2m_max"][0]
    today_rain_sum = res["daily"]["precipitation_sum"][0]
    is_rainy = 1 if today_rain_sum > 1.0 else 0

    now = datetime.now()
    day_of_week = now.weekday()
    is_weekend = 1 if day_of_week in [5, 6] else 0

    # 2. 店舗の商品一覧（本日の仕込み数）
    items = [
        {"item_id": 101, "item_name": "自家製カレーパン", "baked_count": 50, "base_price": 240},
        {"item_id": 102, "item_name": "ミックスサンドイッチ", "baked_count": 30, "base_price": 380},
    ]

    # 3. AIによる予測と割引判定
    alerts = []
    for item in items:
        # A君のAIモデルで余剰数を予測
        unsold_pred = predictor.predict_unsold(
            item_id=item["item_id"],
            day_of_week=day_of_week,
            is_weekend=is_weekend,
            temp_max=today_temp_max,
            is_rainy=is_rainy,
            baked_count=item["baked_count"]
        )

        # 売れ残り率が30%以上なら警告
        unsold_rate = unsold_pred / item["baked_count"]
        risk_level = "HIGH" if unsold_rate >= 0.3 else "LOW"

        # 割引ルールの適用
        discount_rate = 30 if unsold_rate >= 0.3 else 10
        target_time = "15:00" if unsold_rate >= 0.3 else "17:00"

        alerts.append({
            "item_id": item["item_id"],
            "item_name": item["item_name"],
            "price": item["base_price"],
            "baked_count": item["baked_count"],
            "predicted_unsold": unsold_pred,
            "risk_level": risk_level,
            "action": {
                "discount_rate": discount_rate,
                "target_time": target_time,
                "reason": f"予想降水量 {today_rain_sum}mm・最高気温 {today_temp_max}℃ による需要減予測"
            }
        })

    return {
        "store_name": "焼きたてパン 陽だまり",
        "weather": {
            "summary": "雨天警戒" if is_rainy else "通常天候",
            "temp_max": today_temp_max,
            "precipitation": today_rain_sum
        },
        "alerts": alerts
    }