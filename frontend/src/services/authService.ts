interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  status: number;
  user: {
    name: string;
    email: string;
    roleName: string;
    roleId: number;
  };
}

export const loginService = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await fetch(`api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store", // Ensure no caching
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const result = response.json();

  return result;
};
