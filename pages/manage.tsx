import { useEffect, useState } from 'react';

export default function Manage() {
  const [queue, setQueue] = useState<string[]>([]);
  const [guiche, setGuiche] = useState(1);

  const fetchQueue = async () => {
    const res = await fetch('/api/queue');
    const data = await res.json();
    setQueue(data.queue);
  };

  const callNext = async () => {
    await fetch('/api/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'call-next', guiche }),
    });
    fetchQueue();
  };

  const undo = async () => {
    await fetch('/api/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'undo' }),
    });
    fetchQueue();
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gerenciamento da Fila</h1>
      <div className="flex items-center gap-4 mb-6">
        <label htmlFor="guiche" className="text-lg font-medium text-gray-700">
          Guichê:
        </label>
        <input
          id="guiche"
          type="number"
          value={guiche}
          onChange={(e) => setGuiche(parseInt(e.target.value, 10))}
          className="w-16 p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-300"
        />
      </div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={callNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300"
        >
          Chamar Próximo
        </button>
        <button
          onClick={undo}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:ring focus:ring-gray-300"
        >
          Desfazer
        </button>
      </div>
      <ul className="w-full max-w-md bg-white rounded-lg shadow divide-y divide-gray-200">
        {queue.map((q, idx) => (
          <li key={idx} className="p-4 text-gray-700">
            Número {q}
          </li>
        ))}
      </ul>
    </div>
  );
}
