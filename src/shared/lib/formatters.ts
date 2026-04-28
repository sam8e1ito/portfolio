export const formatDisplayDate = (value: number) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(value);

export const formatInputDate = (value: number) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const parseCommaSeparatedList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
