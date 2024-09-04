import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import StudentReg from '../Components/StudentReg';
import { Toaster } from 'react-hot-toast';

// Mock axios
vi.mock('axios');

describe('StudentReg Component', () => {
  it('should render and display initial state', () => {
    render(<StudentReg />);
    
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Roll Number')).toBeInTheDocument();
    expect(screen.getByText('Add Student')).toBeInTheDocument();
  });

  it('should add a student when valid input is provided', async () => {
    // Mock axios.post to resolve successfully
    axios.post.mockResolvedValue({ data: {} });
    axios.get.mockResolvedValue({
      data: [{ name: 'John Doe', username: 'FA20-BSE-001' }]
    });

    render(<StudentReg />);
    
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Roll Number'), { target: { value: 'FA20-BSE-001' } });
    fireEvent.click(screen.getByText('Add Student'));
    
    await waitFor(() => expect(screen.getByText('Student registered successfully')).toBeInTheDocument());
  });

  it('should show an error message when fields are empty', async () => {
    render(<StudentReg />);
    
    fireEvent.click(screen.getByText('Add Student'));
    
    await waitFor(() => expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument());
  });

  it('should fetch and display students', async () => {
    // Mock axios.get to return a list of students
    axios.get.mockResolvedValue({
      data: [{ name: 'John Doe', username: 'FA20-BSE-001' }]
    });

    render(<StudentReg />);

    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('FA20-BSE-001')).toBeInTheDocument());
  });

  it('should delete a student', async () => {
    // Mock axios.get to return a list of students
    axios.get.mockResolvedValueOnce({
      data: [{ name: 'John Doe', username: 'FA20-BSE-001' }]
    });
    
    // Mock axios.delete to resolve successfully
    axios.delete.mockResolvedValue({ data: {} });
    
    // Mock axios.get to return an empty list after deletion
    axios.get.mockResolvedValueOnce({
      data: []
    });

    render(<StudentReg />);

    // Wait for initial student list to load
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
    
    fireEvent.click(screen.getByText('Delete'));

    // Wait for the deletion to be processed and the student list to update
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });
});
