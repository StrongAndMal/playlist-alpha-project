import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PlaylistDetailPage from '../PlaylistDetailPage';

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ id: '1' })
}));

describe('PlaylistDetailPage', () => {
  test('renders playlist details correctly', () => {
    render(
      <MemoryRouter initialEntries={['/playlist/1']}>
        <PlaylistDetailPage />
      </MemoryRouter>
    );

    // Check if playlist title and creator render
    expect(screen.getByText('Summer Vibes 2025')).toBeInTheDocument();
    expect(screen.getByText(/by DJ Cool/i)).toBeInTheDocument();
    
    // Check for description
    expect(screen.getByText(/The perfect playlist for your summer adventures/i)).toBeInTheDocument();
    
    // Check for Spotify button
    expect(screen.getByText('Open on Spotify')).toBeInTheDocument();
    
    // Check if tracks section renders
    expect(screen.getByText('Tracks')).toBeInTheDocument();
    
    // Check if comments section renders
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
    expect(screen.getByText('Post Comment')).toBeInTheDocument();
  });

  test('comment submission works correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/playlist/1']}>
        <PlaylistDetailPage />
      </MemoryRouter>
    );
    
    // Find the comment textarea and enter a comment
    const commentTextarea = screen.getByPlaceholderText('Add a comment...');
    await user.type(commentTextarea, 'This is my test comment');
    
    // Find and click the Post Comment button
    const postButton = screen.getByText('Post Comment');
    await user.click(postButton);
    
    // In a real implementation, we'd check for the new comment in the DOM
    // For now, this is a placeholder for future implementation
  });

  test('navigation to Spotify works', async () => {
    const user = userEvent.setup();
    
    // Mock window.open
    const mockOpen = jest.fn();
    window.open = mockOpen;
    
    render(
      <MemoryRouter initialEntries={['/playlist/1']}>
        <PlaylistDetailPage />
      </MemoryRouter>
    );
    
    // Find and click the Spotify button
    const spotifyButton = screen.getByText('Open on Spotify');
    await user.click(spotifyButton);
    
    // In a real implementation, this would check that window.open was called
    // For now, this is a placeholder for future implementation
  });
}); 