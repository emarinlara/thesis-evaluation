import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Alert } from './ui/alert';

interface Professor {
  name: string;
  hasReadThesis: boolean;
}

interface Evaluation {
  presentacion: string;
  investigacion: string;
  proyecto: string;
  notes: string;
}

const EvaluationApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [evaluation, setEvaluation] = useState({
    studentName: '',
    professors: Array(3).fill({ name: '', hasReadThesis: false }),
    firstPresentation: {
      presentacion: '',
      investigacion: '',
      proyecto: '',
      notes: ''
    },
    secondPresentation: {
      presentacion: '',
      investigacion: '',
      proyecto: '',
      notes: ''
    }
  });
  const [error, setError] = useState<string | null>(null);

  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      password === 'pfg1c25' &&
      evaluation.studentName.trim() !== '' &&
      evaluation.professors.every(p => p.name.trim() !== '' && p.hasReadThesis)
    ) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Por favor complete todos los campos y confirme la lectura del documento');
    }
  };

  const handleStudentNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEvaluation(prev => ({
      ...prev,
      studentName: e.target.value
    }));
  };

  const handleProfessorChange = (index: number, field: keyof Professor, value: string | boolean) => {
    setEvaluation(prev => ({
      ...prev,
      professors: prev.professors.map((prof, i) =>
        i === index ? { ...prof, [field]: value } : prof
      )
    }));
  };

  const handleEvaluationChange = (
    presentation: 'firstPresentation' | 'secondPresentation',
    field: keyof Evaluation,
    value: string
  ) => {
    setEvaluation(prev => ({
      ...prev,
      [presentation]: {
        ...prev[presentation],
        [field]: value
      }
    }));
  };

  const calculateScore = (presentation: Evaluation) => {
    const weights = {
      insuficiente: 40,
      suficiente: 70,
      bueno: 80,
      excelente: 100
    };

    const criteriaWeights = {
      presentacion: 0.2,
      investigacion: 0.3,
      proyecto: 0.5
    };

    let total = 0;
    for (const [criteria, value] of Object.entries(presentation)) {
      if (criteria !== 'notes' && value in weights) {
        const criteriaWeight = criteriaWeights[criteria as keyof typeof criteriaWeights];
        total += weights[value as keyof typeof weights] * criteriaWeight;
      }
    }
    return total;
  };

  const calculateFinalScore = () => {
    const firstScore = calculateScore(evaluation.firstPresentation);
    const secondScore = calculateScore(evaluation.secondPresentation);
    return (firstScore * 0.4) + (secondScore * 0.6);
  };

  const EvaluationTable: React.FC<{
    title: string;
    presentation: 'firstPresentation' | 'secondPresentation';
  }> = ({ title, presentation }) => (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Criterio</th>
            <th className="border p-2">Insuficiente (40%)</th>
            <th className="border p-2">Suficiente (70%)</th>
            <th className="border p-2">Bueno (80%)</th>
            <th className="border p-2">Excelente (100%)</th>
          </tr>
        </thead>
        <tbody>
          {[
            { key: 'presentacion', label: 'Presentación (20%)' },
            { key: 'investigacion', label: 'Investigación (30%)' },
            { key: 'proyecto', label: 'Proyecto (50%)' }
          ].map(({ key, label }) => (
            <tr key={key}>
              <td className="border p-2 font-medium">{label}</td>
              {['insuficiente', 'suficiente', 'bueno', 'excelente'].map((value) => (
                <td key={value} className="border p-2 text-center">
                  <input
                    type="radio"
                    name={`${presentation}-${key}`}
                    value={value}
                    checked={evaluation[presentation][key as keyof Evaluation] === value}
                    onChange={() => handleEvaluationChange(presentation, key as keyof Evaluation, value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <label className="block mb-2">Anotaciones:</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={evaluation[presentation].notes}
          onChange={(e) => handleEvaluationChange(presentation, 'notes', e.target.value)}
        />
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <h1 className="text-2xl font-bold mb-6">Comité de Tesis - Inicio de Sesión</h1>
            
            <Input
              label="Nombre del Estudiante"
              type="text"
              value={evaluation.studentName}
              onChange={handleStudentNameChange}
              placeholder="Ingrese el nombre del estudiante"
              required
            />

            {evaluation.professors.map((professor, index) => (
              <div key={index} className="space-y-2">
                <Input
                  label={`Profesor Lector ${index + 1}`}
                  type="text"
                  value={professor.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleProfessorChange(index, 'name', e.target.value)
                  }
                  placeholder={`Nombre del Profesor ${index + 1}`}
                  required
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={professor.hasReadThesis}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleProfessorChange(index, 'hasReadThesis', e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm text-gray-700">
                    Confirmo que he leído el documento de Tesis del estudiante
                  </label>
                </div>
              </div>
            ))}

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Ingrese la contraseña"
              required
            />

            {error && (
              <Alert className="mt-4 text-red-600">
                {error}
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2">{evaluation.studentName}</h1>
      <div className="text-gray-600 mb-6">
        <h3 className="font-semibold mb-2">Profesores Lectores:</h3>
        {evaluation.professors.map((professor, index) => (
          <div key={index}>{professor.name}</div>
        ))}
      </div>

      <EvaluationTable
        title="Evaluación Primera Presentación (40%)"
        presentation="firstPresentation"
      />

      <EvaluationTable
        title="Evaluación Segunda Presentación (60%)"
        presentation="secondPresentation"
      />

      {(evaluation.firstPresentation.presentacion && evaluation.secondPresentation.presentacion) && (
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-2">Resultado Final</h2>
          <p className="text-lg">
            Calificación Final: {calculateFinalScore().toFixed(2)}%
          </p>
          <p className="text-lg font-semibold mt-2">
            {calculateFinalScore() >= 80
              ? "El estudiante ha ganado el derecho de pasar a su presentación privada de tesis."
              : "El estudiante no ha alcanzado el puntaje mínimo requerido (80%) para pasar a la presentación privada de tesis."}
          </p>
        </div>
      )}
    </div>
  );
};

export default EvaluationApp;
