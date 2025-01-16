import React, { useEffect, useState, useRef } from 'react';
import { fetchQueueData } from '@/lib/fetchQueue';
import { CurrentState } from '@/types';

export default function QueuePage() {
  const [currentStates, setCurrentStates] = useState<CurrentState[]>([]);
  const [lastCall, setLastCall] = useState<CurrentState | null>(null);
  const [queue, setQueue] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const prevCurrentStatesRef = useRef<CurrentState[]>([]);

  const updateQueueData = async () => {
    try {
      const data = await fetchQueueData();
      if (data) {
        const prevCurrentStates = prevCurrentStatesRef.current;

        const newCall = data.currentStates.find(
          (state) =>
            !prevCurrentStates.some(
              (prev) => prev.guiche === state.guiche && prev.number === state.number
            )
        );

        if (newCall) {
          setLastCall(newCall);

          const audio = new Audio('/bell.wav');
          audio.play();
        }

        setCurrentStates(data.currentStates);
        setQueue(data.queue);

        prevCurrentStatesRef.current = data.currentStates;
      }
    } catch {
      setError('Erro ao buscar os dados da fila.');
    }
  };

  useEffect(() => {
    updateQueueData();
    const interval = setInterval(updateQueueData, 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-md text-center">
          <h1 className="text-4xl font-bold text-red-500">Erro</h1>
          <p className="text-2xl mt-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-5xl font-bold text-center mb-8">Aguardando chamada...</h1>
        <div className="mb-8">
          <h2 className="text-4xl font-semibold mb-4">Última chamada:</h2>
          {lastCall ? (
            <div className="text-4xl font-bold text-center">
              <span className="text-blue-600">Guichê {lastCall.guiche}</span>:{' '}
              <span className="text-green-600">Número {lastCall.number}</span>
            </div>
          ) : (
            <p className="text-3xl text-center">Nenhuma chamada registrada</p>
          )}
        </div>
        <div className="mb-8">
          <h2 className="text-4xl font-semibold mb-4">Atendimentos em andamento:</h2>
          <ul className="space-y-4 text-center">
            {currentStates.map((state) => (
              <li key={state.guiche} className="text-3xl">
                <span className="font-semibold">Guichê {state.guiche}:</span> Número {state.number}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-4xl font-semibold mb-4">Próximo atendimento:</h2>
          <p className="text-3xl text-center">
            {queue[0] ? `Número ${queue[0]}` : 'Nenhum número na fila'}
          </p>
        </div>
      </div>
    </div>
  );
}
