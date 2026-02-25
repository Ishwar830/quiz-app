import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Label } from '@radix-ui/react-label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Field, FieldError, FieldLabel, FieldSet } from '../ui/field';
import { Input } from '../ui/input';
import type { ValidationError } from './LoginCard';
import type { FormEvent } from 'react';
import { joinRoom } from '@/api/room.api';

export function JoinRoomForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Array<ValidationError>>();
  const [roomCode, setRoomCode] = useState('');
  const [role, setRole] = useState('PLAYER');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { error } = await joinRoom(
        roomCode,
        role as 'PLAYER' | 'SPECTATOR',
      );

      if (error) {
        setErrors([error]);
      } else {
        navigate({
          to: '/rooms/$roomId',
          params: { roomId: roomCode },
        });
      }
    } catch (err) {
      setErrors([{ message: 'Unknown Error' }]);
    }
  };

  return (
    <div className="bg-white">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
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
          <FieldSet className="flex flex-row items-baseline">
            <p className="text-sm font-semibold">Role</p>
            <RadioGroup
              defaultValue="PLAYER"
              className="flex gap-6 ml-4"
              onValueChange={(val) => setRole(val)}
            >
              <div className="flex gap-2 items-center">
                <Label htmlFor="player-role">Player</Label>
                <RadioGroupItem value="PLAYER" id="player-role" />
              </div>
              <div className="flex gap-2 items-center">
                <Label htmlFor="spectator-role">Spectator</Label>
                <RadioGroupItem value="SPECTATOR" id="spectator-role" />
              </div>
            </RadioGroup>
          </FieldSet>
        </div>
        <FieldError errors={errors} />
        <button className="w-full bg-primary-400 hover:bg-primary-500  text-black font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">
          Join Room
        </button>
      </form>
    </div>
  );
}
