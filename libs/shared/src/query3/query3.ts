import {
  ModelQuery,
  PaginationResult,
  ParseQueryResult,
  Query3Options,
  QueryParse,
} from './types';
import {
  CacheItemMax,
  CacheTimeMax,
  DefaultLimit,
  DefaultOffset,
  Query3Operators,
} from './constants';
import { Model } from 'mongoose';
import crypto from 'crypto';
import * as _ from 'lodash';

// Tạo ra 1 biến global để lưu cache query3
// Sẽ chỉ lưu cache tối đa trong vòng 5 phút và lưu tối đa 1000 cache
// Tránh việc lưu cache quá nhiều dẫn đến tốn bộ nhớ và bị tấn công DDOS
const query3Cache: { [key in string]: Query3CacheData } = global['query3Cache'] || {};

interface Query3CacheData<T = any> {
  cacheDateTime: number;
  data: T | PaginationResult;
}

// Query 3 is a query that returns a list of documents.
// It is used for queries that return a list of documents.
export class Query3<T> {
  public readonly model: Model<T>;

  // The pipeline stages to execute.
  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Lấy danh sách các document, hàm này tương tự như hàm find của mongoose.
   * @param query
   * @returns
   */
  async find(query: ModelQuery<T>) {
    return this.model.find(query);
  }

  /**
   * Lấy bản ghi đầu tiên, hàm này tương tự như hàm findOne của mongoose.
   * @param query
   * @returns
   */
  async findOne(query: ModelQuery<T>) {
    return this.model.findOne(query);
  }

  /**
   * Trả về cấu trúc phân trang theo query gửi lên.
   * @param filter
   * @param limit
   * @returns
   */
  async getPagination(filter: ModelQuery<T>, limit: number): Promise<PaginationResult> {
    const count = await this.model.countDocuments(filter);
    const pagination = {
      totalRows: count,
      totalPages: Math.ceil(count / limit),
    };
    return pagination;
  }

  /**
   * Xử lý data trả về, xóa các trường không cần thiết.
   * @param value
   * @param keys
   * @returns
   */
  public omit(value: T[], keys: string[]) {
    if (!value || !Array.isArray(value)) return value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const omit = (value: T, key: string[]) => {
      const clone = { ...value };
      for (const k of key) {
        delete clone[k];
      }
      return clone;
    };

    return value.map((element) => omit(element, keys));
  }

  /**
   * Hàm này sẽ xử lý dữ liệu query client gửi lên.
   * Convert về dạng mongoose hiểu được và thực hiện các thao tác fillter và phân trang.
   * @param query
   */
  public parseQuery(query: QueryParse): ParseQueryResult<T> {
    // Lấy ra giá trị của limit và offset từ query, nếu không có thì sử dụng giá trị mặc định
    const {
      limit = DefaultLimit,
      offset = DefaultOffset,
      count = false,
      justOne = false,
      cacheTimeMs = 0,
      ...queryWithoutLimitOffset
    } = query;

    const filter = {};
    const sort = {};

    // Duyệt qua từng cặp key-value của query và chuyển đổi sang dạng query của mongoose
    Object.entries(queryWithoutLimitOffset).forEach(([key, value]) => {
      // Nếu value không phải là object thì bỏ qua
      if (typeof value !== 'object') return;

      Query3Operators.forEach(({ key: mkey, value: mappingValue }) => {
        // Nếu value có key 'sort' thì chuyển đổi sang sort operator của mongoose
        if (value['sort'] === mkey) sort[key] = mappingValue;
        // Nếu value có key tương ứng với mapping key thì chuyển đổi sang operator của mongoose
        if (value[mkey]) {
          filter[key] = {
            ...filter[key],
            [mappingValue]: value[mkey],
          };
        }
      });
    });

    const orFilters = Object.entries(filter).reduce((acc, [key, value]) => {
      // Nếu value có $or thì chuyển đổi sang $or operator của mongoose
      if (value['$or']) {
        acc.push({ [key]: value['$or'] });
        delete filter[key];
      }

      // Nếu value có $regex thì chuyển đổi sang $regex operator của mongoose và thêm option 'i' để không phân biệt chữ hoa, chữ thường
      if (value && value['$regex']) {
        filter[key] = { $regex: value['$regex'], $options: 'i' };
      }

      return acc;
    }, []);

    // Nếu có orFilters thì thêm orFilters vào filter với $or operator của mongoose
    if (orFilters.length) filter['$or'] = orFilters;

    // Trả về kết quả parse query
    return {
      filter: filter,
      limit: Number(limit),
      offset: Number(offset),
      sort: sort,
      count: count,
      justOne: justOne,
      cacheTimeMs: Number(cacheTimeMs),
    };
  }

  /**
   * Lấy danh sách bản ghi theo query của `client` gửi lên
   * @param query
   * @param options
   */
  async queryWithNormal(query: QueryParse, options?: Query3Options<T>) {
    const { populate, queryMongoose } = options || {};
    const { filter, limit, offset, sort, count, justOne } = this.parseQuery(query || {});

    // Lọc dữ liệu theo query và lấy phân trang
    const omit = options?.omit || [];
    const mongoFilter = queryMongoose ? { ...filter, ...queryMongoose } : filter;
    const pagination = await this.getPagination(mongoFilter, limit);

    // Nếu có options count bằng true sẽ trả về cả tổng số bản ghi
    if (count) {
      const totalRows = await this.model.countDocuments(mongoFilter);
      return totalRows;
    }

    // Tạo câu query database theo query client
    const results: T[] = await this.model
      .find(mongoFilter)
      .skip(offset)
      .limit(limit)
      .sort(sort)
      .populate(populate)
      .lean();

    // Nếu justOne bằng true sẽ trả về 1 bản ghi duy nhất
    // Cần tối ưu lại query để chỉ lấy 1 bản ghi
    if (justOne) {
      return results[0];
    }

    // Trả về kết quả query và phân trang
    return {
      records: omit.length ? this.omit(results, omit) : results,
      pagination: pagination,
    };
  }

  /**
   * Hàm này sẽ lưu cache dữ liệu vào bộ nhớ.
   * Kiểm tra xem cacheTimeMs có lớn hơn 10 phút hay không, nếu lớn hơn thì sẽ lưu cache trong 10 phút.
   * Kiểm tra xem đã quá 1000 cache hay chưa, nếu quá 1000 cache thì sẽ xóa cache cũ nhất.
   * @param key - Khóa cache
   * @param cacheTimeMs - Thời gian cache (tính bằng mili giây)
   * @param data - Dữ liệu cần lưu cache
   */
  private query3SaveCache(key: string, cacheTimeMs: number, data: unknown) {
    if (cacheTimeMs > CacheTimeMax) {
      // Nếu cacheTimeMs lớn hơn 10 phút, lưu cache trong 10 phút
      query3Cache[key] = { cacheDateTime: Date.now() + CacheTimeMax, data: data };
    } else {
      // Ngược lại, lưu cache trong thời gian cacheTimeMs
      query3Cache[key] = { cacheDateTime: Date.now() + cacheTimeMs, data: data };
    }

    // Xóa các đã hết hạn, chỉ giữ lại các cache còn hiệu lực và tối đa 1000 cache
    this.query3PruneCache();
  }

  // Hàm này sẽ prune toàn bộ các cache lớn hơn 1000 cache
  // Xóa toàn bộ cache đã hết hạn thời gian
  private query3PruneCache() {
    const cacheArray = [];

    // Chuyển đổi các key từ query3Cache thành một mảng với định dạng { key, cacheDateTime }
    _.forEach(query3Cache, (value, key) => {
      cacheArray.push({ key, cacheDateTime: value.cacheDateTime });
    });

    const currentTime = Date.now();

    // Sắp xếp mảng theo thời gian cacheDateTime tăng dần
    const sortedCacheArray = _.sortBy(cacheArray, ['cacheDateTime']);

    // Xóa các cache đã hết hạn (nhỏ hơn currentTime)
    _.remove(sortedCacheArray, (item) => item.cacheDateTime < currentTime);
    _.forEach(sortedCacheArray, (item) => {
      delete query3Cache[item.key];
    });

    // Nếu vẫn còn quá nhiều cache, xóa các cache cũ nhất
    while (_.size(query3Cache) > CacheItemMax) {
      const oldestCache = sortedCacheArray.shift();
      delete query3Cache[oldestCache.key];
    }
  }

  // Hàm này sẽ kiểm tra cacheTimeMs có tồn tại hay không, nếu có sẽ thực hiện cache dữ liệu theo thời gian
  // Nếu không sẽ thực hiện query database
  async queryWithCache(
    query: QueryParse,
    options: Query3Options<T>,
  ): Promise<number | T | { records: T[]; pagination: PaginationResult }> {
    const { cacheTimeMs } = this.parseQuery(query || {});

    // Từ query gửi lên thực hiện tạo ra 1 key cache
    const cacheKey = crypto
      .createHash('sha256')
      .update(JSON.stringify(query))
      .digest('hex');

    // Thực hiện kiểm tra cache có tồn tại trong memory hay không
    const cacheResult = query3Cache[cacheKey];

    // Nếu cache tồn tại và thời gian cache chưa hết thì trả về kết quả cache
    if (cacheResult && cacheResult.cacheDateTime > Date.now()) {
      return cacheResult.data;
    }

    // Nếu cache không tồn tại hoặc thời gian cache đã hết thì thực hiện query database
    const result = await this.queryWithNormal(query, options);

    // Nếu có cacheTimeMs thì thực hiện lưu cache
    if (cacheTimeMs && cacheTimeMs > 0) {
      this.query3SaveCache(cacheKey, cacheTimeMs, result);
    }

    // Trả về kết quả query
    return result;
  }
}
