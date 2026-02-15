import api from "@/lib/api/axios.interceptor";

export interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  author?: string;
  coverImage?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  createdAt?: string;
}

export interface NewsListMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  errorCode: number;
  message: string;
  result: T;
  meta?: Record<string, any>;
}

export interface NewsListParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
}

const NEWS_ENDPOINT = "news";

export const newsQueryKeys = {
  list: (params: NewsListParams) => ["news", "list", params] as const,
  detail: (slug: string) => ["news", "detail", slug] as const,
};

export const fetchNewsList = async (params: NewsListParams = {}) => {
  const response = await api.get<ApiResponse<NewsItem[]>>(NEWS_ENDPOINT, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 6,
      ...(params.search ? { search: params.search } : {}),
      ...(params.tag ? { tag: params.tag } : {}),
    },
  });

  return {
    items: response.data?.result ?? [],
    meta: (response.data?.meta ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 6,
      totalItems: 0,
      totalPages: 1,
    }) as NewsListMeta,
  };
};

export const fetchNewsDetail = async (slug: string) => {
  const response = await api.get<ApiResponse<NewsItem>>(`${NEWS_ENDPOINT}/${slug}`);
  return response.data?.result;
};

export const formatNewsDate = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
