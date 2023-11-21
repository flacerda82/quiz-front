// src/App.js
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import QuizQuestion from './components/QuizQuestion';
import './App.css';

const queryClient = new QueryClient();

const App = () => {
  const handleAnswer = (selectedOption) => {
    console.log(`Resposta selecionada: ${selectedOption.text}`);
    // Adicione a lógica de manipulação da resposta aqui
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <QuizQuestion questionId={1} onAnswer={handleAnswer} />
      </div>
    </QueryClientProvider>
  );
};

export default App;
