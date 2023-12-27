/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "com.skylinetech.service.account";

export interface GetAccountWalletRequest {
  accountId: string;
}

export interface GetAccountWalletResponse {
  accountWallet: string;
}

export const COM_SKYLINETECH_SERVICE_ACCOUNT_PACKAGE_NAME = "com.skylinetech.service.account";

function createBaseGetAccountWalletRequest(): GetAccountWalletRequest {
  return { accountId: "" };
}

export const GetAccountWalletRequest = {
  encode(message: GetAccountWalletRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountId !== "") {
      writer.uint32(10).string(message.accountId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAccountWalletRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAccountWalletRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.accountId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetAccountWalletRequest {
    return { accountId: isSet(object.accountId) ? globalThis.String(object.accountId) : "" };
  },

  toJSON(message: GetAccountWalletRequest): unknown {
    const obj: any = {};
    if (message.accountId !== "") {
      obj.accountId = message.accountId;
    }
    return obj;
  },
};

function createBaseGetAccountWalletResponse(): GetAccountWalletResponse {
  return { accountWallet: "" };
}

export const GetAccountWalletResponse = {
  encode(message: GetAccountWalletResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountWallet !== "") {
      writer.uint32(10).string(message.accountWallet);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAccountWalletResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAccountWalletResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.accountWallet = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetAccountWalletResponse {
    return { accountWallet: isSet(object.accountWallet) ? globalThis.String(object.accountWallet) : "" };
  },

  toJSON(message: GetAccountWalletResponse): unknown {
    const obj: any = {};
    if (message.accountWallet !== "") {
      obj.accountWallet = message.accountWallet;
    }
    return obj;
  },
};

export interface AccountWalletServiceClient {
  getAccountWallet(request: GetAccountWalletRequest): Observable<GetAccountWalletResponse>;
}

export interface AccountWalletServiceController {
  getAccountWallet(
    request: GetAccountWalletRequest,
  ): Promise<GetAccountWalletResponse>
}

export function AccountWalletServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAccountWallet"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AccountWalletService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AccountWalletService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ACCOUNT_WALLET_SERVICE_NAME = "AccountWalletService";

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
