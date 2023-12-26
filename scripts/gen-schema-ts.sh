#!/bin/bash

# Đường dẫn thư mục gốc của các schema files
PROJECT_DIR="./apps"

# Đường dẹn đến thư mục đầu ra cho interfaces
INTERFACE_DIR="./libs/types/src/generate/_schemas"

# Tạo thư mục đích nếu nó không tồn tại
mkdir -p "$INTERFACE_DIR"

# Duyệt qua từng file và thực hiện công việc của bạn
find $PROJECT_DIR -type f -name "*.schema.ts" | while read -r schema_file; do
  # Tên file interface, ví dụ: từ 'buyer.schema.ts' thành 'buyer.d.ts'
  interface_file_name=$(basename "$schema_file" ".schema.ts").d.ts
  interface_path="$INTERFACE_DIR/$interface_file_name"

  # Chạy script Node.js để tạo interface
  node -e "
    const tsMorph = require('ts-morph');
    const project = new tsMorph.Project();
    const file = project.addSourceFileAtPath('$schema_file');
    const classNode = file.getClasses()[0]; // Lấy lớp đầu tiên trong file
    if (!classNode) {
        console.error('No class found in ' + '$schema_file');
        process.exit(1);
    }
    const fileName = '$interface_file_name'.split('.')[0];
    const camelCaseName = fileName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    const interfaceName = camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1) + 'Interface';
    let interfaceText = 'export interface ' + interfaceName + ' {\n';
    classNode.getProperties().forEach(property => {
        const name = property.getName();
        const type = property.getType().getText(property, tsMorph.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
        const isOptional = property.hasQuestionToken();
        interfaceText += '    ' + name + (isOptional ? '?: ' : ': ') + type + ';\n';
    });
    interfaceText += '}';
    require('fs').writeFileSync('$interface_path', interfaceText);
    " || exit 1

  # Định dạng file interface theo cấu hình của prettier
  npx prettier --write "$interface_path" || exit 1
done

# Kiểm tra xem có file .d.ts nào trong thư mục không
shopt -s nullglob
files=($INTERFACE_DIR/*.d.ts)

# Tạo file index.ts
echo "// Auto-generated index file" >"$INTERFACE_DIR/index.ts"

if [ ${#files[@]} -eq 0 ]; then
  # Không có file .d.ts, tạo index.ts với nội dung mặc định
  echo "export * from './';" >>"$INTERFACE_DIR/index.ts"
else
  # Có file .d.ts, tạo các lệnh export
  for file in "${files[@]}"; do
    filename=$(basename -- "$file" .d.ts)
    echo "export * from './$filename';" >>"$INTERFACE_DIR/index.ts"
  done
fi

# Tắt nullglob
shopt -u nullglob

echo "All interfaces have been generated in ${INTERFACE_DIR}."
