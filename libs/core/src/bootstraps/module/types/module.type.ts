import { DynamicModule, ForwardReference, Type } from '@nestjs/common';

export interface CorePluginRegister {
  path: string;
  envFilePath?: string;
  plugins?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
}

export interface ModuleBootstrapOptions {
  path: string;
  envFilePath: string;
}
