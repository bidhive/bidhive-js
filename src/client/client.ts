class BidhiveClient {
  private accessToken = "";

  constructor(private endpoint: string) {}

  private async request<Response extends {}>(url: string) {
    if (!this.accessToken) {
      throw new Error("Calling Bidhive client with no access token.");
    }

    const finalUrl = this.endpoint + url;

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${this.accessToken}`);

    const response = await fetch(finalUrl, {
      credentials: "include",
      headers,
      method: "GET",
      redirect: "follow",
      mode: "cors",
    });

    if (response.status >= 200 && response.status <= 300) {
      if (response.status === 204) {
        return {};
      }

      return (await response.json()) as Response;
    } else {
      throw response;
    }
  }

  public getAccessToken() {
    return this.accessToken;
  }

  public setAccessToken(token: string) {
    this.accessToken = token;
  }

  public async loadBids(): Promise<any> {
    return await this.request("/bid/");
  }
}

export const client = new BidhiveClient("http://localhost:8000");
