import IErrorDescriber from './errorDescriber';

export interface IApiResult<T> {
  succeeded: boolean;
  message?: string;
  httpStatusCode: number;
  data?: T;
  errors?: {
    [key: string]: IErrorDescriber[]
  };
}
