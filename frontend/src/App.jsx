
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://mottai.onrender.com/api/dashboard')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.error('データ取得失敗:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>データを読み込み中...</div>;
  }

  if (error) {
    return <div>データ取得エラー: {error}</div>;
  }

  if (!data || !Array.isArray(data.alerts)) {
    return <div>データ形式が正しくありません。</div>;
  }

  return (
    <div style={{
      padding: 24,
      fontFamily: 'sans-serif',
      maxWidth: 600,
      margin: '0 auto'
    }}>
      <header>
        <h1>🥐 MOTTAI - {data.store_name}</h1>

        <div style={{ color: '#d9534f', fontWeight: 'bold' }}>
          ⚠️ 天気アラート:
          {data.weather.summary}
          （前日比 {data.weather.temp_diff}℃）
        </div>
      </header>

      <main>
        <h2>本日売れ残り警戒のパン</h2>

        {data.alerts.map((item) => (
          <div
            key={item.item_id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              backgroundColor: '#fff9f8'
            }}
          >
            <h3>{item.item_name}</h3>

            <p>リスクレベル: {item.risk_level}</p>

            <p>
              焼成数: {item.baked_count}個
              ➜ 余剰予測: {item.predicted_unsold}個
            </p>

            <p>理由: {item.action.reason}</p>

            <button
              onClick={() =>
                alert(
                  `${item.action.target_time} に ${item.action.discount_rate}%引き シール発行を予約しました`
                )
              }
            >
              {item.action.target_time}〜
              {item.action.discount_rate}%OFFを適用
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
