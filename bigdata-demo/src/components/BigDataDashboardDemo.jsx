import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import './BigDataDashboardDemo.css';

// Генерируем mock-данные на 30 дней вперёд
const generateMockData = () => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const day = new Date(now);
    day.setDate(now.getDate() + i);
    data.push({
      date: day.toLocaleDateString('ru-RU'),
      events: Math.floor(50 + Math.random() * 150),
      alerts: Math.floor(10 + Math.random() * 40),
    });
  }
  return data;
};

// Вспомогательные функции для статистики
const calculateStats = (arr) => {
  const n = arr.length;
  const sum = arr.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const sorted = [...arr].sort((a, b) => a - b);
  const median = n % 2 === 0
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2
    : sorted[Math.floor(n/2)];
  const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  return { min: sorted[0], max: sorted[n - 1], mean, median, stdDev };
};

const BigDataDashboardDemo = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ events: {}, alerts: {} });

  useEffect(() => {
    setTimeout(() => {
      const mock = generateMockData();
      setData(mock);
      const eventsArr = mock.map((d) => d.events);
      const alertsArr = mock.map((d) => d.alerts);
      setStats({
        events: calculateStats(eventsArr),
        alerts: calculateStats(alertsArr),
      });
    }, 800);
  }, []);

  return (
    <div className="bigdata-container">
      {/* Линейный график */}
      <div className="bigdata-chart-section">
        <h2>События и Предупреждения (Line Chart)</h2>
        {data.length === 0 ? <div className="bigdata-loading">Загрузка...</div> : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="events" stroke="#3182ce" name="События (операции пользователей)" />
              <Line type="monotone" dataKey="alerts" stroke="#e53e3e" name="Предупреждения (системные оповещения)" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* Столбчатая диаграмма */}
      <div className="bigdata-chart-section">
        <h2>Распределение Событий (Bar Chart)</h2>
        {data.length === 0 ? <div className="bigdata-loading">Загрузка...</div> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="events" fill="#3182ce" name="События" />
              <Bar dataKey="alerts" fill="#e53e3e" name="Предупреждения" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* Площадная диаграмма */}
      <div className="bigdata-chart-section">
        <h2>Кумулятивные События (Area Chart)</h2>
        {data.length === 0 ? <div className="bigdata-loading">Загрузка...</div> : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3182ce" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3182ce" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="events" stroke="#3182ce" fill="url(#colorEvents)" name="События" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* Статистики под графиками */}
      <div className="bigdata-stats">
        <h2>Ключевые характеристики</h2>
        {data.length === 0 ? <div className="bigdata-loading">Загрузка...</div> : (
          <div className="stats-grid">
            <div className="stats-card">
              <h3>События</h3>
              <p>Min: {stats.events.min}</p>
              <p>Max: {stats.events.max}</p>
              <p>Mean: {stats.events.mean.toFixed(2)}</p>
              <p>Median: {stats.events.median}</p>
              <p>Std Dev: {stats.events.stdDev.toFixed(2)}</p>
            </div>
            <div className="stats-card">
              <h3>Предупреждения</h3>
              <p>Min: {stats.alerts.min}</p>
              <p>Max: {stats.alerts.max}</p>
              <p>Mean: {stats.alerts.mean.toFixed(2)}</p>
              <p>Median: {stats.alerts.median}</p>
              <p>Std Dev: {stats.alerts.stdDev.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
      <div className="bigdata-footer">
        Демо: прогноз и визуализация ключевых метрик с вычислением основных статистик.
      </div>
    </div>
  );
};

export default BigDataDashboardDemo;