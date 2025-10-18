export interface DashboardStats {
  totalKnowledge: number;
  files: number;
  links: number;
  texts: number;
  trained: number;
  untrained: number;
  primaryColor: string;
  suggestedQuestions: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    totalKnowledge: 24,
    files: 12,
    links: 8,
    texts: 4,
    trained: 18,
    untrained: 6,
    primaryColor: '#17B26A',
    suggestedQuestions: 5,
  };
};