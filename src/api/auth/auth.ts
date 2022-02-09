import { KEY_PREFIX } from "../key";
import { client, OAuth2Token } from "../../client";
import { createLoginWindow } from "./create_login_window";

interface TokenAuthPayload {
  grant_type: "authorization_code";
  code: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
  scope: string;
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

    const response = await fetch(`${client.getEndpoint()}/oauth2/token/`, {
      credentials: "include",
      method: "POST",
      headers,
      body: formData,
      redirect: "follow",
      mode: "cors",
    });

    try {
      const result = (await response.json()) as OAuth2Token;
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

    const response = await fetch(`${client.getEndpoint()}/oauth2/token/`, {
      credentials: "include",
      method: "POST",
      headers,
      body: formData,
      redirect: "follow",
      mode: "cors",
    });

    try {
      const result = (await response.json()) as OAuth2Token;
      return result;
    } catch (e) {
      throw new Error("Token authentication response was not valid JSON.");
    }
  };

  // TODO(alec): Auto-set existing token and refresh token
  static tryInitialLogin = async () => {
    const cacheToken = localStorage.getItem(`${KEY_PREFIX}token`);
    const cacheRefreshToken = localStorage.getItem(
      `${KEY_PREFIX}refresh_token`
    );
    if (cacheToken && cacheRefreshToken) {
      const token = await this.refreshToken(cacheRefreshToken);
    }
  };

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
}
