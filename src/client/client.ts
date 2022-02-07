import { KEY_PREFIX } from "../api/key";

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
  private token: string | null = localStorage.getItem(`${KEY_PREFIX}token`);
  private refreshToken: string | null = localStorage.getItem(
    `${KEY_PREFIX}refresh_token`
  );
  private clientId: string = "";
  private clientSecret: string = "";
  private redirectUri: string = "";

  private refreshTokenInterval: NodeJS.Timer | null = null;

  constructor(private frontendUrl: string, private endpoint: string) {}

  public static init(options: {
    clientID: string;
    clientSecret: string;
    redirectUri: string;
  }) {
    console.log(`Initialising Bidhive client with options `, options);
    client.setClientId(options.clientID);
    client.setClientSecret(options.clientSecret);
    client.setRedirectUri(options.redirectUri);
  }

  public startTokenRefresh(
    refreshTokenFn: (
      token: string,
      refreshToken: string
    ) => Promise<OAuth2Token>
  ) {
    this.refreshTokenInterval = setInterval(async () => {
      if (this.token && this.refreshToken) {
        const newToken = await refreshTokenFn(this.token, this.refreshToken);
        this.token = newToken.access_token;
        this.refreshToken = newToken.refresh_token;
        localStorage.setItem(`${KEY_PREFIX}token`, this.token);
        localStorage.setItem(`${KEY_PREFIX}refresh_token`, this.refreshToken);
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
      headers.append("Authorization", `Bearer ${this.token}`);
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

  public setToken(token: string) {
    this.token = token;
  }

  public setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  public getClientId() {
    return this.clientId;
  }

  protected setClientId(clientId: string) {
    this.clientId = clientId;
  }

  public getClientSecret() {
    return this.clientSecret;
  }

  protected setClientSecret(clientSecret: string) {
    this.clientSecret = clientSecret;
  }

  public getRedirectUri() {
    return this.redirectUri;
  }

  protected setRedirectUri(redirectUri: string) {
    this.redirectUri = redirectUri;
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

export const initClient = BidhiveClient.init;
