#!/bin/bash

# Đường dẫn nguồn và đích
SRC_DIR="libs/protobuf/src/protos/**/*.proto"
DEST_DIR="libs/protobuf/src/protobufs"
TEMP_DIR="libs/protobuf/src/protobufs/temp_proto_types"

# Tạo thư mục tạm và đích nếu chúng không tồn tại
mkdir -p ${DEST_DIR}
mkdir -p ${TEMP_DIR}

# Biên dịch các file .proto vào thư mục tạm
protoc --plugin=node_modules/ts-proto/protoc-gen-ts_proto \
  --ts_proto_opt=outputEncodeMethods=true,useEnumNames=false,asClass=false,outputJsonMethods=true,nestJs=true,outputClientImpl=false,fileSuffix=.pb \
  ${SRC_DIR} \
  --ts_proto_out=${TEMP_DIR}

# Di chuyển các file từ thư mục tạm thời đến thư mục đích
find ${TEMP_DIR} -type f -name "*.ts" -exec mv {} ${DEST_DIR} \;

# Thay đổi kiểu trả về trong các file TypeScript
find ${DEST_DIR} -type f -name "*.ts" -exec sed -i '' -e 's/: Promise<\([^>]*\)> | Observable<\([^>]*\)> | \([^>]*\)/: Promise<\1>/g' {} +

# Xóa thư mục tạm thời
rm -rf ${TEMP_DIR}

# Thông báo hoàn thành
echo "All interfaces have been generated in ${DEST_DIR}."
