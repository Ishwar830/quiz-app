import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'lg';
}

export default function UserAvatar({
  name,
  imageUrl,
  size = 'sm',
}: UserAvatarProps) {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <Avatar size={size}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback
        className={`${bgColor} text-white font-semibold`}
      >
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
