import React from 'react';

interface ProfileBioProps {
  bio: string;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ bio }) => {
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
        <span className="mr-2">Bio</span>
        <div className="h-px bg-gradient-to-r from-blue-500 to-purple-500 flex-grow opacity-50"></div>
      </h2>
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-5 border border-gray-700 shadow-inner">
        {bio ? (
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
            {bio}
          </p>
        ) : (
          <p className="text-gray-500 italic">No bio provided.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileBio; 