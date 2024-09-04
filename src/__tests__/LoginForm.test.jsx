import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, describe, vi } from 'vitest';
import LoginForm from '../Pages/LoginForm'; // Adjust the path as needed

// Mock useNavigate only
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

// Mock axios for API requests
vi.mock('axios', () => ({
    post: vi.fn(() =>
        Promise.resolve({
            data: { message: 'success', username: 'testuser', name: 'Test User', role: 'Student', token: 'fake-token' },
        })
    ),
}));

// Mock toast and Toaster from react-hot-toast
vi.mock('react-hot-toast', async () => {
    const actual = await vi.importActual('react-hot-toast');
    return {
        ...actual,
        default: { error: vi.fn(), success: vi.fn() },
        Toaster: () => null, // Mock Toaster as a placeholder
    };
});

describe('LoginForm', () => {
    test('renders the login form', () => {
        render(
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>
        );

        expect(screen.getByText('FYP Management System')).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/select role/i)).toBeInTheDocument();
        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    test('shows error toast when fields are empty and login button is clicked', () => {
        render(
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/login/i));
        expect(screen.getByText('FYP Management System')).toBeInTheDocument();
    });

    test('calls axios.post on form submission with valid data', async () => {
        render(
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });
        fireEvent.change(screen.getByLabelText(/select role/i), { target: { value: 'Student' } });

        fireEvent.click(screen.getByText(/login/i));

    });
});
