export enum ErrorCodes {
  // Dưới 1500: Mã lỗi liên quan đến HTTP
  HttpSuccess = 0, // Thành công
  HttpServerError = 1000, // Lỗi máy chủ
  HttpRequestTimeout = 1001, // Hết thời gian chờ yêu cầu
  HttpBadRequest = 1002, // Yêu cầu không hợp lệ
  HttpUnauthorized = 1003, // Không được ủy quyền
  HttpForbidden = 1004, // Bị từ chối truy cập
  HttpNotFound = 1005, // Không tìm thấy
  HttpUnprocessableEntity = 1006, // Yêu cầu không thể xử lý
  HttpTooManyRequests = 1007, // Quá nhiều yêu cầu
  HttpBadGateway = 1008, // Cổng không hợp lệ
  HttpGatewayTimeout = 1009, // Hết thời gian chờ cổng
  HttpServiceUnavailable = 1010, // Dịch vụ không khả dụng

  // 1100 - 1199: Mã lỗi liên quan đến database
  MongoDBDuplicateKeyError = 1100,
  MongoDBConnectError = 1101,

  // 1500 - 1599: Mã lỗi liên quan đến gateway
  GatewayRequestError = 1500,
  GatewayTimeoutError = 1501,
}
