import { createPost } from "../client";

interface Token {
  token: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export class AuthAPI {
  static login = createPost<Token, LoginPayload>(
    "/auth/token-auth/",
    (client, { token }) => {
      client.setToken(token);
    }
  );
}
