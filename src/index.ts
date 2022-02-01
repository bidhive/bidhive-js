export function getMessage() {
  return "hello!";
}

export interface User {
  id: number;
  email: string;
}

export function getTestUser(): User {
  return {
    id: 1,
    email: "test@bidhive.com",
  };
}
