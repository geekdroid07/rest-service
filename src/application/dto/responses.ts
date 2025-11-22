export type ServiceResponse<T = unknown> = {
  success: boolean;
  codError: string;
  messageError: string;
  data: T;
};
