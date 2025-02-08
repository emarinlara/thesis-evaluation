import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

const criteriaWeights = {
  presentacion: 0.20,
  investigacion: 0.30,
  proyecto: 0.50
};

const valueWeights = {
  insuficiente: 0.40,
  suficiente: 0.70,
  bueno: 0.80,
  excelente: 1.00
};

const ProgressBar = ({ score }) => {
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

const ResultsAlert = ({ score, title, isPartial = false }) => {
  return (
    <Alert className="mt-8">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
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
      </AlertDescription>
    </Alert>
  );
};

const EvaluationTable = ({ phase, evaluation, setEvaluation }) => {
  const options = ['insuficiente', 'suficiente', 'bueno', 'excelente'];
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
          {Object.entries(criteriaWeights).map(([criterion, weight]) => (
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
                      if (phase === 'first') {
                        setEvaluation(prev => ({
                          ...prev,
                          first: newEvaluation
                        }));
                      } else {
                        setEvaluation(prev => ({
                          ...prev,
                          second: newEvaluation
                        }));
                      }
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

const PDFReport = ({ studentName, professors, evaluation, notes, score, phase }) => {
  const reportRef = useRef();
  
  const generatePDF = () => {
    const content = reportRef.current;
    content.style.width = '800px';
    content.style.padding = '40px';
    content.style.background = 'white';
    
    window.print();
    
    content.style.width = 'auto';
    content.style.padding = '0';
  };
  
  return (
    <div>
      <Button
        onClick={generatePDF}
        className="mt-4 mb-8"
        variant="outline"
      >
        <FileText className="w-4 h-4 mr-2" />
        Generar Reporte PDF {phase === 'first' ? 'Primera' : 'Segunda'} Presentación
      </Button>
      
      <div className="hidden print:block" ref={reportRef}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Reporte de Evaluación de Tesis</h1>
          <h2 className="text-xl mt-2">
            {phase === 'first' ? 'Primera' : 'Segunda'} Presentación
          </h2>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold">Estudiante:</h3>
          <p>{studentName}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold">Comité de Tesis:</h3>
          <ul>
            {professors.map((professor, index) => (
              <li key={index}>{professor}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">Evaluación:</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Criterio</th>
                <th className="p-2 border">Calificación</th>
                <th className="p-2 border">Peso</th>
                <th className="p-2 border">Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(evaluation).map(([criterion, value]) => (
                <tr key={criterion}>
                  <td className="p-2 border">
                    {criterion === 'presentacion' ? 'Presentación' :
                     criterion === 'investigacion' ? 'Investigación' : 'Proyecto'}
                  </td>
                  <td className="p-2 border capitalize">{value}</td>
                  <td className="p-2 border">
                    {(criteriaWeights[criterion] * 100)}%
                  </td>
                  <td className="p-2 border">
                    {(valueWeights[value] * criteriaWeights[criterion] * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold">Comentarios del Comité:</h3>
          <p className="whitespace-pre-line">{notes}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold">Resultado:</h3>
          <p className="font-bold mt-2">
            Puntaje Total: {score.toFixed(2)}%
          </p>
          <ProgressBar score={score} />
        </div>
        
        <div className="mt-12 pt-8 border-t">
          <div className="flex justify-between">
            {professors.map((professor, index) => (
              <div key={index} className="text-center">
                <div className="border-t border-black w-48 mt-16 pt-2">
                  {professor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EvaluationForm = ({ formData, setFormData, handleLogin }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Acceso al Sistema de Evaluación de Tesis</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2">Nombre del Estudiante</label>
            <Input
              value={formData.studentName}
              onChange={e => setFormData(prev => ({
                ...prev,
                studentName: e.target.value
              }))}
              required
            />
          </div>
          
          {[0, 1, 2].map(index => (
            <div key={index} className="space-y-2">
              <label className="block">Profesor Lector {index + 1}</label>
              <div className="flex gap-4 items-center">
                <Input
                  value={formData.professors[index]}
                  onChange={e => {
                    const newProfessors = [...formData.professors];
                    newProfessors[index] = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      professors: newProfessors
                    }));
                  }}
                  required
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.confirmations[index]}
                    onCheckedChange={checked => {
                      const newConfirmations = [...formData.confirmations];
                      newConfirmations[index] = checked;
                      setFormData(prev => ({
                        ...prev,
                        confirmations: newConfirmations
                      }));
                    }}
                    required
                  />
                  <label>Confirmo haber leído el documento de tesis</label>
                </div>
              </div>
            </div>
          ))}
          
          <div>
            <label className="block mb-2">Contraseña</label>
            <Input
              type="password"
              value={formData.password}
              onChange={e => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Ingresar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const EvaluationApp = () => {
  const [step, setStep] = useState('login');
  const [formData, setFormData] = useState({
    studentName: '',
    professors: ['', '', ''],
    confirmations: [false, false, false],
    password: ''
  });
  
  const [evaluations, setEvaluations] = useState({
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

  const [notes, setNotes] = useState({
    first: '',
    second: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      formData.studentName &&
      formData.professors.every(p => p) &&
      formData.confirmations.every(c => c) &&
      formData.password === 'pfg1c25'
    ) {
      setStep('evaluation');
    }
  };

  const calculateScore = (evaluation) => {
    if (!evaluation.presentacion || !evaluation.investigacion || !evaluation.proyecto) return null;
    
    const scores = {
      presentacion: valueWeights[evaluation.presentacion],
      investigacion: valueWeights[evaluation.investigacion],
      proyecto: valueWeights[evaluation.proyecto]
    };

    return (
      scores.presentacion * criteriaWeights.presentacion +
      scores.investigacion * criteriaWeights.investigacion +
      scores.proyecto * criteriaWeights.proyecto
    ) * 100;
  };

  const getFinalScore = () => {
    const firstScore = calculateScore(evaluations.first);
    const secondScore = calculateScore(evaluations.second);
    
    if (firstScore === null || secondScore === null) return null;
    
    return (firstScore * 0.4) + (secondScore * 0.6);
  };

  const isFirstEvaluationComplete = () => {
    return evaluations.first.presentacion !== null &&
           evaluations.first.investigacion !== null &&
           evaluations.first.proyecto !== null;
  };

  const isSecondEvaluationComplete = () => {
    return evaluations.second.presentacion !== null &&
           evaluations.second.investigacion !== null &&
           evaluations.second.proyecto !== null;
  };

  if (step === 'login') {
    return (
      <EvaluationForm
        formData={formData}
        setFormData={setFormData}
        handleLogin={handleLogin}
      />
    );
  }

  const firstScore = calculateScore(evaluations.first);
  const secondScore = calculateScore(evaluations.second);
  const finalScore = getFinalScore();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{formData.studentName}</h1>
      <div className="text-sm mb-6">
        Comité de Tesis: {formData.professors.join(', ')}
      </div>

      <EvaluationTable
        phase="first"
        evaluation={evaluations.first}
        setEvaluation={setEvaluations}
      />

      <div className="mt-4">
        <label className="block mb-2">Anotaciones primera presentación:</label>
        <textarea
          className="w-full p-2 border rounded"
          value={notes.first}
          onChange={e => setNotes(prev => ({ ...prev, first: e.target.value }))}
          rows={4}
        />
      </div>

      {isFirstEvaluationComplete() && (
        <>
          <ResultsAlert
            score={firstScore}
            title="Resultado Primera Presentación"
            isPartial={true}
          />
          <PDFReport
            studentName={formData.studentName}
            professors={formData.professors}
            evaluation={evaluations.first}
            notes={notes.first}
            score={firstScore}
            phase="first"
          />
        </>
      )}

      <EvaluationTable
        phase="second"
        evaluation={evaluations.second}
        setEvaluation={setEvaluations}
      />

      <div className="mt-4">
        <label className="block mb-2">Anotaciones segunda presentación:</label>
        <textarea
          className="w-full p-2 border rounded"
          value={notes.second}
          onChange={e => setNotes(prev => ({ ...prev, second: e.target.value }))}
          rows={4}
        />
      </div>

      {isSecondEvaluationComplete() && (
        <>
          <ResultsAlert
            score={secondScore}
            title="Resultado Segunda Presentación"
            isPartial={false}
          />
          <PDFReport
            studentName={formData.studentName}
            professors={formData.professors}
            evaluation={evaluations.second}
            notes={notes.second}
            score={secondScore}
            phase="second"
          />
        </>
      )}

      {isSecondEvaluationComplete() && isFirstEvaluationComplete() && (
        <Alert className="mt-8">
          <AlertTitle>Resultado Final</AlertTitle>
          <AlertDescription>
            <p>Primera presentación: {firstScore.toFixed(2)}% (40% del total)</p>
            <p>Segunda presentación: {secondScore.toFixed(2)}% (60% del total)</p>
            <p className="font-bold mt-2">
              Puntaje final: {finalScore.toFixed(2)}%
            </p>
            <ProgressBar score={finalScore} />
            <p className="mt-4">
              {finalScore >= 80
                ? "El estudiante ha ganado el derecho de pasar a su presentación privada de tesis."
                : "El estudiante no ha alcanzado el puntaje mínimo requerido (80%) para pasar a la presentación privada."}
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EvaluationApp;

