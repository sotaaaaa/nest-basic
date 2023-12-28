import { ClientGrpcExtraService } from './service/client-grpc.service';
import { CLIENT_GRPC, CLIENT_GRPC_ELASTIC_APM } from './constants/client-grpc.constant';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ElasticApmService } from '@skylinetech/plugins/elastic-apm';
import * as fg from 'fast-glob';

@Global()
@Module({})
export class ClientGrpcModule {
  /**
   * Creates a dynamic module for the ClientGrpcModule.
   * This module is used for plugin configuration.
   * It registers a gRPC client with the specified options.
   * It also provides the ElasticApmService instance for the gRPC client.
   */
  static forPlugin(): DynamicModule {
    // List of imported dynamic modules
    const imports: DynamicModule[] = [
      ClientsModule.registerAsync([
        {
          name: CLIENT_GRPC,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const options = configService.get('transporters.grpc.options');

            // Dynamic module configuration
            return {
              transport: Transport.GRPC,
              options: { ...options, protoPath: fg.sync(options.grpcClientProtoPath) },
            };
          },
        },
      ]),
    ];

    // Return module configuration
    return {
      module: ClientGrpcModule,
      providers: [
        ClientGrpcExtraService,
        {
          provide: CLIENT_GRPC_ELASTIC_APM,
          useFactory: (apmService: ElasticApmService) => apmService.instance,
          inject: [ElasticApmService],
        },
      ],
      exports: [ClientGrpcExtraService],
      imports: imports,
    };
  }
}
