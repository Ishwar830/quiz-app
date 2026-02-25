import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { FieldError, FieldSeparator } from '../ui/field';
import { EmailField, PasswordField } from './FormFields';
import type { FormEvent } from 'react';
import { anonymousLogin, userLogin } from '@/api/user.api';

export function LoginCard() {
  return (
    <Card className="w-full max-w-sm mx-auto border shadow=sm bg-white overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Link to="/signup">
            <Button variant="link" className="text-secondary-500">
              Sign Up
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}

export interface ValidationError {
  message?: string;
}

function LoginForm() {
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const [validationError, setValidationError] =
    useState<Array<ValidationError>>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      setIsPending(true);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const { error } = await userLogin(email, password);
      
      if (error) setValidationError([error]);
      else navigate({ to: '/dashboard' });
    } catch (err) {
      console.log('failure');
      toast.warn('Unknown error occurred. Try Again!');
    } finally {
      setIsPending(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setIsPending(true);
      const { error } = await anonymousLogin();
      if (error) setValidationError([error]);
      else navigate({ to: '/dashboard' });
    } catch (err) {
      toast.warn('Unknown error occurred. Try Again!');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <EmailField />
        <PasswordField />
        <FieldError errors={validationError} />

        <Button
          type="submit"
          aria-busy={isPending}
          className="w-full flex gap-2 bg-primary-400 hover:bg-primary-500 text-black shadow-md shadow-primary-500/20 rounded-xl h-10"
          disabled={isPending}
        >
          <span>Login</span>
          {isPending && <Loader2 className="animate-spin" />}
        </Button>

        <FieldSeparator>Or</FieldSeparator>
        <Button
          variant="outline"
          className="w-full rounded-xl h-10 gap-2"
          disabled={isPending}
          onClick={handleGuestLogin}
        >
          <Zap size={16} className="text-amber-500" />
          Guest Login
        </Button>
      </div>
    </form>
  );
}
