export const successResponse = (data: any) => {
  return { response: true, data };
};

export const failResponse = (data: any) => {
  return { response: false, data };
};