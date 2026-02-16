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
} from '../ui/card';
import { Button } from '../ui/button';
import { FieldError } from '../ui/field';
import { EmailField, PasswordField, UserNameField } from './FormFields';
import { useForm } from '@/hooks/useForm';
import { auth } from '@/lib/authClient';

export function SignUpCard() {
  return (
    <Card className="w-full max-w-sm mx-auto border bg-white shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>
          Enter your details below to get started
        </CardDescription>
        <CardAction>
          <Link to="/login">
            <Button variant="link" className="text-secondary-500">
              Login
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  );
}

interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
}

interface ValidationError {
  message?: string;
}

function SignUpForm() {
  const navigate = useNavigate();
  const { formData, handleInputChange } = useForm<SignUpFormInputs>({
    name: '',
    email: '',
    password: '',
  });
  const [validationError, setValidationError] =
    useState<Array<ValidationError>>();
  const [isPending, setIsPending] = useState(false);

  const handleNameChange = (val: string) => {
    handleInputChange('name', val);
  };

  const handleEmailChange = (val: string) => {
    handleInputChange('email', val);
  };

  const handlePasswordChange = (val: string) => {
    handleInputChange('password', val);
  };

  const handleSubmit = async () => {
    setIsPending(true);

    try {
      const { data, error } = await auth.signUp.email({
        name: formData.name,
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="flex flex-col gap-4">
        <UserNameField value={formData.name} handleChange={handleNameChange} />
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
            <span>Sign up</span>
          )}
        </Button>
      </div>
    </form>
  );
}
