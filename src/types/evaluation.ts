// types/evaluation.ts

export type EvaluationValue = 'insuficiente' | 'suficiente' | 'bueno' | 'excelente';

export const evaluationWeights: Record<EvaluationValue, number> = {
  insuficiente: 40,
  suficiente: 70,
  bueno: 80,
  excelente: 100
};

export const criteriaWeights = {
  presentacion: 20,
  investigacion: 30,
  proyecto: 50
};

export interface Professor {
  name: string;
  hasReadThesis: boolean;
}

export interface EvaluationCriteria {
  presentacion: EvaluationValue;
  investigacion: EvaluationValue;
  proyecto: EvaluationValue;
}

export interface Presentation {
  criteria: EvaluationCriteria;
  notes: string;
  score?: number;
}

export interface ThesisEvaluation {
  studentName: string;
  professors: Professor[];
  firstPresentation?: Presentation;
  secondPresentation?: Presentation;
  finalScore?: number;
}

export const calculateScore = (criteria: EvaluationCriteria): number => {
  const scores = {
    presentacion: evaluationWeights[criteria.presentacion] * (criteriaWeights.presentacion / 100),
    investigacion: evaluationWeights[criteria.investigacion] * (criteriaWeights.investigacion / 100),
    proyecto: evaluationWeights[criteria.proyecto] * (criteriaWeights.proyecto / 100)
  };
  
  return scores.presentacion + scores.investigacion + scores.proyecto;
};

export const calculateFinalScore = (first: number, second: number): number => {
  return (first * 0.4) + (second * 0.6);
};
