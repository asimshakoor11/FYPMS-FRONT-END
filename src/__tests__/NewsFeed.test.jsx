import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewsFeed from '../Components/NewsFeed';
import axios from 'axios';

// Mock the axios module
vi.mock('axios');

describe('NewsFeed Component', () => {
  it('should render the NewsFeed component', () => {
    render(<NewsFeed />);
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('No posts yet.')).toBeInTheDocument();
  });

  it('should display posts fetched from API', async () => {
    const mockPosts = [
      { title: 'Post 1', description: 'Description 1', name: 'User 1', date: '2024-09-01' },
      { title: 'Post 2', description: 'Description 2', name: 'User 2', date: '2024-09-02' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockPosts });

    render(<NewsFeed />);
    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });
  });

  it('should show the post form when "Share in Feed" is clicked', () => {
    // Set a mock role to not "Student"
    localStorage.setItem('userRole', 'Committee');

    render(<NewsFeed />);
    fireEvent.click(screen.getByText('Share in Feed'));
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
  });

  it('should submit a new post and update the post list', async () => {
    // Mock the form submission
    const newPost = { title: 'New Post', description: 'New Description', name: 'FYP Committee' };
    axios.post.mockResolvedValueOnce({ data: newPost });
    axios.get.mockResolvedValueOnce({ data: [newPost] });

    render(<NewsFeed />);
    fireEvent.click(screen.getByText('Share in Feed'));

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Post' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New Description' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('New Post')).toBeInTheDocument();
      expect(screen.getByText('New Description')).toBeInTheDocument();
    });
  });

  it('should handle errors during fetching posts', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch posts'));

    render(<NewsFeed />);
    await waitFor(() => {
      expect(screen.getByText('No posts yet.')).toBeInTheDocument();
    });
  });

  it('should handle errors during post submission', async () => {
    axios.post.mockRejectedValueOnce(new Error('Failed to submit post'));

    render(<NewsFeed />);
    fireEvent.click(screen.getByText('Share in Feed'));

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Post' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New Description' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Title').value).toBe('New Post');
      expect(screen.getByPlaceholderText('Description').value).toBe('New Description');
    });
  });
});
