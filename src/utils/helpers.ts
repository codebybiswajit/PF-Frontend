export const getInitials = (first?: string, last?: string) => {
  const f = first && first.length > 0 ? first.trim().charAt(0) : '';
  const l = last && last.length > 0 ? last.trim().charAt(0) : '';
  return `${f}${l}`.toUpperCase();
};
