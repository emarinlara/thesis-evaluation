import React from 'react';
import './App.css';

const App: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your form submission logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Evaluación de Tesis</h1>
        
        {/* Presentación Section (20%) */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Presentación (20%)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Calidad de la presentación</label>
              <input type="number" min="0" max="10" step="0.1"
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Investigación Section (30%) */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Investigación (30%)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Profundidad de la investigación</label>
              <input type="number" min="0" max="10" step="0.1"
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Proyecto Section (50%) */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Proyecto (50%)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Calidad del proyecto</label>
              <input type="number" min="0" max="10" step="0.1"
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <button type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Calcular Evaluación
        </button>
      </form>
    </div>
  );
};

export default App;
