// База знаний с категориями и ключевыми словами
export const knowledgeBase = {
    приветствие: {
      keywords: ['привет', 'здравствуй', 'добрый день', 'добрый вечер', 'доброе утро', 'здравия'],
      responses: [
        'Здравствуйте! Чем я могу вам помочь?',
        'Добрый день! Я готов ответить на ваши вопросы.',
        'Приветствую! Я виртуальный ассистент компании, готов помочь вам с информацией.'
      ]
    },
    'процедуры компании': {
      keywords: ['процедур', 'правил', 'регламент', 'документаци', 'порядок', 'устав'],
      responses: [
        'В нашей компании установлены четкие процедуры для всех бизнес-процессов. Вы можете найти их на внутреннем портале в разделе "Документация".',
        'Все рабочие процедуры и регламенты доступны в разделе HR на корпоративном портале. Обратите внимание на последние обновления от 15 апреля.',
        'Процедуры компании включают регламенты и SOP по всем направлениям деятельности. Наиболее важные из них: регламент документооборота, процедура согласования договоров и процесс онбординга новых сотрудников.'
      ]
    },
    обучение: {
      keywords: ['обучени', 'курс', 'тренинг', 'развитие', 'квалификаци', 'навык', 'научиться'],
      responses: [
        'Наша компания предлагает различные программы обучения для сотрудников, включая онлайн-курсы и очные тренинги. В этом квартале особое внимание уделяется аналитическим навыкам и управлению данными.',
        'Вы можете записаться на курсы повышения квалификации через портал обучения. Доступны направления: технические навыки, soft skills и управленческие компетенции.',
        'В нашей системе обучения есть как обязательные курсы (по безопасности, корпоративной этике), так и опциональные программы профессионального развития. Каждый сотрудник имеет годовой бюджет на внешнее обучение.'
      ]
    },
    отпуск: {
      keywords: ['отпуск', 'выходн', 'отдых', 'отгул', 'каникул'],
      responses: [
        'Чтобы оформить отпуск, заполните заявление в системе HR и согласуйте даты с вашим руководителем не менее чем за 2 недели. Обратите внимание, что в высокий сезон (июнь-август) заявления нужно подавать за месяц.',
        'Процедура оформления отпуска начинается с заявки в HR-системе. Стандартный отпуск составляет 28 календарных дней, которые можно разбить максимум на 4 части.',
        'Для оформления отпуска используйте форму О-1 в HR-системе. После заполнения она автоматически направляется вашему руководителю, а после согласования - в отдел кадров.'
      ]
    },
    больничный: {
      keywords: ['больничн', 'болезнь', 'заболел', 'болеть', 'справк', 'врач', 'недомогани'],
      responses: [
        'В случае болезни сообщите своему руководителю и отправьте больничный лист в HR-отдел через электронную систему. Оплата больничного производится в соответствии с трудовым законодательством.',
        'Больничный лист необходимо предоставить в HR в течение 3 дней после выхода на работу. При длительной болезни (более 7 дней) рекомендуется информировать отдел кадров о примерных сроках отсутствия.',
        'При заболевании сразу сообщите руководителю, а по выздоровлении загрузите скан больничного листа в систему учета рабочего времени. Подлинник документа нужно передать в HR в течение недели.'
      ]
    },
    расписание: {
      keywords: ['график', 'расписани', 'рабоч', 'время', 'смен', 'час', 'гибк'],
      responses: [
        'Рабочий день начинается в 9:00 и заканчивается в 18:00 с перерывом на обед с 13:00 до 14:00. В пятницу рабочий день сокращен до 17:00.',
        'У нас гибкий график работы с обязательным присутствием с 11:00 до 16:00. Остальное рабочее время вы можете планировать самостоятельно, соблюдая 8-часовой рабочий день.',
        'Стандартная рабочая неделя составляет 40 часов. Сотрудники могут выбрать фиксированный график 9:00-18:00 или гибкий режим с обязательными часами присутствия 11:00-16:00. Возможна также работа в формате 4/10 (4 дня по 10 часов).'
      ]
    },
    'техническая поддержка': {
      keywords: ['поддержк', 'техническ', 'ит', 'компьютер', 'проблем', 'техподдержк', 'сломал', 'не работает', 'сбой'],
      responses: [
        'По вопросам технической поддержки обращайтесь по внутреннему номеру 1234 или по email support@company.com. Служба поддержки работает с 8:00 до 20:00 в рабочие дни.',
        'Техническая поддержка работает в режиме 24/7, вы можете создать заявку через внутренний портал. Приоритетные инциденты (влияющие на бизнес-процессы) обрабатываются в течение 30 минут.',
        'Для решения ИТ-проблем создайте тикет в системе ServiceDesk. Укажите категорию проблемы, степень срочности и детальное описание. Обычные заявки решаются в течение 4 часов, критические - в течение 1 часа.'
      ]
    },
    'безопасность': {
      keywords: ['безопасност', 'защит', 'доступ', 'пароль', 'охран', 'пропуск', 'угроз'],
      responses: [
        'Вопросы информационной безопасности курирует отдел ИБ (вн. 1337). Регулярно меняйте пароли и не передавайте учетные данные третьим лицам.',
        'Для доступа в офис используйте персональный пропуск. В случае утери немедленно сообщите в отдел безопасности для блокировки и выпуска нового.',
        'Политика безопасности требует двухфакторной аутентификации для всех критических систем. Используйте приложение AuthGuard для генерации одноразовых кодов.'
      ]
    },
    'зарплата': {
      keywords: ['зарплат', 'оплат', 'деньги', 'премия', 'бонус', 'выплат', 'аванс', 'оклад'],
      responses: [
        'Заработная плата выплачивается два раза в месяц: аванс 20-го числа и основная часть 5-го числа следующего месяца. Расчетные листы доступны в личном кабинете.',
        'Вопросами начисления заработной платы занимается финансовый отдел (вн. 2233). Премии выплачиваются ежеквартально, бонусы - по результатам годовой оценки.',
        'Система оплаты труда включает оклад, квартальные премии (до 15% от оклада) и годовой бонус (до 30% годового оклада). Возможны надбавки за знание иностранных языков и профессиональные сертификации.'
      ]
    }
  };
  
  // Инструменты NLP для анализа текста
  export const nlpTools = {
    // Токенизация текста
    tokenize: (text) => {
      return text.toLowerCase().match(/[а-яёa-z]+/g) || [];
    },
    
    // Удаление стоп-слов
    removeStopWords: (tokens) => {
      const stopWords = ['и', 'в', 'на', 'с', 'по', 'у', 'о', 'к', 'как', 'что', 'где', 'когда', 'мне', 'а', 'бы', 'же'];
      return tokens.filter(token => !stopWords.includes(token));
    },
    
    // Стемминг (упрощенный для русского языка)
    stem: (token) => {
      // Упрощенный стемминг для примера, удаляем наиболее распространенные окончания
      const endings = ['ами', 'ями', 'ой', 'ей', 'ом', 'ем', 'ов', 'ев', 'ах', 'ях', 'ами', 'ями', 'иями', 'а', 'я', 'у', 'ю', 'е', 'и', 'й', 'ы', 'ь', 'о'];
      let stemmed = token;
      
      for (const ending of endings) {
        if (token.length > ending.length + 3 && token.endsWith(ending)) {
          stemmed = token.slice(0, -ending.length);
          break;
        }
      }
      
      return stemmed;
    },
    
    // Обработка запроса
    processQuery: (text) => {
      const tokens = nlpTools.tokenize(text);
      const filteredTokens = nlpTools.removeStopWords(tokens);
      const stemmedTokens = filteredTokens.map(token => nlpTools.stem(token));
      return stemmedTokens;
    },
    
    // Подсчет TF-IDF для категоризации запроса (упрощенная версия)
    calculateScore: (processedQuery, category) => {
      const categoryKeywords = category.keywords;
      let score = 0;
      
      // Для каждого токена запроса проверяем соответствие ключевым словам категории
      for (const token of processedQuery) {
        for (const keyword of categoryKeywords) {
          // Если токен является подстрокой ключевого слова или наоборот
          if (keyword.includes(token) || token.includes(keyword)) {
            // Длина совпадения влияет на вес
            const matchLength = Math.min(token.length, keyword.length);
            score += matchLength / Math.max(token.length, keyword.length);
          }
        }
      }
      
      return score;
    },
    
    // Определение настроения (сентимент-анализ)
    analyzeSentiment: (text) => {
      const positiveWords = ['спасибо', 'помог', 'отлично', 'хорошо', 'прекрасно', 'благодар', 'нравится', 'рад', 'доволен'];
      const negativeWords = ['плохо', 'ужасно', 'трудно', 'сложно', 'не могу', 'проблема', 'ошибка', 'непонятно', 'не работает'];
      
      const tokens = nlpTools.tokenize(text);
      
      let positiveScore = 0;
      let negativeScore = 0;
      
      for (const token of tokens) {
        if (positiveWords.some(word => token.includes(word) || word.includes(token))) {
          positiveScore++;
        }
        if (negativeWords.some(word => token.includes(word) || word.includes(token))) {
          negativeScore++;
        }
      }
      
      // Определяем настроение
      if (positiveScore > negativeScore) return 'positive';
      if (negativeScore > positiveScore) return 'negative';
      return 'neutral';
    },
    
    // Определение намерения пользователя
    detectIntent: (text) => {
      const questionWords = ['что', 'как', 'где', 'когда', 'почему', 'зачем', 'кто', 'который', 'сколько', 'какой', 'куда'];
      const commandWords = ['расскажи', 'покажи', 'объясни', 'помоги', 'сделай', 'хочу', 'нужно', 'требуется'];
      
      const tokens = nlpTools.tokenize(text);
      
      // Определяем тип запроса
      if (tokens.some(token => questionWords.includes(token))) {
        return 'question';
      } else if (tokens.some(token => commandWords.includes(token))) {
        return 'command';
      } else if (text.endsWith('?')) {
        return 'question';
      }
      
      return 'statement';
    }
  };
  
  // Создаем семплы вопросов на основе ключевых слов
  export const generateSampleQuestions = () => {
    const sampleQuestions = {};
    
    // Шаблоны вопросов
    const templates = [
      'Как я могу KEYWORD?',
      'Расскажите о KEYWORD в компании',
      'Где найти информацию о KEYWORD?',
      'Что нужно знать о KEYWORD?'
    ];
    
    Object.entries(knowledgeBase).forEach(([category, data]) => {
      // Выбираем случайное ключевое слово из категории
      const keyword = data.keywords[Math.floor(Math.random() * data.keywords.length)];
      
      // Выбираем случайный шаблон
      const template = templates[Math.floor(Math.random() * templates.length)];
      
      // Создаем вопрос
      sampleQuestions[category] = template.replace('KEYWORD', keyword);
    });
    
    // Добавляем специальные вопросы для некоторых категорий
    sampleQuestions['приветствие'] = 'Здравствуйте, чем вы можете помочь?';
    sampleQuestions['отпуск'] = 'Как мне оформить отпуск?';
    sampleQuestions['расписание'] = 'Какой у нас рабочий график?';
    
    return sampleQuestions;
  };