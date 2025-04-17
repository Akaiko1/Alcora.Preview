import React from 'react';

// Компонент для визуализации волны речи
export const VoiceWave = ({ isListening }) => {
  const barCount = 8;
  const minHeight = 5;
  const maxHeight = 35;
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '4px',
      height: '40px',
      marginBottom: '10px'
    }}>
      {isListening && Array(barCount).fill().map((_, i) => (
        <div 
          key={i}
          style={{
            width: '4px',
            height: `${Math.floor(Math.random() * (maxHeight - minHeight) + minHeight)}px`,
            backgroundColor: '#3182ce',
            borderRadius: '2px',
            animation: 'wave 0.5s infinite alternate',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0% { height: ${minHeight}px; }
          100% { height: ${maxHeight}px; }
        }
      `}</style>
    </div>
  );
};

// Компонент для отображения уверенности в ответе
export const ConfidenceIndicator = ({ confidence }) => {
  const value = confidence || 0;
  const color = value < 0.3 ? '#e53e3e' : value < 0.7 ? '#d69e2e' : '#38a169';
  
  return (
    <div style={{ marginTop: '8px', marginBottom: '8px' }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.9rem',
        color: '#4a5568'
      }}>
        <span style={{ marginRight: '8px' }}>Уверенность:</span>
        <div style={{ 
          flex: 1,
          height: '8px',
          background: '#e2e8f0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${value * 100}%`,
            height: '100%',
            background: color,
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>
        <span style={{ marginLeft: '8px', fontWeight: 'bold', color }}>{Math.round(value * 100)}%</span>
      </div>
    </div>
  );
};

// Компонент для отображения настроения (сентимента)
export const SentimentIndicator = ({ sentiment }) => {
  if (!sentiment) return null;
  
  const sentimentInfo = {
    positive: { icon: '😊', text: 'Позитивный', color: '#38a169' },
    negative: { icon: '😟', text: 'Негативный', color: '#e53e3e' },
    neutral: { icon: '😐', text: 'Нейтральный', color: '#718096' }
  };
  
  const { icon, text, color } = sentimentInfo[sentiment];
  
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      padding: '4px 8px',
      background: `${color}20`,
      borderRadius: '4px',
      marginRight: '8px',
      color
    }}>
      <span style={{ marginRight: '4px' }}>{icon}</span>
      <span style={{ fontSize: '0.9rem' }}>{text}</span>
    </div>
  );
};

// Компонент для отображения типа запроса (намерения)
export const IntentIndicator = ({ intent }) => {
  if (!intent) return null;
  
  const intentInfo = {
    question: { icon: '❓', text: 'Вопрос', color: '#3182ce' },
    command: { icon: '▶️', text: 'Команда', color: '#d69e2e' },
    statement: { icon: '💬', text: 'Утверждение', color: '#718096' }
  };
  
  const { icon, text, color } = intentInfo[intent];
  
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      padding: '4px 8px',
      background: `${color}20`,
      borderRadius: '4px',
      color
    }}>
      <span style={{ marginRight: '4px' }}>{icon}</span>
      <span style={{ fontSize: '0.9rem' }}>{text}</span>
    </div>
  );
};

// Компонент для отображения истории диалога
export const DialogHistory = ({ dialogHistory, onClear }) => {
  if (dialogHistory.length === 0) return null;
  
  return (
    <div className="dialog-history">
      <div className="dialog-header">
        <h3>История диалога</h3>
        <button className="btn btn-small" onClick={onClear}>Очистить</button>
      </div>
      
      <div className="dialog-list">
        {dialogHistory.map((entry, index) => (
          <div key={index} className="dialog-entry">
            <div className="dialog-question">
              <span className="dialog-icon">🙋</span>
              <div className="dialog-content">
                <div className="dialog-text">{entry.query}</div>
                <div className="dialog-meta">
                  <span className="dialog-time">{entry.timestamp}</span>
                  {entry.intent && <span className="dialog-intent">{entry.intent}</span>}
                </div>
              </div>
            </div>
            <div className="dialog-answer">
              <span className="dialog-icon">🤖</span>
              <div className="dialog-content">
                <div className="dialog-text">{entry.response}</div>
                <div className="dialog-meta">
                  {entry.category && <span className="dialog-category">{entry.category}</span>}
                  {entry.confidence && <span className="dialog-confidence">{Math.round(entry.confidence * 100)}%</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент отображения рекомендуемых вопросов
export const SuggestedQuestions = ({ questions, onSelect }) => {
  return (
    <div className="suggestions">
      <h3>Быстрый вопросник (вопросы генерируются случайно и содержат ошибки, только для иллюстрации функционала):</h3>
      <ul>
        {Object.entries(questions).map(([category, question]) => (
          <li key={category}>
            <button 
              onClick={() => onSelect(question)}
              className="suggestion-btn"
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Информационный блок о технологии
export const NlpInfoBlock = () => {
  return (
    <div className="nlp-info">
      <h3>О технологии</h3>
      <p>
        Данная демонстрация использует технологии обработки естественного языка (NLP) и распознавания речи:
      </p>
      <ul className="nlp-features">
        <li><span className="feature-name">Токенизация</span> - разбиение текста на слова</li>
        <li><span className="feature-name">Стемминг</span> - приведение слов к основе</li>
        <li><span className="feature-name">Удаление стоп-слов</span> - фильтрация незначимых слов</li>
        <li><span className="feature-name">Категоризация</span> - определение темы запроса</li>
        <li><span className="feature-name">Анализ тональности</span> - определение эмоциональной окраски</li>
        <li><span className="feature-name">Определение намерения</span> - классификация типа запроса</li>
      </ul>
    </div>
  );
};