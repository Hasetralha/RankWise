import Image from 'next/image';
import { getDefaultAvatar } from '@/utils/avatar';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ 
  src, 
  alt = 'User avatar', 
  size = 40,
  className = ''
}: AvatarProps) {
  const avatarSrc = src || getDefaultAvatar();

  return (
    <div 
      className={`relative rounded-full overflow-hidden bg-gray-200 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={avatarSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${size}px`}
      />
    </div>
  );
} 