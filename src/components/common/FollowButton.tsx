import React, { useState } from 'react';
import { UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import Button from './Button';

interface FollowButtonProps {
  userId: string;
  username: string;
  isFollowing: boolean;
  onFollowChange: (isFollowing: boolean) => Promise<void>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  username,
  isFollowing,
  onFollowChange,
  className = '',
  size = 'md',
  variant = 'default'
}) => {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const [error, setError] = useState<string | null>(null);

  const handleFollowClick = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await onFollowChange(!following);
      setFollowing(!following);
    } catch (err) {
      setError(`Failed to ${following ? 'unfollow' : 'follow'} ${username}`);
      console.error('Follow action error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getButtonProps = () => {
    if (variant === 'outline') {
      return following
        ? {
            variant: 'outline' as const,
            className: 'text-red-400 border-red-400 hover:bg-red-400/10'
          }
        : {
            variant: 'outline' as const,
            className: 'text-blue-400 border-blue-400 hover:bg-blue-400/10'
          };
    }

    // Default variant
    return following
      ? {
          variant: 'secondary' as const
        }
      : {
          variant: 'primary' as const
        };
  };

  return (
    <div className={`inline-block ${className}`}>
      <Button
        size={size}
        isLoading={loading}
        onClick={handleFollowClick}
        icon={following ? <UserMinusIcon className="h-4 w-4" /> : <UserPlusIcon className="h-4 w-4" />}
        {...getButtonProps()}
      >
        {following ? 'Unfollow' : 'Follow'}
      </Button>
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default FollowButton; 