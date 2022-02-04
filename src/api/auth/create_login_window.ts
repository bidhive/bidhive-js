export function createLoginWindow(
  endpoint: string,
  clientId: string,
  clientSecret: string
) {
  function handleWindowMessage(message: MessageEvent<Window>) {
    console.debug(`Message origin: ${message.origin}`);
    console.debug(`Message data:`, message.data);
  }

  const popup = window.open(
    `${endpoint}/login-public?clientId=${clientId}&clientSecret=${clientSecret}`,
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
