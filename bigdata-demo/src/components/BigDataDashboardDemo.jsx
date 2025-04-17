import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
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
  
  // Создаем общий тренд с сезонностью и некоторой случайностью
  const baseTrend = Array(30).fill().map((_, i) => 
    80 + 20 * Math.sin(i / 5) + i * 1.5
  );
  
  for (let i = 0; i < 30; i++) {
    const day = new Date(now);
    day.setDate(now.getDate() + i);
    
    // Добавляем случайность, но сохраняем основной тренд
    const randomFactor = Math.random() * 30 - 15; // случайное число от -15 до 15
    const events = Math.max(20, Math.floor(baseTrend[i] + randomFactor));
    
    // Коррелируем alerts с events, но с меньшим масштабом и некоторым шумом
    const correlationNoise = Math.random() * 10 - 5;
    const alerts = Math.max(5, Math.floor(events * 0.3 + correlationNoise));
    
    data.push({
      date: day.toLocaleDateString('ru-RU'),
      events: events,
      alerts: alerts,
      // Добавляем еще один метрический параметр для более богатой аналитики
      efficiency: Math.round(100 - (alerts / events * 100)),
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
  
  // Добавляем квартили для более полной статистики
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  
  return { 
    min: sorted[0], 
    max: sorted[n - 1], 
    mean, 
    median, 
    stdDev,
    q1,
    q3,
    iqr
  };
};

// Функция выполнения линейной регрессии
const linearRegression = (xData, yData) => {
  const n = xData.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += xData[i];
    sumY += yData[i];
    sumXY += xData[i] * yData[i];
    sumXX += xData[i] * xData[i];
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // R-квадрат (коэффициент детерминации)
  const yMean = sumY / n;
  let totalSS = 0;
  let residualSS = 0;
  
  for (let i = 0; i < n; i++) {
    totalSS += Math.pow(yData[i] - yMean, 2);
    const yPred = slope * xData[i] + intercept;
    residualSS += Math.pow(yData[i] - yPred, 2);
  }
  
  const rSquared = 1 - (residualSS / totalSS);
  
  return {
    slope,
    intercept,
    rSquared,
    predict: (x) => slope * x + intercept
  };
};

// Функция обнаружения аномалий (простой метод Z-score)
const detectAnomalies = (data, threshold = 2) => {
  const values = [...data];
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  );
  
  return values.map((value, index) => {
    const zScore = Math.abs((value - mean) / stdDev);
    return { value, index, isAnomaly: zScore > threshold };
  });
};

// Функция прогнозирования на основе скользящего среднего
const movingAverage = (data, windowSize) => {
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      result.push(null); // Не можем вычислить полное окно
    } else {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        sum += data[i - j];
      }
      result.push(sum / windowSize);
    }
  }
  
  return result;
};

const BigDataDashboardDemo = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ events: {}, alerts: {}, efficiency: {} });
  const [predictions, setPredictions] = useState({ events: [], alerts: [] });
  const [anomalies, setAnomalies] = useState({ events: [], alerts: [] });
  const [regressionData, setRegressionData] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const mock = generateMockData();
      setData(mock);
      
      // Извлекаем массивы значений для анализа
      const eventsArr = mock.map((d) => d.events);
      const alertsArr = mock.map((d) => d.alerts);
      const efficiencyArr = mock.map((d) => d.efficiency);
      
      // Расчет базовых статистик
      setStats({
        events: calculateStats(eventsArr),
        alerts: calculateStats(alertsArr),
        efficiency: calculateStats(efficiencyArr)
      });
      
      // Обнаружение аномалий
      setAnomalies({
        events: detectAnomalies(eventsArr, 1.8),
        alerts: detectAnomalies(alertsArr, 1.8)
      });
      
      // Прогнозирование методом скользящего среднего
      const maPeriod = 5; // период для скользящего среднего
      setPredictions({
        events: movingAverage(eventsArr, maPeriod),
        alerts: movingAverage(alertsArr, maPeriod)
      });
      
      // Линейная регрессия между events и alerts
      const indices = Array.from({ length: eventsArr.length }, (_, i) => i);
      const eventsRegression = linearRegression(indices, eventsArr);
      const alertsRegression = linearRegression(indices, alertsArr);
      
      setRegressionData({
        events: eventsRegression,
        alerts: alertsRegression
      });
      
      // Создаем данные для графика корреляции
      const correlation = mock.map(d => ({
        events: d.events,
        alerts: d.alerts
      }));
      setCorrelationData(correlation);
      
    }, 800);
  }, []);

  // Создаем данные для отображения линии регрессии events
  const getEventsRegressionLine = () => {
    if (!regressionData || !data.length) return [];
    
    const result = [];
    for (let i = 0; i < data.length; i++) {
      result.push({
        date: data[i].date,
        regEvents: regressionData.events.predict(i)
      });
    }
    return result;
  };
  
  // Создаем данные для отображения линии регрессии alerts
  const getAlertsRegressionLine = () => {
    if (!regressionData || !data.length) return [];
    
    const result = [];
    for (let i = 0; i < data.length; i++) {
      result.push({
        date: data[i].date,
        regAlerts: regressionData.alerts.predict(i)
      });
    }
    return result;
  };

  // Функция для форматирования чисел, чтобы они не были слишком длинными
  const formatNumber = (num) => {
    return typeof num === 'number' ? num.toFixed(2) : 'N/A';
  };

  return (
    <div className="bigdata-container">
      {/* Линейный график с прогнозной линией */}
      <div className="bigdata-chart-section">
        <h2>События и Предупреждения с Прогнозом (Line Chart)</h2>
        {data.length === 0 ? <div className="bigdata-loading">Загрузка...</div> : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                dataKey="events" 
                data={data} 
                stroke="#3182ce" 
                name="События" 
                isAnimationActive={false} 
              />
              <Line 
                dataKey="alerts" 
                data={data} 
                stroke="#e53e3e" 
                name="Предупреждения" 
                isAnimationActive={false} 
              />
              <Line 
                dataKey="regEvents" 
                data={getEventsRegressionLine()} 
                stroke="#3182ce" 
                strokeDasharray="5 5" 
                name="Тренд событий" 
                isAnimationActive={false} 
              />
              <Line 
                dataKey="regAlerts" 
                data={getAlertsRegressionLine()} 
                stroke="#e53e3e" 
                strokeDasharray="5 5" 
                name="Тренд предупреждений" 
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* График корреляции (Scatter Chart) */}
      <div className="bigdata-chart-section">
        <h2>Корреляционный анализ: События vs Предупреждения (Scatter Chart)</h2>
        {data.length === 0 ? <div className="bigdata-loading">Загрузка...</div> : (
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="events" name="События" />
              <YAxis dataKey="alerts" name="Предупреждения" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter 
                name="События vs Предупреждения" 
                data={correlationData} 
                fill="#8884d8" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Столбчатая диаграмма с эффективностью */}
      <div className="bigdata-chart-section">
        <h2>Эффективность работы системы (Bar Chart)</h2>
        {data.length === 0 ? <div className="bigdata-loading">Загрузка...</div> : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="efficiency" fill="#38a169" name="Эффективность (%)" />
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
      
      {/* Статистики и результаты анализа */}
      <div className="bigdata-stats">
        <h2>Результаты Data Science анализа</h2>
        {data.length === 0 ? <div className="bigdata-loading">Загрузка...</div> : (
          <div className="stats-grid">
            <div className="stats-card">
              <h3>События</h3>
              <p>Min: {stats.events.min}</p>
              <p>Max: {stats.events.max}</p>
              <p>Mean: {formatNumber(stats.events.mean)}</p>
              <p>Median: {stats.events.median}</p>
              <p>Std Dev: {formatNumber(stats.events.stdDev)}</p>
              <p>Q1: {stats.events.q1}</p>
              <p>Q3: {stats.events.q3}</p>
              <p>Коэф. тренда: {formatNumber(regressionData?.events.slope)}</p>
              <p>R²: {formatNumber(regressionData?.events.rSquared)}</p>
            </div>
            <div className="stats-card">
              <h3>Предупреждения</h3>
              <p>Min: {stats.alerts.min}</p>
              <p>Max: {stats.alerts.max}</p>
              <p>Mean: {formatNumber(stats.alerts.mean)}</p>
              <p>Median: {stats.alerts.median}</p>
              <p>Std Dev: {formatNumber(stats.alerts.stdDev)}</p>
              <p>Q1: {stats.alerts.q1}</p>
              <p>Q3: {stats.alerts.q3}</p>
              <p>Коэф. тренда: {formatNumber(regressionData?.alerts.slope)}</p>
              <p>R²: {formatNumber(regressionData?.alerts.rSquared)}</p>
            </div>
            <div className="stats-card">
              <h3>Эффективность</h3>
              <p>Min: {stats.efficiency.min}%</p>
              <p>Max: {stats.efficiency.max}%</p>
              <p>Mean: {formatNumber(stats.efficiency.mean)}%</p>
              <p>Median: {stats.efficiency.median}%</p>
              <p>Std Dev: {formatNumber(stats.efficiency.stdDev)}</p>
              <p>Q1: {stats.efficiency.q1}%</p>
              <p>Q3: {stats.efficiency.q3}%</p>
              <p>IQR: {formatNumber(stats.efficiency.iqr)}</p>
            </div>
            <div className="stats-card">
              <h3>Аналитические выводы</h3>
              <p>Корреляция: {formatNumber(
                regressionData ? 
                Math.sqrt(regressionData.events.rSquared * regressionData.alerts.rSquared) : 0
              )}</p>
              <p>Аномалии событий: {anomalies.events?.filter(a => a.isAnomaly).length || 0}</p>
              <p>Аномалии предупр.: {anomalies.alerts?.filter(a => a.isAnomaly).length || 0}</p>
              <p>Прогноз тренда: {
                regressionData?.events.slope > 0 ? 'Растущий ↗' : 'Падающий ↘'
              }</p>
              <p>Устойчивость: {
                stats.efficiency.stdDev < 10 ? 'Высокая' : 
                stats.efficiency.stdDev < 20 ? 'Средняя' : 'Низкая'
              }</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bigdata-footer">
        Демо: анализ данных, обнаружение аномалий, регрессионный анализ и прогнозирование трендов на основе исторических данных.
      </div>
    </div>
  );
};

export default BigDataDashboardDemo;