import { KEY_PREFIX } from "../key";

interface AuthorisationCodeMessage {
  code: string;
  scopes: string[];
}

function isAuthCodeMessage(message: any): message is AuthorisationCodeMessage {
  return (
    typeof message === "object" &&
    "code" in message &&
    typeof message.code === "string" &&
    "scopes" in message &&
    Array.isArray(message.scopes)
  );
}

/** Creates a login window, with which a user can sign into Bidhive
 * and authorise an application on behalf of which to access their Bidhive account data
 */
export function createLoginWindow(
  endpoint: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  /** Callback for when the code is received */
  callback?: (grantCode: string, scopes: string[]) => void
) {
  function handleWindowMessage(
    message: MessageEvent<AuthorisationCodeMessage | any>
  ) {
    if (isAuthCodeMessage(message.data)) {
      handleAuthCodeReceived(message.data.code, message.data.scopes);
    }
  }

  async function handleAuthCodeReceived(code: string, scopes: string[]) {
    localStorage.setItem(`${KEY_PREFIX}code`, code);
    localStorage.setItem(`${KEY_PREFIX}scope`, scopes.join(" "));
    window.removeEventListener("message", handleWindowMessage);
    if (callback) {
      callback(code, scopes);
    }
  }

  const popup = window.open(
    `${endpoint}/login-public?clientId=${clientId}&clientSecret=${clientSecret}&redirectUri=${redirectUri}`,
    "Bidhive Login",
    "popup, height=600, width=600"
  );

  if (popup) {
    window.addEventListener("message", handleWindowMessage);
  }
}
