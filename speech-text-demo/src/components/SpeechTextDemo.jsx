import React, { useState, useEffect, useRef } from 'react';

const knowledgeBase = {
  приветствие: [
    'Здравствуйте! Чем я могу вам помочь?',
    'Добрый день! Я готов ответить на ваши вопросы.',
  ],
  'процедуры компании': [
    'В нашей компании установлены четкие процедуры для всех бизнес-процессов. Вы можете найти их на внутреннем портале.',
    'Все рабочие процедуры доступны в разделе HR на корпоративном портале.',
  ],
  обучение: [
    'Наша компания предлагает различные программы обучения для сотрудников, включая онлайн-курсы и очные тренинги.',
    'Вы можете записаться на курсы повышения квалификации через портал обучения.',
  ],
  отпуск: [
    'Чтобы оформить отпуск, заполните заявление в системе HR и согласуйте даты с вашим руководителем.',
    'Процедура оформления отпуска начинается с заявки в HR-системе не менее чем за 2 недели до предполагаемой даты.',
  ],
  больничный: [
    'В случае болезни сообщите своему руководителю и отправьте больничный лист в HR-отдел.',
    'Больничный лист необходимо предоставить в HR в течение 3 дней после выхода на работу.',
  ],
  расписание: [
    'Рабочий день начинается в 9:00 и заканчивается в 18:00 с перерывом на обед с 13:00 до 14:00.',
    'У нас гибкий график работы с обязательным присутствием с 11:00 до 16:00.',
  ],
  'техническая поддержка': [
    'По вопросам технической поддержки обращайтесь по внутреннему номеру 1234 или по email support@company.com.',
    'Техническая поддержка работает в режиме 24/7, вы можете создать заявку через внутренний портал.',
  ],
};

const sampleQuestions = {
  приветствие: 'Здравствуйте, чем вы можете помочь?',
  'процедуры компании': 'Где можно найти информацию о процедурах компании?',
  обучение: 'Какие программы обучения доступны для сотрудников?',
  отпуск: 'Как оформить отпуск?',
  больничный: 'Что делать в случае болезни?',
  расписание: 'Какой у нас рабочий график?',
  'техническая поддержка': 'Куда обращаться по вопросам технической поддержки?',
};

const getSampleQuestion = (keyword) => {
  return sampleQuestions[keyword] || `Расскажите о ${keyword}`;
};

const SpeechTextDemo = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ru-RU';

      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        setQuery(result);
        processQuery(result);
      };
      recognitionRef.current.onerror = (e) => { setError(`Ошибка распознавания речи: ${e.error}`); setIsListening(false); };
      recognitionRef.current.onend = () => setIsListening(false);
    } else {
      setError('Ваш браузер не поддерживает распознавание речи.');
    }
    textInputRef.current?.focus();
  }, []);

  const startListening = () => { setError(null); setTranscript(''); recognitionRef.current.start(); setIsListening(true); };
  const stopListening = () => { recognitionRef.current.stop(); setIsListening(false); };

  const processQuery = (text) => {
    setLoading(true);
    setTimeout(() => {
      const normalized = text.toLowerCase().trim();
      let matchedKey;

      // 1) по точному совпадению рекомендованного вопроса
      for (const [key, q] of Object.entries(sampleQuestions)) {
        if (normalized === q.toLowerCase().trim()) {
          matchedKey = key;
          break;
        }
      }
      // 2) по наличию ключевого слова
      if (!matchedKey) {
        matchedKey = Object.keys(knowledgeBase).find(k => normalized.includes(k));
      }

      const found = matchedKey
        ? knowledgeBase[matchedKey][Math.floor(Math.random() * knowledgeBase[matchedKey].length)]
        : 'Извините, я не могу найти информацию по вашему запросу. Пожалуйста, выберите один из рекомендуемых вопросов ниже.';

      setResponse(found);
      setLoading(false);
      speakResponse(found);
    }, 500);
  };

  const speakResponse = (text) => {
    if (window.speechSynthesis) {
      if (isSpeaking) window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ru-RU'; u.rate = 1.0; u.pitch = 1.2;
      utteranceRef.current = u;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(u);
    } else setError('Ваш браузер не поддерживает синтез речи.');
  };

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); };
  const handleSubmit = e => { e.preventDefault(); if (query.trim()) processQuery(query); };

  return (
    <div className="speech-demo-container">
      <h2 className="speech-demo-title">Интерактивная база знаний</h2>
      {error && <div className="speech-error">{error}</div>}
      <div className="speech-buttons">
        <button onClick={isListening ? stopListening : startListening} className={isListening ? 'btn btn-red' : 'btn btn-blue'}>
          {isListening ? '🛑 Остановить запись' : '🎤 Начать запись'}
        </button>
        {isSpeaking && <button onClick={stopSpeaking} className="btn btn-yellow">🔇 Остановить голос</button>}
      </div>
      <form onSubmit={handleSubmit} className="input-group">
        <input ref={textInputRef} className="speech-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Введите ваш вопрос..." />
        <button type="submit" className="btn btn-green">Отправить</button>
      </form>
      {isListening && <div className="speech-listening">Слушаю... {transcript}</div>}
      {loading && <div className="speech-loading"><div className="loading-spinner"></div> Обрабатываю запрос...</div>}
      {response && !loading && <div className="speech-response">{response}</div>}
      <div className="suggestions">
        <h3>Рекомендуемые вопросы:</h3>
        <ul>
          {Object.keys(sampleQuestions).map(k => (
            <li key={k}>
              <button onClick={() => setQuery(sampleQuestions[k])}>
                {sampleQuestions[k]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SpeechTextDemo;