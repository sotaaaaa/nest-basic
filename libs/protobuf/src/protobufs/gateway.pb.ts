/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "com.skylinetech.service.gateway";

/**
 * Bắt đầu định nghĩa các tin nhắn phản hồi.
 * Các tin nhắn phản hồi được định nghĩa theo định dạng sau:
 * message <tên_tin_nhắn_phản_hồi> {
 */
export interface Empty {
}

export interface ServiceResponse {
  code: number;
  timestamp: string;
  message: string;
  data: string;
  errors: string[];
}

export const COM_SKYLINETECH_SERVICE_GATEWAY_PACKAGE_NAME = "com.skylinetech.service.gateway";

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

function createBaseServiceResponse(): ServiceResponse {
  return { code: 0, timestamp: "", message: "", data: "", errors: [] };
}

export const ServiceResponse = {
  encode(message: ServiceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.timestamp !== "") {
      writer.uint32(18).string(message.timestamp);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    if (message.data !== "") {
      writer.uint32(34).string(message.data);
    }
    for (const v of message.errors) {
      writer.uint32(42).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServiceResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServiceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.timestamp = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.message = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.data = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.errors.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServiceResponse {
    return {
      code: isSet(object.code) ? globalThis.Number(object.code) : 0,
      timestamp: isSet(object.timestamp) ? globalThis.String(object.timestamp) : "",
      message: isSet(object.message) ? globalThis.String(object.message) : "",
      data: isSet(object.data) ? globalThis.String(object.data) : "",
      errors: globalThis.Array.isArray(object?.errors) ? object.errors.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: ServiceResponse): unknown {
    const obj: any = {};
    if (message.code !== 0) {
      obj.code = Math.round(message.code);
    }
    if (message.timestamp !== "") {
      obj.timestamp = message.timestamp;
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    if (message.data !== "") {
      obj.data = message.data;
    }
    if (message.errors?.length) {
      obj.errors = message.errors;
    }
    return obj;
  },
};

/**
 * Định nghĩa tất cả các phương thức RPC cho dịch vụ.
 * Các hàm được định nghĩa theo định dạng sau:
 * rpc <tên_hàm>(<tin_nhắn_yêu_cầu>) returns (<tin_nhắn_phản_hồi>) {}
 */

export interface GatewayServiceClient {
  /**
   * HealthCheck là một phương thức RPC đơn lẻ kiểm tra trạng thái sức khỏe của dịch vụ
   * cổng.
   *
   * @param Empty - Một tin nhắn yêu cầu trống.
   * @return HealthCheckResponse - Tin nhắn phản hồi chứa trạng thái sức khỏe của dịch vụ
   * cổng.
   */

  healthCheck(request: Empty): Observable<ServiceResponse>;

  /**
   * GetConfigs là một phương thức RPC đơn lẻ lấy cấu hình của dịch vụ cổng.
   *
   * @param Empty - Một tin nhắn yêu cầu trống.
   * @return GetConfigResponse - Tin nhắn phản hồi chứa cấu hình của dịch vụ cổng.
   */

  getConfigs(request: Empty): Observable<ServiceResponse>;
}

/**
 * Định nghĩa tất cả các phương thức RPC cho dịch vụ.
 * Các hàm được định nghĩa theo định dạng sau:
 * rpc <tên_hàm>(<tin_nhắn_yêu_cầu>) returns (<tin_nhắn_phản_hồi>) {}
 */

export interface GatewayServiceController {
  /**
   * HealthCheck là một phương thức RPC đơn lẻ kiểm tra trạng thái sức khỏe của dịch vụ
   * cổng.
   *
   * @param Empty - Một tin nhắn yêu cầu trống.
   * @return HealthCheckResponse - Tin nhắn phản hồi chứa trạng thái sức khỏe của dịch vụ
   * cổng.
   */

  healthCheck(request: Empty): Promise<ServiceResponse>

  /**
   * GetConfigs là một phương thức RPC đơn lẻ lấy cấu hình của dịch vụ cổng.
   *
   * @param Empty - Một tin nhắn yêu cầu trống.
   * @return GetConfigResponse - Tin nhắn phản hồi chứa cấu hình của dịch vụ cổng.
   */

  getConfigs(request: Empty): Promise<ServiceResponse>
}

export function GatewayServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["healthCheck", "getConfigs"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("GatewayService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("GatewayService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const GATEWAY_SERVICE_NAME = "GatewayService";

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
