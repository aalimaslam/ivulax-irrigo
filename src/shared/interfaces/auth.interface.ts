export interface UserPayload {
  sub: number;       // User ID
  email: string;     // User email
  role: string;      // User role (admin/customer)
  iat?: number;      // Issued at (auto-added by JWT)
  exp?: number;      // Expiration time (auto-added by JWT)
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string; // Optional for refresh token implementation
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: string;
  };
  tokens: AuthTokens;
}