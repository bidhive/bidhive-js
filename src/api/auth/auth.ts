import { KEY_PREFIX } from "../key";
import { client, OAuth2Token, ClientInitOptions } from "../../client";
import { createLoginWindow } from "./create_login_window";

interface TokenAuthPayload {
  grant_type: "authorization_code";
  code: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
  scope: string;
}

function cacheTokens(token: OAuth2Token) {
  localStorage.setItem(`${KEY_PREFIX}token`, token.access_token);
  localStorage.setItem(`${KEY_PREFIX}refresh_token`, token.refresh_token);
}

function getCachedTokens(): [string | null, string | null] {
  return [
    localStorage.getItem(`${KEY_PREFIX}token`),
    localStorage.getItem(`${KEY_PREFIX}refresh_token`),
  ];
}

export class AuthAPI {
  private static tokenAuth = async (payload: TokenAuthPayload) => {
    const formData = new FormData();
    const headers = new Headers();

    formData.append("grant_type", payload.grant_type);
    formData.append("code", payload.code);
    formData.append("redirect_uri", payload.redirectUri);
    formData.append("client_id", payload.clientId);
    formData.append("client_secret", payload.clientSecret);
    formData.append("scope", payload.scope);

    const response = await fetch(`${client.getEndpoint()}/v2/oauth2/token/`, {
      credentials: "include",
      method: "POST",
      headers,
      body: formData,
      redirect: "follow",
      mode: "cors",
    });

    try {
      const result = (await response.json()) as OAuth2Token;
      // Cache token
      cacheTokens(result);
      return result;
    } catch (e) {
      localStorage.removeItem(`${KEY_PREFIX}code`);
      throw new Error("Token authentication response was not valid JSON.");
    }
  };

  private static refreshToken = async (refreshToken: string) => {
    const formData = new FormData();
    const headers = new Headers();

    formData.append("grant_type", "refresh_token");
    formData.append("refresh_token", refreshToken);
    formData.append("client_id", client.getClientId());
    formData.append("client_secret", client.getClientSecret());

    const response = await fetch(`${client.getEndpoint()}/v2/oauth2/token/`, {
      credentials: "include",
      method: "POST",
      headers,
      body: formData,
      redirect: "follow",
      mode: "cors",
    });

    try {
      const result = (await response.json()) as OAuth2Token;
      cacheTokens(result);
      return result;
    } catch (e) {
      throw new Error("Token authentication response was not valid JSON.");
    }
  };

  /** Opens a Bidhive login window, prompts for login and asks for application authorisation */
  static promptForLogin = async () => {
    createLoginWindow(
      client.getFrontendUrl(),
      client.getClientId(),
      client.getClientSecret(),
      client.getRedirectUri(),
      async (code, scopes) => {
        const token = await this.tokenAuth({
          grant_type: "authorization_code",
          code,
          redirectUri: client.getRedirectUri(),
          clientId: client.getClientId(),
          clientSecret: client.getClientSecret(),
          scope: scopes.join(" "),
        });
        client.setToken(token.access_token);
        client.setRefreshToken(token.refresh_token);
        client.startTokenRefresh(this.refreshToken);
      }
    );
  };

  public static initClient(options: ClientInitOptions) {
    client.init(options);
    const self = this;

    async function tryInitialLogin() {
      const [cacheToken, cacheRefreshToken] = getCachedTokens();

      if (cacheToken && cacheRefreshToken) {
        try {
          const token = await self.refreshToken(cacheRefreshToken);
          client.setToken(token.access_token);
          client.setRefreshToken(token.refresh_token);
          client.startTokenRefresh(self.refreshToken);
        } catch (e) {
          // Initial login failed
          console.log("Initial Bidhive client login failed.");
        }
      }
    }

    tryInitialLogin();
  }
}
