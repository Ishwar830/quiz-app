import { auth } from '@/lib/authClient';

export const userLogin = async (email: string, password: string) => {
  const { data, error } = await auth.signIn.email({
    email,
    password,
  });

  return { user: data?.user ?? null, error };
};

export const userSignUp = async (
  name: string,
  email: string,
  password: string,
) => {
  const { data, error } = await auth.signUp.email({
    name,
    email,
    password,
  });

  return { user: data?.user ?? null, error };
};

export const getUser = async () => {
  const { data, error } = await auth.getSession();
  return { user: data?.user ?? null, error };
};

export const anonymousLogin = async () => {
  const { data, error } = await auth.signIn.anonymous();

  return { user: data?.user ?? null, error };
};
