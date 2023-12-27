/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

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

export interface GetOrdersRequest {
  orderStatus: string;
}

export interface GetOrdersResponse {
  orders: Order[];
}

export const COM_SKYLINETECH_SKYGATE_SERVICE_ORDER_PACKAGE_NAME = "com.skylinetech.skygate.service.order";

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
};

function createBaseGetOrdersRequest(): GetOrdersRequest {
  return { orderStatus: "" };
}

export const GetOrdersRequest = {
  encode(message: GetOrdersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderStatus !== "") {
      writer.uint32(10).string(message.orderStatus);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOrdersRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOrdersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): GetOrdersRequest {
    return { orderStatus: isSet(object.orderStatus) ? globalThis.String(object.orderStatus) : "" };
  },

  toJSON(message: GetOrdersRequest): unknown {
    const obj: any = {};
    if (message.orderStatus !== "") {
      obj.orderStatus = message.orderStatus;
    }
    return obj;
  },
};

function createBaseGetOrdersResponse(): GetOrdersResponse {
  return { orders: [] };
}

export const GetOrdersResponse = {
  encode(message: GetOrdersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.orders) {
      Order.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOrdersResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOrdersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.orders.push(Order.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetOrdersResponse {
    return { orders: globalThis.Array.isArray(object?.orders) ? object.orders.map((e: any) => Order.fromJSON(e)) : [] };
  },

  toJSON(message: GetOrdersResponse): unknown {
    const obj: any = {};
    if (message.orders?.length) {
      obj.orders = message.orders.map((e) => Order.toJSON(e));
    }
    return obj;
  },
};

export interface OrderServiceClient {
  getOrder(request: GetOrderRequest): Observable<GetOrderResponse>;

  getOrders(request: GetOrdersRequest): Observable<GetOrdersResponse>;
}

export interface OrderServiceController {
  getOrder(request: GetOrderRequest): Promise<GetOrderResponse>

  getOrders(request: GetOrdersRequest): Promise<GetOrdersResponse>
}

export function OrderServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getOrder", "getOrders"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("OrderService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("OrderService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ORDER_SERVICE_NAME = "OrderService";

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
