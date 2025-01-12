import {IApiResult} from '../models/apiResult';
import IErrorDescriber from '../models/errorDescriber';

export function isApiResult(obj: any): obj is IApiResult<any> {
  return (
    typeof obj === 'object' && obj !== null &&
    typeof obj.succeeded === 'boolean' &&
    typeof obj.httpStatusCode === 'number' &&
    ('data' in obj) &&
    ('message' in obj) &&
    ('errors' in obj)
  )
}

function isErrorDescriber(obj: any): obj is IErrorDescriber {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ('errorCode' in obj ? typeof obj.errorCode === 'number' || obj.errorCode === undefined : true) &&
    typeof obj.errorType === 'string' &&
    typeof obj.description === 'string'
  );
}


function isErrorDescriberArray(obj: any): obj is IErrorDescriber[] {
  return Array.isArray(obj) && obj.every(isErrorDescriber);
}

