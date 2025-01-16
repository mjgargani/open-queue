import React, { useEffect, useState } from 'react';
import { fetchQueueData } from '@/lib/fetchQueue';
import { CurrentState } from '@/types';

export default function ManagePage() {
  const [currentStates, setCurrentStates] = useState<CurrentState[]>([]);
  const [queue, setQueue] = useState<number[]>([]);
  const [guiche, setGuiche] = useState<number>(1);
  const [isGuicheLocked, setIsGuicheLocked] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);

  const updateQueueData = async () => {
    try {
      const data = await fetchQueueData();
      setCurrentStates(data.currentStates);
      setQueue(data.queue);
    } catch {
      setError('Erro ao buscar dados da fila');
    }
  };

  const callNext = async () => {
    if (queue.length === 0) {
      alert('A fila está vazia!');
      return;
    }

    const nextNumber = queue[0];
    if (nextNumber && confirm('Chamar próximo?')) {
      const res = await fetch('/api/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'call-next', guiche }),
      });

      if (res.ok) {
        updateQueueData();
      } else {
        alert('Erro ao chamar próximo número.');
      }
    }
  };

  const cancel = async () => {
    const current = currentStates.find((state) => state.guiche === guiche);

    if (!current) {
      alert('Nenhum atendimento em andamento para cancelar.');
      return;
    }

    if (confirm(`Cancelar chamada de '${current.number}'?`)) {
      const res = await fetch('/api/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'undo', guiche }),
      });

      if (res.ok) {
        updateQueueData();
      } else {
        alert('Erro ao cancelar chamada.');
      }
    }
  };

  const toggleGuicheLock = () => {
    setIsGuicheLocked((prev) => !prev);
  };

  useEffect(() => {
    updateQueueData();
  }, []);

  const current = currentStates.find((state) => state.guiche === guiche);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Gerenciamento da Fila</h1>
        <div className="mb-4">
          <label htmlFor="guiche" className="block text-lg font-semibold">
            Guichê:
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="guiche"
              type="number"
              value={guiche}
              onChange={(e) => setGuiche(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              disabled={isGuicheLocked}
            />
            <button
              onClick={toggleGuicheLock}
              className={`px-4 py-2 rounded-md text-white ${
                isGuicheLocked
                  ? 'bg-gray-500 hover:bg-gray-600 focus:ring focus:ring-gray-300'
                  : 'bg-green-500 hover:bg-green-600 focus:ring focus:ring-green-300'
              }`}
            >
              {isGuicheLocked ? 'Liberar Guichê' : 'Travar Guichê'}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {current
              ? `Você está atendendo o número: ${current.number}`
              : 'Você não está em atendimento.'}
          </h2>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Atendendo agora:</h2>
          {currentStates.map((state) => (
            <div
              key={state.guiche}
              className={`text-lg ${
                state.guiche === guiche ? 'font-bold' : ''
              }`}
            >
              Guichê {state.guiche}: Número {state.number}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            onClick={callNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300"
          >
            Chamar Próximo
          </button>
          <button
            onClick={cancel}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring focus:ring-red-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
