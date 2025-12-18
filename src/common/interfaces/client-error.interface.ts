export interface ClientError {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
}
