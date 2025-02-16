
export const calculateLeagueStatus = (startDate: string, endDate: string): 'active' | 'upcoming' | 'completed' => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
};
