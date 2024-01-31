export interface ApiResponse<T> {
    outputSchema: T;
    errorSchema: {
      errorCode: string;
      message: string;
      httpCode: number;
    };
  }