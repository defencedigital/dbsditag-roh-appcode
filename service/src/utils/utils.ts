export const validateMonth = (month: number) => month > 0 && month < 13;

export const splitAndFormatInitialCap = (
  text: string,
  splitOn: string = ' ',
) => {
  if (!text || typeof text !== 'string') return '';

  return text
    .toLowerCase()
    .split(splitOn)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(splitOn);
};

export const formatInitialCap = (text: string) => {
  if (!text || typeof text !== 'string') return '';

  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const createDTOErrorMessage = (
  fieldName: string,
  fieldType: 'string' | 'number' | 'uuid',
) => {
  return `${fieldName} must be a valid ${fieldType}`;
};
