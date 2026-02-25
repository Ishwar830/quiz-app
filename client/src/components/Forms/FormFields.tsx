import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { Field, FieldLabel } from '../ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group';

export function EmailField() {
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="johndoe@example.com"
        required
      />
    </Field>
  );
}

export function PasswordField() {
  const [reveal, setReveal] = useState(false);
  return (
    <Field>
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="password"
          name="password"
          placeholder="Your password"
          type={reveal ? 'text' : 'password'}
          required
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            aria-controls="password"
            aria-label={reveal ? 'Show password' : 'Hide password'}
            aria-pressed={reveal}
            onClick={() => setReveal(!reveal)}
          >
            {reveal ? (
              <EyeOffIcon aria-hidden="true" />
            ) : (
              <EyeIcon aria-hidden="true" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

export function UserNameField() {
  return (
    <Field>
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <Input
        id="name"
        name="name"
        type="text"
        placeholder="John Doe"
        required
      />
    </Field>
  );
}
