import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import SupervisorReg from '../Components/SupervisorReg';
import { Toaster } from 'react-hot-toast';

// Mock axios
vi.mock('axios');

describe('SupervisorReg Component', () => {
    it('should render and display initial state', () => {
        render(<SupervisorReg />);

        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('ID')).toBeInTheDocument();
        expect(screen.getByText('Add Supervisor')).toBeInTheDocument();
        expect(screen.getByText('Supervisors List')).toBeInTheDocument();
    });

    it('should add a supervisor when valid input is provided', async () => {
        // Mock axios.post to resolve successfully
        axios.post.mockResolvedValue({ data: {} });
        axios.get.mockResolvedValue({
            data: [{ name: 'John Doe', username: 'FA20-BSE-001' }]
        });

        render(<SupervisorReg />);

        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('ID'), { target: { value: 'FA20-BSE-001' } });
        fireEvent.click(screen.getByText('Add Supervisor'));

        await waitFor(() => expect(screen.getByText('Supervisor registered successfully')).toBeInTheDocument());
    });

    it('should show an error message when fields are empty', async () => {
        render(<SupervisorReg />);

        fireEvent.click(screen.getByText('Add Supervisor'));

        await waitFor(() => expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument());
    });

    it('should fetch and display supervisors', async () => {
        // Mock axios.get to return a list of supervisors
        axios.get.mockResolvedValue({
            data: [{ name: 'John Doe', username: 'FA20-BSE-001' }]
        });

        render(<SupervisorReg />);

        await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('FA20-BSE-001')).toBeInTheDocument());
    });

    it('should delete a supervisor', async () => {
        // Mock axios.get to return a list of supervisors
        axios.get.mockResolvedValueOnce({
            data: [{ name: 'John Doe', username: 'FA20-BSE-001' }]
        });
        // Mock axios.delete to resolve successfully
        axios.delete.mockResolvedValue({ data: {} });
        // Mock axios.get to return an empty list after deletion
        axios.get.mockResolvedValueOnce({
            data: []
        });

        render(<SupervisorReg />);

        // Wait for initial supervisor list to load
        await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Delete'));

        // Wait for the deletion to be processed and the supervisor list to update
        await waitFor(() => {
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        });
    });
});
