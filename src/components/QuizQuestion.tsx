// src/Quiz.tsx
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import ReactModal from 'react-modal';
ReactModal.setAppElement('#root');

interface QuizQuestion {
  id: number;
  text: string;
  Responses: QuizResponse[];
  QuestionNumber: number;
}

interface QuizResponse {
  id: number;
  text: string;
  correct: boolean;
  QuestionId: number;
}

const randomQuestionNumbers = (): number[] => {
  const originalArray: number[] = [1, 2, 3, 4, 5];
  const shuffledArray: number[] = [...originalArray];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

const getNumbersQuestions: number[] = randomQuestionNumbers();


const Quiz: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showLoading, setShowLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [respostaCorreta, setRespostaCorreta] = useState<boolean | null>(null);

  const openModal = (content: string) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  const fetchQuizQuestions = async (): Promise<QuizQuestion | null> => {
    setShowLoading(true);

    try {

      const response = await axios.get(`https://quiz-api-fw0h.onrender.com/api/questions`);
      console.log("RESPONSE", response);

      if (response.status === 204) {
        // Nenhum conteúdo encontrado (status 204)
        return null;
      }

      if (!response.data || typeof response.data !== 'object') {
        throw new Error("Invalid data format: Question data is not an object.");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching quiz questions:", error.message);
      throw error;
    } finally {
      setTimeout(() => {
        setShowLoading(false);
      }, 1000);
    }
  };

  const restartQuizQuestions = async (): Promise<QuizQuestion | null> => {
    setShowLoading(true);
    try {

      const response = await axios.get(`https://quiz-api-fw0h.onrender.com/api/restore-questions`);
      console.log("RESPONSE", response);

      return response.data;
    } catch (error) {
      console.error("Error restore quiz questions:", error.message);
      throw error;
    } finally {
      setTimeout(() => {
        setShowLoading(false);
      }, 1000);
    }
  };

  const { data: question, isLoading, error, refetch } = useQuery(['quizQuestions', currentQuestion], () => fetchQuizQuestions(), {
    enabled: false,
    refetchOnWindowFocus: false,
  });


  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <p>Carregando perguntas do quiz...</p>;
  if (error) return <p>Erro ao carregar perguntas:</p>;



  // if (!question || typeof question !== 'object') {
  //   return <p>Dados inválidos: A pergunta não foi carregada corretamente.</p>;
  // }

  const handleAnswerClick = (answerId: number) => {
    setSelectedAnswer(answerId);
  };

  const restartQuestions = async () => {
    await restartQuizQuestions();
    await refetch();
  };

  const handleResponderClick = async () => {
    console.log('Resposta selecionada:', selectedAnswer);
    if (selectedAnswer) {
      const selectedResponse = question?.Responses.find(response => response.id === selectedAnswer);

      if (selectedResponse) {
        if (selectedResponse.correct) {
          setRespostaCorreta(true);
          openModal("Parabéns você acertou!");
          await refetch();
        } else {
          setRespostaCorreta(false);
          openModal("Resposta errada, tente novamente!");
        }
      } else {
        console.error("Resposta não encontrada");
      }
    }
  };

  return (
    <div className="quiz-container flex justify-center h-screen w-full">
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="w-80 bg-white p-6 m-8 rounded-lg border-2 border-red-300"
        overlayClassName="modal-overlay"

      >
        <h1 className="text-3xl font-bold mb-4"></h1>
        <div className="flex items-center justify-center flex-col">
          <h1 className={`text-4xl font-bold mb-4 ${respostaCorreta !== null ? (respostaCorreta ? 'text-green-500' : 'text-red-500') : ''}`}>
            {modalContent}
          </h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mt-8" onClick={closeModal}>Fechar</button>
        </div>

      </ReactModal>

      {showLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500 border-opacity-75"></div>
        </div>
      )}
      <div className="w-80 bg-white p-6 m-8 rounded-lg border-2 border-red-300">
        <h1 className="text-3xl font-bold mb-4">Quiz de História</h1>
        {!question ? (
          <div className="flex items-center justify-center flex-col">
            <h2 className="text-center text-5xl mt-20 mb-10 font-semibold">Parabéns! Todas as perguntas foram respondidas.</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mt-8"
              onClick={restartQuestions}
            >
              Responder novamente?
            </button>
          </div>
        ) : (
          <div key={question.id} className="mb-4">
            <h2 className="text-xl font-semibold mt-5 mb-5">{question.QuestionNumber}. {question.text}</h2>
            <ul>
              {question.Responses.map((option, index) => (
                <li
                  key={option.id}
                  className={`cursor-pointer p-2 mb-2 mt-5 mb-5 rounded ${selectedAnswer === option.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  onClick={() => handleAnswerClick(option.id)}
                >
                  {String.fromCharCode(65 + index)}. {option.text}
                </li>
              ))}
            </ul>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              onClick={handleResponderClick}
            >
              Responder
            </button>
          </div>
        )}


      </div>
    </div>
  );

};

export default Quiz;
