export type AuthUser = {
  id: string;
  email: string;
  role: string;
  permissions: string[];
};

export type JwtAccessPayload = {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
  type: 'access';
};

export type JwtRefreshPayload = {
  sub: string;
  sessionId: string;
  type: 'refresh';
};
