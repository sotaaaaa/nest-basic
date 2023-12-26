/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "com.skylinetech.skygate.service.order";

export interface GetOrderRequest {
  orderCode: string;
}

export interface GetOrderResponse {
  order: Order | undefined;
}

export interface Order {
  orderCode: string;
  orderName: string;
  orderStatus: string;
}

function createBaseGetOrderRequest(): GetOrderRequest {
  return { orderCode: "" };
}

export const GetOrderRequest = {
  encode(message: GetOrderRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderCode !== "") {
      writer.uint32(10).string(message.orderCode);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOrderRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOrderRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.orderCode = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetOrderRequest {
    return { orderCode: isSet(object.orderCode) ? globalThis.String(object.orderCode) : "" };
  },

  toJSON(message: GetOrderRequest): unknown {
    const obj: any = {};
    if (message.orderCode !== "") {
      obj.orderCode = message.orderCode;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetOrderRequest>, I>>(base?: I): GetOrderRequest {
    return GetOrderRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetOrderRequest>, I>>(object: I): GetOrderRequest {
    const message = createBaseGetOrderRequest();
    message.orderCode = object.orderCode ?? "";
    return message;
  },
};

function createBaseGetOrderResponse(): GetOrderResponse {
  return { order: undefined };
}

export const GetOrderResponse = {
  encode(message: GetOrderResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.order !== undefined) {
      Order.encode(message.order, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOrderResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOrderResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.order = Order.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetOrderResponse {
    return { order: isSet(object.order) ? Order.fromJSON(object.order) : undefined };
  },

  toJSON(message: GetOrderResponse): unknown {
    const obj: any = {};
    if (message.order !== undefined) {
      obj.order = Order.toJSON(message.order);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetOrderResponse>, I>>(base?: I): GetOrderResponse {
    return GetOrderResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetOrderResponse>, I>>(object: I): GetOrderResponse {
    const message = createBaseGetOrderResponse();
    message.order = (object.order !== undefined && object.order !== null) ? Order.fromPartial(object.order) : undefined;
    return message;
  },
};

function createBaseOrder(): Order {
  return { orderCode: "", orderName: "", orderStatus: "" };
}

export const Order = {
  encode(message: Order, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderCode !== "") {
      writer.uint32(10).string(message.orderCode);
    }
    if (message.orderName !== "") {
      writer.uint32(18).string(message.orderName);
    }
    if (message.orderStatus !== "") {
      writer.uint32(26).string(message.orderStatus);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Order {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOrder();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.orderCode = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.orderName = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.orderStatus = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Order {
    return {
      orderCode: isSet(object.orderCode) ? globalThis.String(object.orderCode) : "",
      orderName: isSet(object.orderName) ? globalThis.String(object.orderName) : "",
      orderStatus: isSet(object.orderStatus) ? globalThis.String(object.orderStatus) : "",
    };
  },

  toJSON(message: Order): unknown {
    const obj: any = {};
    if (message.orderCode !== "") {
      obj.orderCode = message.orderCode;
    }
    if (message.orderName !== "") {
      obj.orderName = message.orderName;
    }
    if (message.orderStatus !== "") {
      obj.orderStatus = message.orderStatus;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Order>, I>>(base?: I): Order {
    return Order.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Order>, I>>(object: I): Order {
    const message = createBaseOrder();
    message.orderCode = object.orderCode ?? "";
    message.orderName = object.orderName ?? "";
    message.orderStatus = object.orderStatus ?? "";
    return message;
  },
};

export interface OrderService<Context extends DataLoaders> {
  GetOrder(ctx: Context, request: GetOrderRequest): Promise<GetOrderResponse>;
}

export interface DataLoaderOptions {
  cache?: boolean;
}

export interface DataLoaders {
  rpcDataLoaderOptions?: DataLoaderOptions;
  getDataLoader<T>(identifier: string, constructorFn: () => T): T;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
