import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Field, FieldLabel } from './ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './ui/input-group';

interface FieldProps {
  value: string;
  handleChange: (updatedValue: string) => void;
}

export function EmailField({ value, handleChange }: FieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        onChange={(e) => handleChange(e.target.value)}
        value={value}
        id="email"
        type="email"
        placeholder="johndoe@example.com"
        required
      />
    </Field>
  );
}

export function PasswordField({ value, handleChange }: FieldProps) {
  const [reveal, setReveal] = useState(false);
  return (
    <Field>
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="password"
          placeholder="Your password"
          type={reveal ? 'text' : 'password'}
          required
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={() => setReveal(!reveal)}>
            {reveal ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

export function UserNameField({ value, handleChange }: FieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <Input
        id="name"
        type="text"
        placeholder="John Doe"
        required
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
    </Field>
  );
}
