import { Buffer } from "buffer";
import { client, OAuth2Token } from "../../client";
import { createLoginWindow } from "./create_login_window";

interface TokenAuthPayload {
  email: string;
  password: string;
  clientId: string;
  clientSecret: string;
}

export class AuthAPI {
  private static tokenAuth = async (payload: TokenAuthPayload) => {
    const formData = new FormData();
    const headers = new Headers();

    formData.append("grant_type", "authorization_code");
    formData.append("username", payload.email);
    formData.append("password", payload.password);

    headers.append(
      "Authorization",
      `Basic ${Buffer.from(
        payload.clientId + ":" + payload.clientSecret,
        "utf8"
      ).toString("base64")}`
    );

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

  private static refreshToken = async (payload: OAuth2Token) => {
    const formData = new FormData();
    const headers = new Headers();

    formData.append("grant_type", "refresh_token");
    formData.append("refresh_token", payload.refresh_token);
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

  static promptForLogin = async () => {
    const loginResult = createLoginWindow(
      client.getFrontendUrl(),
      client.getClientId(),
      client.getClientSecret(),
      client.getRedirectUri()
    );
    console.debug(`Login result:`, loginResult);
    //   const email = prompt("Email:");
    //   if (!email) {
    //     throw new Error("Email must be entered");
    //   }

    //   const password = prompt("Password:");
    //   if (!password) {
    //     throw new Error("Password must be entered");
    //   }

    //   const result = await this.tokenAuth({
    //     email,
    //     password,
    //     clientId: client.getClientId(),
    //     clientSecret: client.getClientSecret(),
    //   });
    //   client.setToken(result);
    //   client.startTokenRefresh(this.refreshToken);
  };
}
