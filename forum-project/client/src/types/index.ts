export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Post {
  _id: string;
  title: string;
  body: string;
  author: Pick<User, 'id' | 'username'>;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
