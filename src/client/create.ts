import { client } from "./client";

type QueryParamType =
  | (string | number | boolean | Array<string | number | boolean>)
  | undefined;

export interface QueryParams {
  [key: string]: QueryParamType;
}

type RequestUrl<URLParams = {}> = string | ((params: URLParams) => string);

type GetFn<Response, URLParams extends QueryParams = {}> = (
  queryParams?: URLParams
) => Promise<Response>;

export function createGet<Response, UrlParams extends QueryParams = {}>(
  url: RequestUrl
): GetFn<Response, UrlParams> {
  return async (queryParams?: UrlParams) => {
    let queryString = "";
    if (queryParams) {
      const urlSearchParams = new URLSearchParams();

      const toString = (value: any) => {
        if (typeof value === "string") {
          return value;
        }
        if (typeof value === "number") {
          return value.toString();
        }
        if (typeof value === "boolean") {
          return value.toString();
        }
      };

      Object.keys(queryParams)
        .filter((key) => key !== "ordering")
        .forEach((key) => {
          if (typeof queryParams[key] !== "undefined") {
            if (Array.isArray(queryParams[key])) {
              const values = (queryParams[key] as Array<string | number>).map(
                (item) => toString(item)
              );
              values.forEach(
                (value) => value && urlSearchParams.append(key, value)
              );
            } else {
              const value = toString(queryParams[key]);
              if (value) {
                urlSearchParams.append(key, value);
              }
            }
          }
        });

      // NOTE(johan): URLSearchParams encodes commas, and we don't want that
      queryString = urlSearchParams.toString().replace("%2C", ",");
    }

    let resolvedUrl: string;
    if (typeof url === "string") {
      resolvedUrl = url;
    } else if (queryParams) {
      resolvedUrl = url(queryParams);
    } else {
      throw new Error(
        "Tried to call createGet's url as a function but with no parameters"
      );
    }

    const finalUrl = queryString
      ? `${
          resolvedUrl.endsWith("/")
            ? resolvedUrl.slice(0, resolvedUrl.length - 1)
            : resolvedUrl
        }?${queryString}`
      : resolvedUrl;

    return (await client.get(finalUrl)) as Response;
  };
}

export function createPost<Response, Request>(
  url: string
): (payload: Request) => Promise<Response> {
  return async (payload: Request) => {
    return (await client.post(url, payload)) as Response;
  };
}
