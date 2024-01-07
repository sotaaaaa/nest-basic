#!/bin/bash

# Đường dẫn thư mục gốc của các schema files
PROJECT_DIR="./apps"

# Đường dẫn đến thư mục đầu ra cho interfaces
INTERFACE_DIR="./libs/types/src/generated/_schemas"

# Tạo thư mục đích nếu không tồn tại
mkdir -p "$INTERFACE_DIR"

# Hàm kiểm tra xem file có cần xử lý không
needs_processing() {
  local schema_file=$1
  local interface_file=$2

  # Nếu file interface không tồn tại, cần xử lý
  if [ ! -f "$interface_file" ]; then
    return 0
  fi

  # Lấy thời gian sửa đổi cuối cùng của các file
  local schema_mtime=$(stat -f "%m" "$schema_file")
  local interface_mtime=$(stat -f "%m" "$interface_file")

  # Kiểm tra xem file schema có thời gian sửa đổi mới hơn file interface không
  [[ "$schema_mtime" -gt "$interface_mtime" ]]
}

# Duyệt qua từng file schema
find $PROJECT_DIR -type f -name "*.schema.ts" | while read -r schema_file; do
  interface_file_name=$(basename "$schema_file" ".schema.ts").d.ts
  interface_path="$INTERFACE_DIR/$interface_file_name"

  # Kiểm tra xem file có cần xử lý không
  if needs_processing "$schema_file" "$interface_path"; then
    echo "Creating an interface $schema_file..."

    # Xử lý file schema
    node -e "
        const tsMorph = require('ts-morph');
        const fs = require('fs');
        const schemaFile = '$schema_file';
        const interfacePath = '$interface_path';
        const project = new tsMorph.Project();
        const file = project.addSourceFileAtPath(schemaFile);
        const classNode = file.getClasses()[0];
        if (!classNode) {
            console.error('No class found in ' + schemaFile);
            process.exit(1);
        }
        const fileName = interfacePath.split('/').pop().split('.')[0];
        const camelCaseName = fileName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        const interfaceName = camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1) + 'Interface';
        let interfaceText = 'export interface ' + interfaceName + ' {\\n';
        classNode.getProperties().forEach(property => {
            const name = property.getName();
            const type = property.getType().getText(property, tsMorph.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
            const isOptional = property.hasQuestionToken();
            interfaceText += '    ' + name + (isOptional ? '?: ' : ': ') + type + ';\\n';
        });
        interfaceText += '}';
        fs.writeFileSync(interfacePath, interfaceText);
        " || exit 1

    # Định dạng file interface theo cấu hình của prettier
    npx prettier --write "$interface_path" || exit 1
  fi
done

# Tạo file index.ts
echo "// Auto-generated index file" >"$INTERFACE_DIR/index.ts"
for file in "$INTERFACE_DIR"/*.d.ts; do
  filename=$(basename -- "$file" .d.ts)
  echo "export * from './$filename';" >>"$INTERFACE_DIR/index.ts"
done

echo "All interfaces have been generated in ${INTERFACE_DIR}."
