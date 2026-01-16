import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { EmailField, PasswordField } from './FormFields';
import { FieldError } from './ui/field';
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
      <CardFooter className="flex-col gap-2">
        <Button
          form="login"
          type="submit"
          className="w-full bg-cyberpunk-black"
        >
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Guest Login
        </Button>
      </CardFooter>
    </Card>
  );
}

interface LoginFormInputs {
  email: string;
  password: string;
}

interface ValidationError {
  message?: string;
}

function LoginForm() {
  const { formData, handleInputChange } = useForm<LoginFormInputs>({
    email: '',
    password: '',
  });
  const [validationError, setValidationError] =
    useState<Array<ValidationError>>();

  const handleEmailChange = (val: string) => {
    handleInputChange('email', val);
  };

  const handlePasswordChange = (val: string) => {
    handleInputChange('password', val);
  };

  return (
    <form
      id="login"
      onSubmit={async (e) => {
        e.preventDefault();

        const { data, error } = await auth.signIn.email({
          email: formData.email,
          password: formData.password,
        });
        if (data) console.log(data);
        if (error) setValidationError([error]);
      }}
    >
      <div className="flex flex-col gap-4">
        <EmailField value={formData.email} handleChange={handleEmailChange} />
        <PasswordField
          value={formData.password}
          handleChange={handlePasswordChange}
        />
        <FieldError errors={validationError} />
      </div>
    </form>
  );
}
