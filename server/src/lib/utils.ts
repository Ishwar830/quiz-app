export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export class ApiResponse {
  public readonly data: any;
  public readonly error: ApiError | null;
  public readonly timestamp: string;

  constructor(data: any = null, error: ApiError | null = null) {
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static success(data: any) {
    return new ApiResponse(data);
  }

  static error(error: ApiError) {
    return new ApiResponse(null, error);
  }
}
