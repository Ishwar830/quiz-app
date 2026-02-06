import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from './ui/field';
import { Input } from './ui/input';
import type { ValidationError } from './LoginCard';
import type { FormEvent } from 'react';

export function JoinRoomForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Array<ValidationError>>();
  const [roomCode, setRoomCode] = useState('');
  const [role, setRole] = useState('PLAYER');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/rooms/${roomCode}?role=${role}`, {
        method: 'POST',
      });

      const { data, error } = await res.json();

      if (res.ok) {
        console.log(data);
        navigate({
          to: '/rooms/$roomId',
          params: { roomId: roomCode },
        });
      } else {
        setErrors([error]);
      }
    } catch (err) {
      setErrors([{ message: 'Server Error' }]);
    }
  };

  return (
    <div className="bg-white">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <Field>
            <FieldLabel htmlFor="roomCode">Room Code</FieldLabel>
            <Input
              className="text-sm"
              onChange={(e) => setRoomCode(e.target.value)}
              id="roomCode"
              placeholder="Enter Room Code to join..."
              required
            />
          </Field>
          <RadioGroup
            defaultValue="PLAYER"
            className="max-w-sm"
            onValueChange={(val) => setRole(val)}
          >
            <p className="text-sm mt-4">Role</p>
            <FieldLabel htmlFor="player-role">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Player</FieldTitle>
                  <FieldDescription>Participate in quiz.</FieldDescription>
                </FieldContent>
                <RadioGroupItem value="PLAYER" id="player-role" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="spectator-role">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Spectator</FieldTitle>
                  <FieldDescription>Spectate other players</FieldDescription>
                </FieldContent>
                <RadioGroupItem value="SPECTATOR" id="spectator-role" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </div>
        <FieldError errors={errors} />
        <button className="w-full bg-primary-400 hover:bg-primary-500  text-black font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">
          Join Room
        </button>
      </form>
    </div>
  );
}
