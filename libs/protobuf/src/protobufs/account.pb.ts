/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "com.skylinetech.service.account";

/**
 * Bắt đầu định nghĩa các tin nhắn phản hồi.
 * Các tin nhắn phản hồi được định nghĩa theo định dạng sau:
 * message <tên_tin_nhắn_phản_hồi> {
 */
export interface Empty {
}

export interface PingServiceResponse {
  serviceIsAlive: boolean;
  serviceName: string;
}

export const COM_SKYLINETECH_SERVICE_ACCOUNT_PACKAGE_NAME = "com.skylinetech.service.account";

function createBaseEmpty(): Empty {
  return {};
}

export const Empty = {
  encode(_: Empty, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Empty {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmpty();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): Empty {
    return {};
  },

  toJSON(_: Empty): unknown {
    const obj: any = {};
    return obj;
  },
};

function createBasePingServiceResponse(): PingServiceResponse {
  return { serviceIsAlive: false, serviceName: "" };
}

export const PingServiceResponse = {
  encode(message: PingServiceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serviceIsAlive === true) {
      writer.uint32(8).bool(message.serviceIsAlive);
    }
    if (message.serviceName !== "") {
      writer.uint32(18).string(message.serviceName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PingServiceResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePingServiceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.serviceIsAlive = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.serviceName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PingServiceResponse {
    return {
      serviceIsAlive: isSet(object.serviceIsAlive) ? globalThis.Boolean(object.serviceIsAlive) : false,
      serviceName: isSet(object.serviceName) ? globalThis.String(object.serviceName) : "",
    };
  },

  toJSON(message: PingServiceResponse): unknown {
    const obj: any = {};
    if (message.serviceIsAlive === true) {
      obj.serviceIsAlive = message.serviceIsAlive;
    }
    if (message.serviceName !== "") {
      obj.serviceName = message.serviceName;
    }
    return obj;
  },
};

/**
 * Định nghĩa tất cả các phương thức RPC cho dịch vụ.
 * Các hàm được định nghĩa theo định dạng sau:
 * rpc <tên_hàm>(<tin_nhắn_yêu_cầu>) returns (<tin_nhắn_phản_hồi>) {}
 */

export interface AccountServiceClient {
  /**
   * HealthCheck là một phương thức RPC đơn lẻ kiểm tra trạng thái sức khỏe của dịch vụ
   * cổng.
   *
   * @param Empty - Một tin nhắn yêu cầu trống.
   * @return HealthCheckResponse - Tin nhắn phản hồi chứa trạng thái sức khỏe của dịch vụ
   * cổng.
   */

  pingService(request: Empty): Observable<PingServiceResponse>;
}

/**
 * Định nghĩa tất cả các phương thức RPC cho dịch vụ.
 * Các hàm được định nghĩa theo định dạng sau:
 * rpc <tên_hàm>(<tin_nhắn_yêu_cầu>) returns (<tin_nhắn_phản_hồi>) {}
 */

export interface AccountServiceController {
  /**
   * HealthCheck là một phương thức RPC đơn lẻ kiểm tra trạng thái sức khỏe của dịch vụ
   * cổng.
   *
   * @param Empty - Một tin nhắn yêu cầu trống.
   * @return HealthCheckResponse - Tin nhắn phản hồi chứa trạng thái sức khỏe của dịch vụ
   * cổng.
   */

  pingService(request: Empty): Promise<PingServiceResponse>
}

export function AccountServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["pingService"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AccountService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AccountService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ACCOUNT_SERVICE_NAME = "AccountService";

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
