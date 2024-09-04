import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import axios from 'axios';
import GroupFormation from '../Components/GroupFormation';
import { Toaster } from 'react-hot-toast';

vi.mock('axios'); // Mocking axios globally

describe('GroupFormation Component', () => {


    beforeEach(() => {
        axios.get.mockReset();
        axios.post.mockReset();
        axios.put.mockReset();
        axios.delete.mockReset();
    });


    afterEach(() => {
        vi.clearAllMocks(); // Clear mocks after each test
    });

    it('should fetch students data from the API', async () => {
        // Mock data for students
        const mockStudents = [
            { _id: '1', name: 'John Doe', username: 'FA20-BSE-020' },
            { _id: '2', name: 'Jane Smith', username: 'FA20-BSE-012' },
        ];

        // Mocking axios.get response for students
        axios.get.mockResolvedValueOnce({ data: mockStudents });

        render(<GroupFormation />);

        // Check if loading message is shown initially
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

        // Wait for students data to be fetched and displayed
        await waitFor(() => {
            expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
            expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
        });

        expect(axios.get).toHaveBeenCalledWith('https://fypms-back-end.vercel.app/api/students');
    });

    it('should fetch supervisors data from the API', async () => {
        // Mock data for supervisors
        const mockSupervisors = [
            { _id: '1', name: 'Dr. Alice', username: '001' },
            { _id: '2', name: 'Prof. Bob', username: '002' },
        ];

        // Mocking axios.get response for supervisors
        axios.get.mockResolvedValueOnce({ data: mockSupervisors });

        render(<GroupFormation />);

        // Wait for supervisors data to be fetched and displayed
        await waitFor(() => {
            expect(screen.getByText(/Dr. Alice/i)).toBeInTheDocument();
            expect(screen.getByText(/Prof. Bob/i)).toBeInTheDocument();
        });

        expect(axios.get).toHaveBeenCalledWith('https://fypms-back-end.vercel.app/api/supervisors');
    });

    test('handles add to group', async () => {
        axios.get.mockResolvedValueOnce({ data: [] }); // mock students
        axios.get.mockResolvedValueOnce({ data: [] }); // mock supervisors
        axios.get.mockResolvedValueOnce({ data: [] }); // mock groups

        render(<GroupFormation />);

        // Wait for the loading state to disappear
        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        // Mock available students and supervisors
        const students = [{ _id: '1', name: 'John Doe', username: 'FA20-BSE-020' }];
        const supervisors = [{ _id: '1', name: 'Dr. Smith', username: '001' }];

        // Mock the axios calls to return data
        axios.get.mockResolvedValueOnce({ data: students });
        axios.get.mockResolvedValueOnce({ data: supervisors });
        axios.get.mockResolvedValueOnce({ data: [] });

        // Now interact with the elements
        fireEvent.change(screen.getByLabelText('Select Students'), { target: { value: ['1'] } });
        fireEvent.change(screen.getByLabelText('Select Supervisor'), { target: { value: '1' } });
        fireEvent.change(screen.getByPlaceholderText('Group Number'), { target: { value: '1' } });
        fireEvent.change(screen.getByPlaceholderText('Project Title'), { target: { value: 'Test Project' } });

        axios.post.mockResolvedValueOnce({ data: { number: 1, members: ['1'], supervisor: '1', projectTitle: 'Test Project' } });

        fireEvent.click(screen.getByText('Add to Group'));

    });

    test('handles delete group', async () => {
        const groups = [{
            _id: 'group1',
            number: 1,
            members: [{ _id: '1', name: 'John Doe', username: 'FA20-BSE-020' }],
            supervisor: { _id: '1', name: 'Dr. Smith', username: '001' },
            projectTitle: 'Test Project'
        }];

        axios.get.mockResolvedValueOnce({ data: [] }); // mock students
        axios.get.mockResolvedValueOnce({ data: [] }); // mock supervisors
        axios.get.mockResolvedValueOnce({ data: groups }); // mock groups

        render(<GroupFormation />);

        // Wait for the loading state to disappear
        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        axios.delete.mockResolvedValueOnce({});

        fireEvent.click(screen.getByText('Delete Group'));

        await waitFor(() => expect(screen.queryByText('Group 1')).not.toBeInTheDocument());
    });
});
