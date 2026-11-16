# mottai/backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MOTTAI API")

# C君のフロントエンドからの通信を許可する設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/dashboard")
def get_dashboard():
    # まずは固定のモックデータを返す
    return {
        "store_name": "焼きたてパン 陽だまり",
        "weather": {
            "summary": "夕方から本降りの雨",
            "temp_max": 16.5,
            "temp_diff": -4.2,
            "rain_evening": True
        },
        "alerts": [
            {
                "item_id": 101,
                "item_name": "自家製カレーパン",
                "price": 240,
                "baked_count": 50,
                "predicted_unsold": 18,
                "risk_level": "HIGH",
                "action": {
                    "discount_rate": 30,
                    "target_time": "15:00",
                    "reason": "雨による夕方の客足減＋急激な冷え込み"
                }
            },
            {
                "item_id": 102,
                "item_name": "ミックスサンドイッチ",
                "price": 380,
                "baked_count": 30,
                "predicted_unsold": 12,
                "risk_level": "HIGH",
                "action": {
                    "discount_rate": 40,
                    "target_time": "14:30",
                    "reason": "本日中消費期限。雨天時の調理パン需要減"
                }
            }
        ]
    }