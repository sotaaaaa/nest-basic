// Danh sách các toán tử query3 hỗ trợ trong query3.
export const Query3Operators = [
  { key: 'desc', value: -1 },
  { key: 'asc', value: 1 },
  { key: 'in', value: '$in' },
  { key: 'eq', value: '$eq' },
  { key: 'gte', value: '$gte' },
  { key: 'lte', value: '$lte' },
  { key: 'gt', value: '$gt' },
  { key: 'lt', value: '$lt' },
  { key: 'or', value: '$or' },
  { key: 'ne', value: '$ne' },
  { key: 'contains', value: '$regex' },
];

// Limit và Offset mặc định.
export const DefaultLimit = 20;
export const DefaultOffset = 0;

// Cache configs
export const CacheTimeMax = 5 * 60 * 1000; // 5 minutes
export const CacheItemMax = 1000; // 1000 items
