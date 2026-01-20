export class ApiResponse<T = any> {
  public readonly success: boolean;
  public readonly data: T | null;
  public readonly error?: Record<string, string>;
  public readonly timestamp: string;

  constructor(
    success: boolean,
    data: T | null = null,
    error?: Record<string, string>,
  ) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse<T>(true, data);
  }

  static error(error: Record<string, string>): ApiResponse<null> {
    return new ApiResponse(false, null, error);
  }
}
