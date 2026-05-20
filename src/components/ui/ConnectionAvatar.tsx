import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../lib/utils';

type ConnectionAvatarProps = {
  connected: boolean;
  size?: 'sm' | 'md';
  className?: string;
};

export function ConnectionAvatar({ connected, size = 'md', className }: ConnectionAvatarProps) {
  const sizeClasses = size === 'sm' ? 'w-9 h-9' : 'w-12 h-12';
  const iconSize = size === 'sm' ? 18 : 22;

  return (
    <span
      role="img"
      aria-label={connected ? 'Connesso' : 'Non connesso'}
      className={cn(
        'inline-flex items-center justify-center rounded-full border transition-all duration-300',
        sizeClasses,
        connected
          ? 'bg-gradient-to-br from-neon-orange to-neon-fire border-neon-orange/70 shadow-[0_0_18px_rgba(255,140,0,0.65)]'
          : 'bg-gray-700/70 border-gray-500/40',
        className
      )}
    >
      <User className={cn('transition-colors', connected ? 'text-black' : 'text-gray-200')} size={iconSize} />
    </span>
  );
}
