import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
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
import { useForm } from '@/hooks/useForm';
import { auth } from '@/lib/authClient';

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

interface LoginFormInputs {
  email: string;
  password: string;
}

export interface ValidationError {
  message?: string;
}

function LoginForm() {
  const navigate = useNavigate();
  const { formData, handleInputChange } = useForm<LoginFormInputs>({
    email: '',
    password: '',
  });
  const [validationError, setValidationError] =
    useState<Array<ValidationError>>();
  const [isPending, setIsPending] = useState(false);

  const handleEmailChange = (val: string) => {
    handleInputChange('email', val);
  };

  const handlePasswordChange = (val: string) => {
    handleInputChange('password', val);
  };

  const handleSubmit = async () => {
    setIsPending(true);

    try {
      const { data, error } = await auth.signIn.email({
        email: formData.email,
        password: formData.password,
      });
      if (data) navigate({ to: '/dashboard' });
      if (error) setValidationError([error]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsPending(true);

    try {
      const { data, error } = await auth.signIn.anonymous();
      if (data) navigate({ to: '/dashboard' });
      if (error) setValidationError([error]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="flex flex-col gap-4">
        <EmailField value={formData.email} handleChange={handleEmailChange} />
        <PasswordField
          value={formData.password}
          handleChange={handlePasswordChange}
        />
        <FieldError errors={validationError} />

        <Button
          type="submit"
          className="w-full bg-primary-400 hover:bg-primary-500 text-black shadow-md shadow-primary-500/20 rounded-xl h-10"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <span>Login</span>
          )}
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
