export const getFindSyntax = (date: string): any => ({ where: { listDate: date } });

export const getByEndDate = (date: string): any => ({ where: { serviceEndDate: date } });
