import { useEffect, useState } from 'react';

export default function Queue() {
  const [current, setCurrent] = useState<{ guiche: string; number: string } | null>(null);

  useEffect(() => {
    const fetchQueue = async () => {
      const res = await fetch('/api/queue');
      const data = await res.json();
      setCurrent(data.current ? JSON.parse(data.current) : null);
    };
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {current ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Guichê {current.guiche} chamando número {current.number}
          </h1>
          <p className="text-xl text-gray-600 mt-4">Aguarde sua vez!</p>
        </div>
      ) : (
        <h1 className="text-3xl font-semibold text-gray-700">
          Aguardando chamada...
        </h1>
      )}
    </div>
  );
}
