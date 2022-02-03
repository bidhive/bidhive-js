type Method = "GET" | "POST";

export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
  scope: string;
  refresh_token: string;
}

export type ClientCallback<Response> = (
  client: BidhiveClient,
  response: Response
) => void;

const TOKEN_REFRESH = 30 * 60 * 1000;

class BidhiveClient {
  private token: OAuth2Token | null = null;
  private clientId: string = "";
  private clientSecret: string = "";

  private refreshTokenInterval: NodeJS.Timer | null = null;

  constructor(private frontendUrl: string, private endpoint: string) {}

  public static init(options: { clientID: string; clientSecret: string }) {
    client.setClientId(options.clientID);
    client.setClientSecret(options.clientSecret);
  }

  public startTokenRefresh(
    refreshTokenFn: (payload: OAuth2Token) => Promise<OAuth2Token>
  ) {
    this.refreshTokenInterval = setInterval(async () => {
      if (this.token) {
        const newToken = await refreshTokenFn(this.token);
        this.token = newToken;
      }
    }, TOKEN_REFRESH);
  }

  public stopTokenRefresh() {
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval);
      this.refreshTokenInterval = null;
    }
  }

  private async request<Response extends {}, Request extends {}>(
    url: string,
    method: Method,
    payload?: Request
  ): Promise<Response> {
    // if (!this.token && !url.includes("token")) {
    //   throw new Error(
    //     "Performing a non-login Bidhive action with no access token."
    //   );
    // }

    const finalUrl = this.endpoint + url;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (this.token) {
      headers.append(
        "Authorization",
        `${this.token.token_type} ${this.token.access_token}`
      );
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

  public getFrontendUrl() {
    return this.frontendUrl;
  }

  public getEndpoint() {
    return this.endpoint;
  }

  public getToken() {
    return this.token;
  }

  public setToken(token: OAuth2Token) {
    this.token = token;
  }

  public getClientId() {
    return this.clientId;
  }

  public setClientId(clientId: string) {
    this.clientId = clientId;
  }

  public getClientSecret() {
    return this.clientSecret;
  }

  public setClientSecret(clientSecret: string) {
    this.clientSecret = clientSecret;
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

export const client = new BidhiveClient(
  "http://localhost:3000",
  "http://localhost:8000"
);
