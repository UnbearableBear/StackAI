import axios from 'axios';

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token?: string;
  user?: any;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_AUTH_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing');
  }

  const requestUrl = `${supabaseUrl}/auth/v1/token?grant_type=password`;

  const response = await axios.post(
    requestUrl,
    {
      email: data.email,
      password: data.password,
      gotrue_meta_security: {},
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Apikey": supabaseAnonKey,
      },
      timeout: 10000,
    }
  );

  return response.data;
};