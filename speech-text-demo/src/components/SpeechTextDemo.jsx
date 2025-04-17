import React, { useState, useEffect, useRef, useMemo } from 'react';
import { knowledgeBase, nlpTools, generateSampleQuestions } from './SpeechUtils';
import { 
  VoiceWave, 
  ConfidenceIndicator, 
  SentimentIndicator,
  IntentIndicator,
  DialogHistory,
  SuggestedQuestions,
  NlpInfoBlock
} from './SpeechComponents';
import './SpeechTextDemo.css';

const SpeechTextDemo = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [intent, setIntent] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [detectedCategory, setDetectedCategory] = useState(null);
  const [dialogHistory, setDialogHistory] = useState([]);
  const [voiceSupport, setVoiceSupport] = useState({
    speechRecognition: false,
    speechSynthesis: false
  });

  // Мемоизируем семплы вопросов, чтобы они не генерировались при каждом рендере
  const sampleQuestions = useMemo(() => generateSampleQuestions(), []);

  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const textInputRef = useRef(null);
  
  // Проверка поддержки голосовых возможностей браузера
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasSpeechRecognition = !!SpeechRecognition;
    const hasSpeechSynthesis = !!window.speechSynthesis;
    
    setVoiceSupport({
      speechRecognition: hasSpeechRecognition,
      speechSynthesis: hasSpeechSynthesis
    });
    
    if (hasSpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ru-RU';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        if (event.results[0].isFinal) {
          setQuery(result);
          processQuery(result);
        }
      };
      
      recognitionRef.current.onerror = (e) => { 
        setError(`Ошибка распознавания речи: ${e.error}`); 
        setIsListening(false); 
      };
      
      recognitionRef.current.onend = () => setIsListening(false);
    } else {
      setError('Ваш браузер не поддерживает распознавание речи.');
    }
    
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
    
    // Очистка при размонтировании
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }
      if (isSpeaking) {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      }
    };
  }, []);

  const startListening = () => { 
    setError(null); 
    setTranscript(''); 
    if (recognitionRef.current) {
      recognitionRef.current.start(); 
      setIsListening(true);
    }
  };
  
  const stopListening = () => { 
    if (recognitionRef.current) {
      recognitionRef.current.stop(); 
    }
    setIsListening(false); 
  };

  const processQuery = (text) => {
    setLoading(true);
    
    // Анализируем запрос с помощью NLP инструментов
    const processedQuery = nlpTools.processQuery(text);
    const sentimentResult = nlpTools.analyzeSentiment(text);
    const intentResult = nlpTools.detectIntent(text);
    
    setSentiment(sentimentResult);
    setIntent(intentResult);
    
    // Определяем категорию запроса
    let bestCategory = null;
    let bestScore = 0;
    let bestConfidence = 0;
    
    // Для каждой категории считаем score
    Object.entries(knowledgeBase).forEach(([category, data]) => {
      const score = nlpTools.calculateScore(processedQuery, data);
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
        // Нормализуем уверенность 
        bestConfidence = Math.min(1, score / 2);
      }
    });
    
    setDetectedCategory(bestCategory);
    setConfidence(bestConfidence);
    
    // Формируем ответ
    setTimeout(() => {
      let responseText = '';
      
      if (bestCategory && bestScore > 0.1) {
        // Выбираем случайный ответ из категории
        const responses = knowledgeBase[bestCategory].responses;
        responseText = responses[Math.floor(Math.random() * responses.length)];
      } else {
        responseText = 'Извините, я не могу найти информацию по вашему запросу. Пожалуйста, переформулируйте вопрос или выберите один из рекомендуемых вопросов ниже.';
      }
      
      // Добавляем в историю диалога
      const dialogEntry = {
        query: text,
        response: responseText,
        timestamp: new Date().toLocaleTimeString(),
        sentiment: sentimentResult,
        intent: intentResult,
        category: bestCategory,
        confidence: bestConfidence
      };
      
      setDialogHistory(prev => [...prev, dialogEntry]);
      
      // Обновляем состояние
      setResponse(responseText);
      setLoading(false);
      
      // Озвучиваем ответ
      speakResponse(responseText);
    }, 500);
  };

  const speakResponse = (text) => {
    if (window.speechSynthesis) {
      if (isSpeaking) window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ru-RU'; 
      u.rate = 1.0; 
      u.pitch = 1.2;
      utteranceRef.current = u;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => {
        setIsSpeaking(false);
        setError('Произошла ошибка при синтезе речи.');
      };
      window.speechSynthesis.speak(u);
    } else {
      setError('Ваш браузер не поддерживает синтез речи.');
    }
  };

  const stopSpeaking = () => { 
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); 
    }
    setIsSpeaking(false); 
  };
  
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (query.trim()) {
      processQuery(query);
    }
  };
  
  const handleSampleQuestion = (question) => {
    setQuery(question);
    processQuery(question);
  };
  
  const handleClearHistory = () => {
    setDialogHistory([]);
    setResponse('');
    setQuery('');
    setSentiment(null);
    setIntent(null);
    setDetectedCategory(null);
    setConfidence(null);
  };
  
  return (
    <div className="speech-demo-container">
      <h2 className="speech-demo-title">Интеллектуальная база знаний с NLP</h2>
      
      {error && <div className="speech-error">{error}</div>}
      
      {!voiceSupport.speechRecognition && (
        <div className="speech-warning">
          Ваш браузер не поддерживает распознавание речи. Функция голосового ввода недоступна.
        </div>
      )}
      
      <div className="speech-voice-controls">
        <div className="speech-buttons">
          {voiceSupport.speechRecognition && (
            <button onClick={isListening ? stopListening : startListening} className={isListening ? 'btn btn-red' : 'btn btn-blue'}>
              {isListening ? '🛑 Остановить запись' : '🎤 Начать запись'}
            </button>
          )}
          {isSpeaking && voiceSupport.speechSynthesis && (
            <button onClick={stopSpeaking} className="btn btn-yellow">
              🔇 Остановить голос
            </button>
          )}
        </div>
        
        <VoiceWave isListening={isListening} />
        
        {isListening && <div className="speech-listening">Слушаю... {transcript}</div>}
      </div>
      
      <form onSubmit={handleSubmit} className="input-group">
        <input 
          ref={textInputRef} 
          className="speech-input" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Введите ваш вопрос..." 
        />
        <button type="submit" className="btn btn-green">Отправить</button>
      </form>
      
      {loading && <div className="speech-loading"><div className="loading-spinner"></div> Обрабатываю запрос...</div>}
      
      {response && !loading && (
        <div className="speech-response-container">
          <div className="speech-metadata">
            <SentimentIndicator sentiment={sentiment} />
            <IntentIndicator intent={intent} />
            {detectedCategory && (
              <div className="speech-category">
                Категория: <span className="category-name">{detectedCategory}</span>
              </div>
            )}
          </div>
          
          {confidence !== null && <ConfidenceIndicator confidence={confidence} />}
          
          <div className="speech-response">
            {response}
          </div>
        </div>
      )}
      
      <DialogHistory 
        dialogHistory={dialogHistory} 
        onClear={handleClearHistory} 
      />
      
      <SuggestedQuestions 
        questions={sampleQuestions} 
        onSelect={handleSampleQuestion}
      />
      
      <NlpInfoBlock />
    </div>
  );
};

export default SpeechTextDemo;