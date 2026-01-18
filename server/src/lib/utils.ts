export class ApiResponse<T = any> {
  public readonly success: boolean;
  public readonly data: T | null;
  public readonly error?: string;
  public readonly timestamp: string;

  constructor(
    success: boolean,
    data: T | null = null,
    error?: string,
  ) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse<T>(true, data);
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse(false, null, message);
  }
}
