import { IFileOptions } from './file-options.interface';

export interface IHttpResponse {
  status: number;
  message: string;
  data?: IFileOptions;
  logs?: any;
}
