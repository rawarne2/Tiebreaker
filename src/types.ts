export interface ProCon {
  optionName: string;
  type: "pro" | "con";
  factor: string;
  weight: "High" | "Medium" | "Low";
  explanation: string;
}

export interface Rating {
  optionName: string;
  rating: number;
  comment: string;
}

export interface ComparisonItem {
  criterion: string;
  ratings: Rating[];
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Verdict {
  winningOption: string;
  confidenceScore: number;
  rationale: string;
  nextSteps: string[];
}

export interface DecisionResult {
  title: string;
  summary: string;
  options: string[];
  prosCons: ProCon[];
  comparisonMatrix: ComparisonItem[];
  swotAnalysis: SwotAnalysis;
  verdict: Verdict;
}

export interface Decision {
  id: string;
  question: string;
  context: string;
  options: string[];
  importance: number;
  createdAt: string;
  result?: DecisionResult;
}
