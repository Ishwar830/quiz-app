import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
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
import { FieldError } from '../ui/field';
import { EmailField, PasswordField, UserNameField } from './FormFields';
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

interface ValidationError {
  message?: string;
}

function SignUpForm() {
  const navigate = useNavigate();
  const [validationError, setValidationError] =
    useState<Array<ValidationError>>();
  const [isPending, setIsPending] = useState(false);

  const formAction = async (formData: FormData) => {
    try {
      setIsPending(true);
      const { data, error } = await auth.signUp.email({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      if (data) navigate({ to: '/dashboard' });
      if (error) setValidationError([error]);
    } catch (err) {
      toast.warn('Unknown error occurred. Try Again!');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-4">
        <UserNameField />
        <EmailField />
        <PasswordField />
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
