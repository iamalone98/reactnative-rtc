export class ApiModule {
  readonly baseUrl: string = '';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async post<T>(): Promise<T> {
    // using getHeaders...
    return new Promise(res => setTimeout(() => res('token' as T), 2000));
  }
}
