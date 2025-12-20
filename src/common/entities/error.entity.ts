export class ErrorEntity {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
}
