// ComputerVisionDemo.js
import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const ComputerVisionDemo = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Загрузка модели при монтировании компонента
  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null); // Сбрасываем предыдущие ошибки
        console.log('Начинаем загрузку модели...');
        
        // Проверяем, что TensorFlow.js инициализирован
        if (!tf) {
          throw new Error('TensorFlow.js не загружен');
        }
        console.log('TensorFlow.js версия:', tf.version);
        
        // Пробуем загрузить модель с параметрами
        const loadedModel = await cocoSsd.load({
          base: 'lite_mobilenet_v2' // Менее требовательная к ресурсам модель
        });
        
        console.log('Модель успешно загружена:', loadedModel);
        setModel(loadedModel);
        setLoading(false);
        console.log('Статус готовности модели: загружена');
      } catch (err) {
        console.error('Подробная ошибка загрузки модели:', err);
        setError(`Не удалось загрузить модель: ${err.message || 'Неизвестная ошибка'}`);
        setLoading(false);
      }
    };

    loadModel();

    // Очистка при размонтировании
    return () => {
      if (model) {
        // TensorFlow модели не требуют явного освобождения в React
        console.log('Компонент размонтирован');
      }
    };
  }, []);

  // Настройка веб-камеры
  const startCamera = async () => {
    console.log('Запрос на доступ к камере...');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('API mediaDevices не поддерживается в этом браузере');
      setError('Ваш браузер не поддерживает доступ к камере.');
      return;
    }

    try {
      console.log('Запрашиваем поток с камеры...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      console.log('Поток получен:', stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Слушаем событие loadeddata вместо onloadedmetadata
        videoRef.current.onloadeddata = () => {
          console.log('Видео данные загружены, запускаем воспроизведение');
          console.log('Размеры видео:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
          
          // Устанавливаем размер canvas сразу
          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
          
          videoRef.current.play()
            .then(() => {
              console.log('Видео запущено успешно');
              
              // Небольшая задержка перед началом распознавания
              setTimeout(() => {
                setIsRunning(true);
              }, 500);
            })
            .catch(playError => {
              console.error('Ошибка при воспроизведении видео:', playError);
              setError('Не удалось запустить видео поток.');
            });
        };
      } else {
        console.error('videoRef.current отсутствует');
        setError('Внутренняя ошибка компонента.');
      }
    } catch (err) {
      console.error('Ошибка доступа к камере:', err);
      setError(`Не удалось получить доступ к камере: ${err.message || 'Неизвестная ошибка'}`);
    }
  };

  // Остановка камеры
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsRunning(false);
    }
  };

  // Функция обнаружения объектов
  const detectObjects = async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    
    // Проверяем, что видео имеет валидные размеры и готово для обработки
    if (video.videoWidth === 0 || video.videoHeight === 0 || 
        video.readyState < 2) { // HAVE_CURRENT_DATA = 2
      // Если видео не готово, пропускаем этот кадр
      console.log('Видео не готово для обработки:', 
                  { width: video.videoWidth, height: video.videoHeight, readyState: video.readyState });
      return;
    }
    
    try {
      // Выполнение распознавания напрямую с видео элемента
      const predictions = await model.detect(video);
      
      setDetections(predictions);
      
      // Отрисовка результатов на холсте
      drawDetections(predictions);
    } catch (err) {
      console.error('Ошибка при обнаружении объектов:', err);
    }
  };

  // Функция рекурсивного обнаружения кадров
  const detectFrame = useRef(() => {});
  
  // Настройка функции обнаружения кадров
  useEffect(() => {
    // Определяем функцию обнаружения кадров
    detectFrame.current = () => {
      if (!isRunning) return;
      
      detectObjects().then(() => {
        requestAnimationFrame(detectFrame.current);
      });
    };
    
    // Запускаем или останавливаем обнаружение при изменении isRunning
    if (isRunning) {
      console.log('Запускаем цикл обнаружения кадров');
      detectFrame.current();
    } else {
      console.log('Цикл обнаружения кадров остановлен');
    }
    
    // Очистка при размонтировании или изменении isRunning
    return () => {
      // Здесь ничего не нужно чистить, т.к. цикл прервется сам
      // из-за проверки !isRunning в начале detectFrame
    };
  }, [isRunning]);

  // Отрисовка обнаруженных объектов на холсте
  const drawDetections = (detections) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    
    // Устанавливаем размеры холста
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Очищаем холст
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Отрисовываем текущий кадр видео
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Отрисовываем рамки и метки обнаруженных объектов
    detections.forEach(detection => {
      const [x, y, width, height] = detection.bbox;
      
      // Отрисовываем рамку
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Отрисовываем метку
      ctx.fillStyle = '#00FFFF';
      ctx.fillRect(x, y - 20, width, 20);
      
      // Отрисовываем текст с названием класса и вероятностью
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.fillText(
        `${detection.class} (${Math.round(detection.score * 100)}%)`,
        x + 5, 
        y - 5
      );
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '1rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '0.5rem'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>Компьютерное зрение: распознавание объектов</h2>
      
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            fontSize: '1.125rem',
            marginBottom: '0.5rem'
          }}>Загрузка модели...</div>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '4px solid #3b82f6',
            borderRadius: '50%',
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : error ? (
        <div style={{
          color: '#ef4444',
          padding: '1rem'
        }}>{error}</div>
      ) : (
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '42rem'
        }}>
          {/* Контейнер для видео и canvas */}
          <div style={{
            position: 'relative',
            width: '100%',
            marginBottom: '1rem'
          }}>
            <video 
              ref={videoRef}
              style={{
                width: '100%',
                borderRadius: '0.5rem',
                display: isRunning ? 'block' : 'none'
              }}
              playsInline
              muted
            />
            <canvas 
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none' // Это решает проблему с перехватом кликов
              }}
            />
          </div>
          
          {/* Кнопки управления камерой - вынесены за пределы контейнера видео */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem',
            marginBottom: '1rem',
            gap: '1rem'
          }}>
            {!isRunning ? (
              <button
                onClick={() => {
                  console.log('Кнопка нажата!');
                  startCamera();
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                Включить камеру
              </button>
            ) : (
              <button
                onClick={stopCamera}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Выключить камеру
              </button>
            )}
          </div>
          
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>Обнаруженные объекты:</h3>
            {detections.length > 0 ? (
              <ul style={{
                margin: 0,
                padding: 0,
                listStyleType: 'none'
              }}>
                {detections.map((detection, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem' }}>
                    {detection.class}: {Math.round(detection.score * 100)}%
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0 }}>Наведите камеру на объекты для распознавания</p>
            )}
          </div>
        </div>
      )}
      
      <div style={{
        marginTop: '1.5rem',
        fontSize: '0.875rem',
        color: '#4b5563'
      }}>
        <p style={{ margin: '0.25rem 0' }}>Эта демонстрация использует TensorFlow.js и модель COCO SSD для распознавания объектов в реальном времени.</p>
        <p style={{ margin: '0.25rem 0' }}>Включите камеру и направьте её на различные объекты, чтобы увидеть результаты распознавания.</p>
      </div>
    </div>
  );
};

export default ComputerVisionDemo;