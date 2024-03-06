export interface ApiResponse<T> {
  success: boolean;
  data?: T; // Data type parameterized
  error?: {
    code: number;
    message: string;
  };
}
