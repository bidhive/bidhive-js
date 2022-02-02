import { createPost, Token } from "../client";

interface LoginPayload {
  email: string;
  password: string;
}

export class AuthAPI {
  private static refreshToken = createPost<Token, Token>(
    "/auth/refresh-token/",
    (client, { token }) => client.setToken(token)
  );

  private static login = createPost<Token, LoginPayload>(
    "/auth/token-auth/",
    (client, { token }) => {
      client.setToken(token);
      client.startTokenRefresh(this.refreshToken);
    }
  );

  static promptForLogin = async () => {
    const email = prompt("Email:");
    if (!email) {
      throw new Error("Email must be entered");
    }

    const password = prompt("Password:");
    if (!password) {
      throw new Error("Password must be entered");
    }

    await this.login({ email, password });
  };
}
