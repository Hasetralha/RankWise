export const generateAvatar = (seed?: string) => {
  // If no seed is provided or if it's 'default', return the default avatar
  if (!seed || seed === 'default') {
    return '/images/default-avatar.svg';
  }
  
  // For other cases, use DiceBear's initials style
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=gray&radius=50`;
};

// Function to get default avatar
export const getDefaultAvatar = () => {
  return '/images/default-avatar.svg';
}; 