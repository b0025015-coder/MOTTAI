# mottai/ml/predictor.py
import joblib
import pandas as pd

class BreadPredictor:
    def __init__(self, model_path="model.pkl"):
        self.model = joblib.load(model_path)

    def predict_unsold(self, item_id: int, day_of_week: int, is_weekend: int, temp_max: float, is_rainy: int, baked_count: int) -> int:
        df_input = pd.DataFrame([{
            "item_id": item_id,
            "day_of_week": day_of_week,
            "is_weekend": is_weekend,
            "temp_max": temp_max,
            "is_rainy": is_rainy,
            "baked_count": baked_count
        }])
        pred = self.model.predict(df_input)[0]
        return max(0, int(round(pred))) # 0個未満にはならないよう補正

# --- A君が自分で単体テストするためのコード ---
if __name__ == "__main__":
    print("AIモデルの読み込みテストを開始します...")
    predictor = BreadPredictor("model.pkl")
    
    # テスト用データ：月曜(0)、平日(0)、気温15度、雨(1)、50個焼成
    result = predictor.predict_unsold(
        item_id=101,
        day_of_week=0,
        is_weekend=0,
        temp_max=15.0,
        is_rainy=1,
        baked_count=50
    )
    print(f"テスト予測成功！ 雨の日の予測売れ残り数: {result} 個")