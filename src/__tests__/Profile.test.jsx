// Profile.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Profile from '../Components/Profile';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock axios
vi.mock('axios');

describe('Profile Component', () => {
    const mockUserData = {
        username: 'testuser',
        name: 'Test User',
        address: '123 Test St',
        email: 'testuser@example.com',
        phone: '1234567890',
        photo: '/path/to/photo.jpg',
    };

    beforeEach(() => {
        // Clear mocks before each test
        vi.clearAllMocks();
        localStorage.setItem('loggedInUser', 'testuser');
        localStorage.setItem('userRole', 'Student');
        localStorage.setItem('token', 'fake-token');
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('renders profile data correctly', async () => {
        axios.get.mockResolvedValue({ data: mockUserData });

        render(<Profile />);

        // Check if loading or initial state is displayed
        expect(screen.getByText('Profile')).toBeInTheDocument();

        // Wait for profile data to load
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('123 Test St')).toBeInTheDocument();
        expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
        expect(screen.getByText('1234567890')).toBeInTheDocument();
    });

    it('enables editing mode when Edit Profile button is clicked', async () => {
        axios.get.mockResolvedValue({ data: mockUserData });

        render(<Profile />);

        // Wait for profile data to load
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        const editButton = screen.getByText('Edit Profile');
        fireEvent.click(editButton);

        expect(screen.getByLabelText('Name:')).toBeInTheDocument();
        expect(screen.getByLabelText('Address:')).toBeInTheDocument();
        expect(screen.getByLabelText('Email:')).toBeInTheDocument();
        expect(screen.getByLabelText('Phone Number:')).toBeInTheDocument();
    });

    it('calls save profile API when Save Profile button is clicked', async () => {
        axios.get.mockResolvedValue({ data: mockUserData });
        axios.post.mockResolvedValue({ data: mockUserData });

        render(<Profile />);

        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        const editButton = screen.getByText('Edit Profile');
        fireEvent.click(editButton);

        const saveButton = screen.getByText('Save Profile');
        fireEvent.click(saveButton);

        await waitFor(() => expect(axios.post).toHaveBeenCalled());
    });

    it('displays error message if updating profile fails', async () => {
        axios.get.mockResolvedValue({ data: mockUserData });
        axios.post.mockRejectedValue(new Error('Error updating profile'));

        render(<Profile />);

        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        const editButton = screen.getByText('Edit Profile');
        fireEvent.click(editButton);

        const saveButton = screen.getByText('Save Profile');
        fireEvent.click(saveButton);

        await waitFor(() => expect(screen.getByText('There was an error updating the profile!')).toBeInTheDocument());
    });

    it('should render change password inputs when edit password button is clicked', () => {
        render(<Profile />);

        fireEvent.click(screen.getByText('Edit Password')); // Adjust text if different in the actual component

        expect(screen.getByLabelText('Old Password:')).toBeInTheDocument();
        expect(screen.getByLabelText('New Password:')).toBeInTheDocument();
    });

        // Add more tests as needed...
});
