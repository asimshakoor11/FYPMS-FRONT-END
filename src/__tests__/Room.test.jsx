// Room.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import Room from '../Components//Room';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// Mock dependencies
vi.mock('@zegocloud/zego-uikit-prebuilt', () => ({
    ZegoUIKitPrebuilt: {
        generateKitTokenForTest: vi.fn().mockReturnValue('mockToken'),
        create: vi.fn().mockReturnValue({
            joinRoom: vi.fn(),
        }),
    },
}));

vi.mock('./AudioRecorder', () => () => <div>Audio Recorder</div>);

describe('Room Component', () => {
    beforeEach(() => {
        // Mock localStorage
        global.localStorage.getItem = vi.fn().mockImplementation((key) => {
            if (key === 'userRole') return 'Student';
            if (key === 'loggedInUserName') return 'Test User';
        });
    });

    it('does not render AudioRecorder for Student role', () => {
        render(
            <Router>
                <Room />
            </Router>
        );
        expect(screen.queryByText('Audio Recorder')).toBeNull();
    });

    it('calls ZegoUIKitPrebuilt.create and joinRoom with correct parameters', async () => {
        const joinRoomMock = vi.fn();
        ZegoUIKitPrebuilt.create.mockReturnValue({
            joinRoom: joinRoomMock,
        });

        render(
            <Router>
                <Room />
            </Router>
        );

        await waitFor(() => {
            expect(ZegoUIKitPrebuilt.create).toHaveBeenCalledWith('mockToken');
            expect(joinRoomMock).toHaveBeenCalled();
        });
    });

    it('renders AudioRecorder for non-Student roles', () => {
        // Set the role to something other than Student
        global.localStorage.getItem = vi.fn().mockImplementation((key) => {
            if (key === 'userRole') return 'Teacher';
            if (key === 'loggedInUserName') return 'Test User';
        });

        render(
            <Router>
                <Room />
            </Router>
        );
        expect(screen.getByText('Start Recording')).toBeInTheDocument();
    });
});
