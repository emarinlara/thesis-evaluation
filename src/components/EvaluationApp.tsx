// src/components/EvaluationApp.tsx
import React, { useState, useRef } from 'react';
import { FileText } from 'lucide-react';

// Types
interface FormData {
  studentName: string;
  professors: string[];
  confirmations: boolean[];
  password: string;
}

interface Evaluation {
  presentacion: keyof typeof valueWeights | null;
  investigacion: keyof typeof valueWeights | null;
  proyecto: keyof typeof valueWeights | null;
}

interface Evaluations {
  first: Evaluation;
  second: Evaluation;
}

interface Notes {
  first: string;
  second: string;
}

const criteriaWeights = {
  presentacion: 0.20,
  investigacion: 0.30,
  proyecto: 0.50
} as const;

const valueWeights = {
  insuficiente: 0.40,
  suficiente: 0.70,
  bueno: 0.80,
  excelente: 1.00
} as const;

interface ProgressBarProps {
  score: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ score }) => {
  const barWidth = `${score}%`;
  const isApproved = score >= 80;
  
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Progreso hacia aprobación</span>
        <span className={`font-bold ${isApproved ? 'text-green-600' : 'text-amber-500'}`}>
          {score.toFixed(1)}%
        </span>
      </div>
      <div className="w-full h-6 bg-gray-200 rounded-full relative">
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500"
          style={{ left: '80%' }}
        >
          <span className="absolute -top-6 -translate-x-1/2 text-xs text-red-500">80%</span>
        </div>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isApproved ? 'bg-green-500' : 'bg-amber-500'
          }`}
          style={{ width: barWidth }}
        />
      </div>
    </div>
  );
};

interface ResultsAlertProps {
  score: number;
  title: string;
  isPartial?: boolean;
}

const ResultsAlert: React.FC<ResultsAlertProps> = ({ score, title, isPartial = false }) => {
  return (
    <div className="mt-8 p-4 bg-white border rounded-lg shadow">
      <h3 className="text-lg font-bold">{title}</h3>
      <div>
        <p className="font-bold mt-2">
          Puntaje: {score.toFixed(2)}%
        </p>
        <ProgressBar score={score} />
        {!isPartial && (
          <p className="mt-4">
            {score >= 80
              ? "El estudiante ha ganado el derecho de pasar a su presentación privada de tesis."
              : "El estudiante no ha alcanzado el puntaje mínimo requerido (80%) para pasar a la presentación privada."}
          </p>
        )}
        {isPartial && (
          <p className="mt-4 text-amber-600">
            Este es un resultado parcial. La calificación final se calculará después de la segunda presentación,
            donde esta primera nota representará el 40% de la nota final.
          </p>
        )}
      </div>
    </div>
  );
};

interface EvaluationTableProps {
  phase: 'first' | 'second';
  evaluation: Evaluation;
  setEvaluation: React.Dispatch<React.SetStateAction<Evaluations>>;
}

const EvaluationTable: React.FC<EvaluationTableProps> = ({ phase, evaluation, setEvaluation }) => {
  const options = ['insuficiente', 'suficiente', 'bueno', 'excelente'] as const;
  const criterios = {
    presentacion: 'Presentación',
    investigacion: 'Investigación',
    proyecto: 'Proyecto'
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">
        Evaluación {phase === 'first' ? 'primera' : 'segunda'} presentación
      </h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Criterio</th>
            {options.map(option => (
              <th key={option} className="p-2 border capitalize">
                {option.charAt(0).toUpperCase() + option.slice(1)} ({(valueWeights[option] * 100)}%)
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(Object.entries(criteriaWeights) as [keyof typeof criteriaWeights, number][]).map(([criterion, weight]) => (
            <tr key={criterion}>
              <td className="p-2 border">
                {criterios[criterion]} ({weight * 100}%)
              </td>
              {options.map(option => (
                <td key={option} className="p-2 border text-center">
                  <input
                    type="radio"
                    name={`${phase}-${criterion}`}
                    checked={evaluation[criterion] === option}
                    onChange={() => {
                      const newEvaluation = { ...evaluation };
                      newEvaluation[criterion] = option;
                      setEvaluation(prev => ({
                        ...prev,
                        [phase]: newEvaluation
                      }));
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface PDFReportProps {
  studentName: string;
  professors: string[];
  evaluation: Evaluation;
  notes: string;
  score: number;
  phase: 'first' | 'second';
}

const PDFReport: React.FC<PDFReportProps> = ({ studentName, professors, evaluation, notes, score, phase }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  
  const generatePDF = () => {
    const content = reportRef.current;
    if (!content) return;
    
    content.style.width = '800px';
    content.style.padding = '40px';
    content.style.background = 'white';
    
    window.print();
    
    content.style.width = 'auto';
    content.style.padding = '0';
  };
  
  return (
    <div>
      <button
        onClick={generatePDF}
        className="mt-4 mb-8 px-4 py-2 border rounded hover:bg-gray-50 inline-flex items-center"
      >
        <FileText className="w-4 h-4 mr-2" />
        Generar Reporte PDF {phase === 'first' ? 'Primera' : 'Segunda'} Presentación
      </button>
      
      <div className="hidden print:block" ref={reportRef}>
        {/* PDF content remains the same */}
      </div>
    </div>
  );
};

interface EvaluationFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleLogin: (e: React.FormEvent) => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ formData, setFormData, handleLogin }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Acceso al Sistema de Evaluación de Tesis</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Form content remains the same but uses standard HTML inputs */}
      </form>
    </div>
  );
};

const EvaluationApp: React.FC = () => {
  const [step, setStep] = useState<'login' | 'evaluation'>('login');
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    professors: ['', '', ''],
    confirmations: [false, false, false],
    password: ''
  });
  
  const [evaluations, setEvaluations] = useState<Evaluations>({
    first: {
      presentacion: null,
      investigacion: null,
      proyecto: null
    },
    second: {
      presentacion: null,
      investigacion: null,
      proyecto: null
    }
  });

  const [notes, setNotes] = useState<Notes>({
    first: '',
    second: ''
  });

  // Rest of the component implementation remains the same
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Component JSX remains the same */}
    </div>
  );
};

export default EvaluationApp;
