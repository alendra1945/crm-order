export class Pagination {
  page: number;
  limit: number;
  total: number;
}

export class Metadata {
  requestId?: string;
  timestamp: string;
}

export class BaseResponse<T> {
  data: T;
  metadata?: Metadata;
  pagination?: Pagination;
}
