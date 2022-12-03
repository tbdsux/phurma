export interface APIResponse<T> {
  error: boolean;
  data?: T;
  message?: string;
}
