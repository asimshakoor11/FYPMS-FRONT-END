import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AudioRecorder from '../Components/AudioRecorder';
import axios from 'axios';
import toast from 'react-hot-toast';

vi.mock('axios');
// vi.mock('react-hot-toast', () => ({
//     success: vi.fn(),
//     error: vi.fn(),
//     Toaster: () => null, // Mock the Toaster component
// }));

describe('AudioRecorder Component', () => {
    beforeEach(() => {
        global.MediaStream = vi.fn();
        global.MediaRecorder = vi.fn(() => ({
            start: vi.fn(),
            stop: vi.fn(),
            ondataavailable: vi.fn(),
        }));

        global.navigator.mediaDevices = {
            getUserMedia: vi.fn().mockResolvedValue(new MediaStream()),
        };
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<AudioRecorder meetingAgenda="Test Agenda" number={1} />);
        expect(screen.getByText(/Start Recording/i)).toBeInTheDocument();
    });

    it('starts recording when the button is clicked', async () => {
        render(<AudioRecorder meetingAgenda="Test Agenda" number={1} />);

        fireEvent.click(screen.getByText(/Start Recording/i));

        await waitFor(() => {
            expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
            expect(global.MediaRecorder).toHaveBeenCalled();
        });

        expect(screen.getByText(/Stop Recording/i)).toBeInTheDocument();
    });

    it('stops recording when the button is clicked again', async () => {
        const mediaRecorderMock = {
            start: vi.fn(),
            stop: vi.fn(),
            ondataavailable: vi.fn(),
        };

        global.MediaRecorder = vi.fn(() => mediaRecorderMock);

        render(<AudioRecorder meetingAgenda="Test Agenda" number={1} />);

        // Start recording
        fireEvent.click(screen.getByText(/Start Recording/i));

        await waitFor(() => {
            expect(mediaRecorderMock.start).toHaveBeenCalled();
        });

        // Stop recording
        fireEvent.click(screen.getByText(/Stop Recording/i));

        await waitFor(() => {
            expect(mediaRecorderMock.stop).toHaveBeenCalled();
        });

        expect(screen.getByText(/Start Recording/i)).toBeInTheDocument();
    });

    it('uploads audio and handles response correctly', async () => {
        const mediaRecorderMock = {
            start: vi.fn(),
            stop: vi.fn(),
            ondataavailable: vi.fn((event) => { }),
        };

        global.MediaRecorder = vi.fn(() => mediaRecorderMock);

        const mockBlob = new Blob(['test audio'], { type: 'audio/wav' });
        const mockEvent = { data: mockBlob };
        const mockResponse = {
            data: {
                transcription: 'Test transcription',
                summary: 'Test summary',
            },
        };

        axios.post.mockResolvedValue(mockResponse);

        render(<AudioRecorder meetingAgenda="Test Agenda" number={1} />);

        fireEvent.click(screen.getByText(/Start Recording/i));
        await waitFor(() => expect(mediaRecorderMock.start).toHaveBeenCalled());

        // Simulate stopping recording and uploading data
        fireEvent.click(screen.getByText(/Stop Recording/i));
        mediaRecorderMock.ondataavailable(mockEvent);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'https://fypms-back-end.vercel.app/api/zeogoCloudMeeting/upload',
                expect.any(FormData),
                expect.objectContaining({
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            );

            // expect(toast.success).toHaveBeenCalledWith('Summary Saved');
            expect(screen.getByText(/Meeting Transcription/i)).toBeInTheDocument();
            expect(screen.getByText(/Meeting Summary/i)).toBeInTheDocument();
        });
    });


});
