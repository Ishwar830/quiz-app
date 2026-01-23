import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { EmailField, PasswordField } from './FormFields';
import { FieldError, FieldSeparator } from './ui/field';
import { useForm } from '@/hooks/useForm';
import { auth } from '@/lib/authClient';

export function LoginCard() {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Link to="/signup">
            <Button variant="link">Sign Up</Button>
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <span className="animate-spin">
              <Loader2 />
            </span>
          ) : (
            <span>Login</span>
          )}
        </Button>

        <FieldSeparator>Or</FieldSeparator>
        <Button
          variant="outline"
          className="w-full"
          disabled={isPending}
          onClick={handleGuestLogin}
        >
          Guest Login
        </Button>
      </div>
    </form>
  );
}
