#!/bin/bash

# Đường dẫn nguồn và đích
SRC_DIR="./libs/proto/src/protos/**/*.proto"
DEST_DIR="./libs/types/src/generate/_protos"
TEMP_DIR="./libs/types/src/generate/_protos/temp_proto_types"

# Tạo thư mục tạm và đích nếu chúng không tồn tại
mkdir -p ${DEST_DIR}
mkdir -p ${TEMP_DIR}

# Biên dịch các file .proto vào thư mục tạm
protoc --plugin=node_modules/ts-proto/protoc-gen-ts_proto \
  --ts_proto_opt=outputEncodeMethods=true,useEnumNames=false,asClass=false,outputJsonMethods=true,nestJs=true,outputClientImpl=false,fileSuffix=.d \
  ${SRC_DIR} \
  --ts_proto_out=${TEMP_DIR}

# Di chuyển các file từ thư mục tạm thời đến thư mục đích
find ${TEMP_DIR} -type f -name "*.ts" -exec mv {} ${DEST_DIR} \;

# Xóa thư mục tạm thời
rm -rf ${TEMP_DIR}

# Tạo hoặc cập nhật file index.ts
echo "// Auto-generated index file" >${DEST_DIR}/index.ts

# Thêm các lệnh xuất khẩu vào file index.ts dựa trên tên file
for file in ${DEST_DIR}/*.ts; do
  filename=$(basename -- "$file" ".ts")
  if [ "$filename" != "index" ]; then
    module="${filename%.d}" # Loại bỏ chỉ phần mở rộng .d
    exportName="$(tr '[:lower:]' '[:upper:]' <<<${module:0:1})${module:1}ProtoType"
    echo "export * as $exportName from './$module';" >>${DEST_DIR}/index.ts
  fi
done

# Thông báo hoàn thành
echo "All interfaces have been generated in ${DEST_DIR}."
