export type PaginatedResponse<T> = {
  data: T[];
  next_cursor?: string;
  current_cursor?: string;
};

export type AuthHeaders = {
  Authorization: string;
};
