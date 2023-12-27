import { DynamicModule, ForwardReference, Type } from '@nestjs/common';

export interface ModuleBootstrapRegister {
  path: string;
  envFilePath?: string;
  plugins?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
}
