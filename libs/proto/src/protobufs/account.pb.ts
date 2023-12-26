/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "com.skylinetech.skygate.account.account";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface LogoutRequest {
  token: string;
}

export interface LogoutResponse {
  success: boolean;
}

export const COM_SKYLINETECH_SKYGATE_ACCOUNT_ACCOUNT_PACKAGE_NAME = "com.skylinetech.skygate.account.account";

function createBaseLoginRequest(): LoginRequest {
  return { username: "", password: "" };
}

export const LoginRequest = {
  encode(message: LoginRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LoginRequest {
    return {
      username: isSet(object.username) ? globalThis.String(object.username) : "",
      password: isSet(object.password) ? globalThis.String(object.password) : "",
    };
  },

  toJSON(message: LoginRequest): unknown {
    const obj: any = {};
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    return obj;
  },
};

function createBaseLoginResponse(): LoginResponse {
  return { token: "" };
}

export const LoginResponse = {
  encode(message: LoginResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.token = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LoginResponse {
    return { token: isSet(object.token) ? globalThis.String(object.token) : "" };
  },

  toJSON(message: LoginResponse): unknown {
    const obj: any = {};
    if (message.token !== "") {
      obj.token = message.token;
    }
    return obj;
  },
};

function createBaseLogoutRequest(): LogoutRequest {
  return { token: "" };
}

export const LogoutRequest = {
  encode(message: LogoutRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogoutRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogoutRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.token = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LogoutRequest {
    return { token: isSet(object.token) ? globalThis.String(object.token) : "" };
  },

  toJSON(message: LogoutRequest): unknown {
    const obj: any = {};
    if (message.token !== "") {
      obj.token = message.token;
    }
    return obj;
  },
};

function createBaseLogoutResponse(): LogoutResponse {
  return { success: false };
}

export const LogoutResponse = {
  encode(message: LogoutResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LogoutResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLogoutResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.success = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LogoutResponse {
    return { success: isSet(object.success) ? globalThis.Boolean(object.success) : false };
  },

  toJSON(message: LogoutResponse): unknown {
    const obj: any = {};
    if (message.success === true) {
      obj.success = message.success;
    }
    return obj;
  },
};

export interface AccountServiceClient {
  login(request: LoginRequest): Observable<LoginResponse>;

  logout(request: LogoutRequest): Observable<LogoutResponse>;
}

export interface AccountServiceController {
  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  logout(request: LogoutRequest): Promise<LogoutResponse> | Observable<LogoutResponse> | LogoutResponse;
}

export function AccountServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["login", "logout"];
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
