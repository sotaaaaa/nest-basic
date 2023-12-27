import { getInstance } from '../utils/elastic-apm.utils';
import { createParamDecorator } from '@nestjs/common';

/**
 * A decorator that retrieves the current transaction from the Elastic APM instance.
 * @returns The current transaction object.
 */
export const ApmCurrentTransaction = createParamDecorator(() => {
  const apmInstance = getInstance();
  return apmInstance.currentTransaction;
});
