import { ACCESS_TOKEN } from '@/stores/auth-store';
import { getCookie } from './cookies';
import { QueryClient } from '@tanstack/react-query';

export interface IApiRequestServiceProps {
  url: string;
  method: string;
  params?: Record<string, any> | null;
  body?: Record<string, any> | null;
  headers?: Record<string, any>;
  contentType?: string;
  baseURL?: string;
}
export const queryClient = new QueryClient();
export const fetchClientQuery = async <T>(
  args: IApiRequestServiceProps
): Promise<{
  data: T | null;
  error: string | null;
  status: number;
}> => {
  const cookieState = getCookie(ACCESS_TOKEN);
  const accessToken = cookieState ? JSON.parse(cookieState) : '';

  const options: Record<string, any> = {
    method: args.method,
    headers: {
      ...args.headers,
      'Content-Type': args.contentType || 'application/json',
    },
  };
  if (accessToken) {
    options['headers']['Authorization'] = `Bearer ${accessToken}`;
  }
  let urlSearchParams = '';
  if (args?.params) {
    urlSearchParams = '?' + new URLSearchParams(args?.params);
  }
  if (args?.body) {
    options['body'] = JSON.stringify(args?.body);
  }

  const url = `${args.baseURL || '/api'}${args.url}${urlSearchParams}`;
  let result: any = {};
  let data: any = null;
  try {
    result = await fetch(url, options);
    data = await result.json();
  } catch (error) {
    console.log('🔴 Error', error);
  }

  if (!result?.ok || !data) {
    console.log('🔴 Error', result?.ok, result?.status, data);
    return {
      data: null,
      error: data.message || 'Something went wrong',
      status: result.status,
    };
  } else {
    return {
      ...(data || {}),
      data: data,
      error: null,
      status: result.status,
    };
  }
};
