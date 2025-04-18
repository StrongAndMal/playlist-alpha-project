import React, { useState } from 'react';

interface CommentFormProps {
  onSubmit: (text: string) => Promise<void>;
  isAuthenticated: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, isAuthenticated }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await onSubmit(comment);
      setComment('');
      setSuccess('Comment posted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
        <p className="text-gray-400 mb-3">You need to be logged in to comment</p>
        <a 
          href="/login" 
          className="inline-block gradient-bg text-white px-4 py-2 rounded-md hover:opacity-90 btn-hover-scale"
        >
          Log In
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="w-full rounded-lg p-4 bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Add a comment..."
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isSubmitting}
      />
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-2 text-green-500 text-sm">
          {success}
        </div>
      )}
      
      <button 
        type="submit" 
        className="mt-3 gradient-bg text-white px-4 py-2 rounded-md hover:opacity-90 btn-hover-scale btn-hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Posting...
          </span>
        ) : 'Post Comment'}
      </button>
    </form>
  );
};

export default CommentForm; 