export class GenericResponseDto<T> {
  ok: boolean;
  error?: string;
  data?: T;
}
