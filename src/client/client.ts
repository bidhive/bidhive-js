type Method = "GET" | "POST";

export type ClientCallback<Response> = (
  client: BidhiveClient,
  response: Response
) => void;

class BidhiveClient {
  private token = "";

  constructor(private endpoint: string) {}

  private async request<Response extends {}, Request extends {}>(
    url: string,
    method: Method,
    payload?: Request
  ): Promise<Response> {
    if (!this.token && !url.includes("token")) {
      throw new Error(
        "Performing a non-login Bidhive action with no access token."
      );
    }

    const finalUrl = this.endpoint + url;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (this.token) {
      headers.append("Authorization", `JWT ${this.token}`);
    }

    const response = await fetch(finalUrl, {
      credentials: "include",
      body: payload && JSON.stringify(payload),
      headers,
      method,
      redirect: "follow",
      mode: "cors",
    });

    if (response.status >= 200 && response.status <= 300) {
      if (response.status === 204) {
        return {} as Response;
      }

      return (await response.json()) as Response;
    } else {
      throw response;
    }
  }

  public getToken() {
    return this.token;
  }

  public setToken(token: string) {
    this.token = token;
  }

  public async get<Response extends {}>(
    url: string,
    callback?: ClientCallback<Response>
  ): Promise<Response> {
    const response = await this.request<Response, Request>(url, "GET");
    if (callback) {
      callback(this, response);
    }
    return response;
  }

  public async post<Response extends {}, Request extends {}>(
    url: string,
    payload: Request,
    callback?: ClientCallback<Response>
  ): Promise<Response> {
    const response = await this.request<Response, Request>(
      url,
      "POST",
      payload
    );
    if (callback) {
      callback(this, response);
    }
    return response;
  }
}

export const client = new BidhiveClient("http://localhost:8000");
