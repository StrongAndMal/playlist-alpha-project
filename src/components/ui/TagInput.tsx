import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  placeholder = "Add tags..."
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Parse comma-separated value into array of tags
  useEffect(() => {
    if (value) {
      const tagArray = value.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      setTags(tagArray);
    } else {
      setTags([]);
    }
  }, [value]);

  // Handle input change and detect comma to add new tag
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (newValue.includes(',')) {
      // Extract tag before the comma
      const newTag = newValue.split(',')[0].trim();
      
      if (newTag && !tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        onChange(updatedTags.join(', '));
      }
      
      // Clear the input field
      setInputValue('');
    } else {
      setInputValue(newValue);
    }
  };

  // Handle key press to detect Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        onChange(updatedTags.join(', '));
      }
      
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove the last tag when backspace is pressed and input is empty
      const updatedTags = tags.slice(0, -1);
      onChange(updatedTags.join(', '));
    }
  };

  // Handle removing a tag
  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    onChange(updatedTags.join(', '));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-800 border border-gray-700 rounded-md min-h-[42px]">
        {tags.map((tag, index) => (
          <div 
            key={index} 
            className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full hover:bg-blue-500 focus:outline-none"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        <input 
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length > 0 ? "" : placeholder}
          className="flex-grow min-w-[120px] bg-transparent border-none focus:outline-none text-white text-sm p-1"
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Press Enter or use commas to add tags
      </p>
    </div>
  );
};

export default TagInput; 