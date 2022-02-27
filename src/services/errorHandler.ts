import { INTERNAL_SERVER_ERROR } from "../constants";

export interface CustomErrorInterface {
  message: string;
  status?: number;
}

class CustomError extends Error implements CustomErrorInterface {
  message: string;

  status: number; 
  
  private internalServerErrorCode = INTERNAL_SERVER_ERROR.status;
  
  constructor(error: CustomErrorInterface) {
    super();
    this.message = error.message;
    this.status = error.status || this.internalServerErrorCode;
  }
}

export default CustomError;