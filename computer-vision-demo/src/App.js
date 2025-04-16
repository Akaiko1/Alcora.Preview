import React from 'react';
import './App.css';
import ComputerVisionDemo from './components/ComputerVisionDemo';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Демо компьютерного зрения</h1>
      </header>
      <main>
        <ComputerVisionDemo />
      </main>
    </div>
  );
}

export default App;