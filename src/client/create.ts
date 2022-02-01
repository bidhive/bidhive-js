import { client, ClientCallback } from "./client";

export function createGet<Response>(url: string): () => Promise<Response> {
  return async (callback?: ClientCallback<Response>) => {
    return (await client.get(url, callback)) as Response;
  };
}

export function createPost<Response, Request>(
  url: string,
  callback?: ClientCallback<Response>
): (payload: Request) => Promise<Response> {
  return async (payload: Request) => {
    return (await client.post(url, payload, callback)) as Response;
  };
}
