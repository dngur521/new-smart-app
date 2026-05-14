const lerp = (a, b, t) => Math.round(a + (b - a) * Math.max(0, Math.min(1, t)));

const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const interpolateStops = (value, stops) => {
  if (value === null || value === undefined || isNaN(value)) return '#9e9e9e';
  if (value <= stops[0].at) return stops[0].color;
  if (value >= stops[stops.length - 1].at) return stops[stops.length - 1].color;
  for (let i = 0; i < stops.length - 1; i++) {
    if (value >= stops[i].at && value <= stops[i + 1].at) {
      const t = (value - stops[i].at) / (stops[i + 1].at - stops[i].at);
      const [r1, g1, b1] = hexToRgb(stops[i].color);
      const [r2, g2, b2] = hexToRgb(stops[i + 1].color);
      return `rgb(${lerp(r1, r2, t)}, ${lerp(g1, g2, t)}, ${lerp(b1, b2, t)})`;
    }
  }
  return stops[stops.length - 1].color;
};

// 실내 온도: 쾌적 구간 22-26°C 기준
export const getTempColor = (temp) => interpolateStops(temp, [
  { at: 16, color: '#1565c0' }, // 추움 (파랑)
  { at: 22, color: '#1976d2' }, // 서늘
  { at: 26, color: '#4caf50' }, // 쾌적 (초록)
  { at: 30, color: '#ff9800' }, // 더움 (주황)
  { at: 35, color: '#f44336' }, // 매우 더움 (빨강)
]);

// 실내 습도: 쾌적 구간 40-60% 기준
export const getHumidityColor = (humidity) => interpolateStops(humidity, [
  { at: 20, color: '#f44336' }, // 매우 건조
  { at: 30, color: '#ff9800' }, // 건조
  { at: 40, color: '#ffc107' }, // 약간 건조
  { at: 50, color: '#4caf50' }, // 쾌적 (초록)
  { at: 65, color: '#8bc34a' }, // 약간 습함
  { at: 75, color: '#ff9800' }, // 습함
  { at: 85, color: '#f44336' }, // 매우 습함
]);

// 한국 PM2.5 기준: 좋음 0-15, 보통 16-35, 나쁨 36-75, 매우나쁨 76+
export const getPM25Color = (pm25) => interpolateStops(pm25, [
  { at: 0,   color: '#4caf50' },
  { at: 15,  color: '#4caf50' },
  { at: 35,  color: '#ffc107' },
  { at: 75,  color: '#ff6d00' },
  { at: 120, color: '#f44336' },
]);

// 한국 PM10 기준: 좋음 0-30, 보통 31-80, 나쁨 81-150, 매우나쁨 151+
export const getPM10Color = (pm10) => interpolateStops(pm10, [
  { at: 0,   color: '#4caf50' },
  { at: 30,  color: '#4caf50' },
  { at: 80,  color: '#ffc107' },
  { at: 150, color: '#ff6d00' },
  { at: 200, color: '#f44336' },
]);

// PM1.0 비공식 (PM2.5 대비 약 60% 수준으로 적용)
export const getPM1Color = (pm1) => interpolateStops(pm1, [
  { at: 0,  color: '#4caf50' },
  { at: 9,  color: '#4caf50' },
  { at: 21, color: '#ffc107' },
  { at: 45, color: '#ff6d00' },
  { at: 75, color: '#f44336' },
]);
