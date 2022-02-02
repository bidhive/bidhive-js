import { Buffer } from "buffer";
import { createPost, client, OAuth2Token } from "../../client";

interface TokenAuthPayload {
  email: string;
  password: string;
  clientId: string;
  clientSecret: string;
}

export class AuthAPI {
  // private static refreshToken = createPost<Token, Token>(
  //   "/auth/refresh-token/",
  //   (client, { token }) => client.setToken(token)
  // );

  private static tokenAuth = async (payload: TokenAuthPayload) => {
    const formData = new FormData();
    const headers = new Headers();

    formData.append("grant_type", "password");
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

  static promptForLogin = async (clientId: string, clientSecret: string) => {
    const email = prompt("Email:");
    if (!email) {
      throw new Error("Email must be entered");
    }

    const password = prompt("Password:");
    if (!password) {
      throw new Error("Password must be entered");
    }

    const result = await this.tokenAuth({
      email,
      password,
      clientId,
      clientSecret,
    });
    client.setToken(result);
    client.setClientId(clientId);
    client.setClientSecret(clientSecret);
  };
}
