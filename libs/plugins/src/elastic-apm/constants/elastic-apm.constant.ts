import { ApmOptions } from '../types/elastic-apm.type';

// Symbol to represent the APM instance
export const APM_INSTANCE = Symbol('APM_INSTANCE');

// Symbol to represent the APM options
export const APM_OPTIONS = Symbol('APM_OPTIONS');

// Default options for APM
export const defaultApmOptions: ApmOptions = {
  httpUserMapFunction: undefined,
};
