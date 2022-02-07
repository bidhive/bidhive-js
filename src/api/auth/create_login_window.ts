import { KEY_PREFIX } from "../key";

interface AuthorisationCodeMessage {
  code: string;
}

function isAuthCodeMessage(message: any): message is AuthorisationCodeMessage {
  return (
    typeof message === "object" &&
    "code" in message &&
    typeof message["code"] === "string"
  );
}

export function createLoginWindow(
  endpoint: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  /** Callback for when the code is received */
  callback?: (grantCode: string) => void
) {
  function handleWindowMessage(
    message: MessageEvent<AuthorisationCodeMessage | any>
  ) {
    if (isAuthCodeMessage(message.data)) {
      handleAuthCodeReceived(message.data.code);
    }
  }

  async function handleAuthCodeReceived(code: string) {
    localStorage.setItem(`${KEY_PREFIX}code`, code);
    window.removeEventListener("message", handleWindowMessage);
    if (callback) {
      callback(code);
    }
  }

  const popup = window.open(
    `${endpoint}/login-public?clientId=${clientId}&clientSecret=${clientSecret}&redirectUri=${redirectUri}`,
    "Bidhive Login",
    "popup"
  );

  if (popup) {
    window.addEventListener("message", handleWindowMessage);
  } else {
    return false;
  }

  return true;
}
