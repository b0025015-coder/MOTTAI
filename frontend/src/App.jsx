// mottai/frontend/src/App.jsx
import { useState, useEffect } from 'react';

const mocdata = {
  "store_id": "bakery_001",
  "store_name": "焼きたてパンの店 陽だまり",
  "forecast_date": "2026-11-09",
  "weather": {
    "summary": "雨のち曇り",
    "temp_max": 16.5,
    "temp_diff": -4.2,
    "rain_risk_evening": true
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
        "timing": "15:00",
        "discount_rate": 30,
        "discounted_price": 168,
        "reason": "16時以降の降雨により、夕方の会社帰り需要が大幅減の見込み"
      }
    },
    {
      "item_id": 102,
      "item_name": "ミックスサンドイッチ",
      "price": 380,
      "baked_count": 30,
      "predicted_unsold": 10,
      "risk_level": "HIGH",
      "action": {
        "timing": "14:30",
        "discount_rate": 40,
        "discounted_price": 228,
        "reason": "消費期限が本日18時まで。湿度の高まりにより調理パンの動き鈍化予測"
      }
    }
  ]
}

function App() {
  const [data, setData] = useState(mocdata);

  useEffect(() => {
    // B君のAPIを叩いてデータを取得する
    fetch('https://mottai.onrender.com/api/dashboard')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("データ取得失敗:", err));
  }, []);

  if (!data) return <div style={{ padding: 20 }}>読み込み中...</div>;

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <header style={{ borderBottom: '2px solid #eee', paddingBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>🥐 MOTTAI - {data.store_name}</h1>
        <div style={{ marginTop: 8, color: '#d9534f', fontWeight: 'bold' }}>
          ⚠️ 天気アラート: {data.weather.summary}（前日比 {data.weather.temp_diff}℃）
        </div>
      </header>

      <main style={{ marginTop: 20 }}>
        <h2>本日売れ残り警戒のパン</h2>
        {data.alerts.map((item) => (
          <div key={item.item_id} style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            backgroundColor: '#fff9f8'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{item.item_name}</h3>
              <span style={{ backgroundColor: '#ff4d4f', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>
                {item.risk_level}
              </span>
            </div>

            <p style={{ margin: '8px 0', color: '#666', fontSize: 14 }}>
              焼成数: {item.baked_count}個 ➜ <strong>余剰予測: {item.predicted_unsold}個</strong>
            </p>
            <p style={{ margin: '8px 0', fontSize: 13, color: '#888' }}>
              理由: {item.action.reason}
            </p>

            <button
              onClick={() => alert(`${item.action.target_time} に ${item.action.discount_rate}%引き シール発行を予約しました`)}
              style={{
                width: '100%',
                padding: '10px 0',
                backgroundColor: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: 8
              }}
            >
              {item.action.target_time} 〜 {item.action.discount_rate}%OFF を適用
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;