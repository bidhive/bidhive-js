import { KEY_PREFIX } from "../api/key";

type Method = "GET" | "POST";

export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
  scope: string;
  refresh_token: string;
}

const TOKEN_REFRESH = 30 * 60 * 1000;

/** Represents which area your Bidhive account resides in */
type Zone = "ausnz" | "euuk" | "us";

const FRONTEND_URLS: Record<Zone, string> = {
  ausnz: "https://app.bidhive.com",
  euuk: "https://app.bidhive.co.uk",
  us: "https://app.bidhive.us",
};

const BACKEND_URLS: Record<Zone, string> = {
  ausnz: "https://api.bidhive.com",
  euuk: "https://api.bidhive.co.uk",
  us: "https://api.bidhive.us",
};

class BidhiveClient {
  private token: string | null = localStorage.getItem(`${KEY_PREFIX}token`);
  private refreshToken: string | null = localStorage.getItem(
    `${KEY_PREFIX}refresh_token`
  );
  private frontendUrl: string = "";
  private endpoint: string = "";
  private clientId: string = "";
  private clientSecret: string = "";
  private redirectUri: string = "";

  private refreshTokenInterval: NodeJS.Timer | null = null;

  public static init(options: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    zone: Zone;
  }) {
    console.log(`Initialising Bidhive client with options `, options);
    client.setFrontendUrl(
      "http://localhost:3000" || FRONTEND_URLS[options.zone]
    );
    client.setEndpoint("http://localhost:8000" || BACKEND_URLS[options.zone]);
    client.setClientId(options.clientId);
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

  protected setFrontendUrl(frontendUrl: string) {
    this.frontendUrl = frontendUrl;
  }

  public getEndpoint() {
    return this.endpoint;
  }

  protected setEndpoint(endpoint: string) {
    this.endpoint = endpoint;
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

  public async get<Response extends {}>(url: string): Promise<Response> {
    const response = await this.request<Response, Request>(url, "GET");
    return response;
  }

  public async post<Response extends {}, Request extends {}>(
    url: string,
    payload: Request
  ): Promise<Response> {
    const response = await this.request<Response, Request>(
      url,
      "POST",
      payload
    );
    return response;
  }
}

export const client = new BidhiveClient();

export const initClient = BidhiveClient.init;
