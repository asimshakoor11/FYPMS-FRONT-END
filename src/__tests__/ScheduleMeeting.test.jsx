import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ScheduleMeeting from '../Components/ScheduleMeeting';
import toast, { Toaster } from 'react-hot-toast';

// Mock the fetch API and react-hot-toast
global.fetch = vi.fn();

describe('ScheduleMeeting Component', () => {
  const mockGroupNumber = '123';

  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders the component with all fields', () => {
    render(<ScheduleMeeting groupnumber={mockGroupNumber} />);
    
    expect(screen.getByText('Schedule a Zoom Meeting')).toBeInTheDocument();
    expect(screen.getByLabelText('Topic:')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Time:')).toBeInTheDocument();
    expect(screen.getByLabelText('Duration (minutes):')).toBeInTheDocument();
  });

  it('should call fetchMeetingDetails on initial render', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ meetings: [] }),
    });
    
    render(<ScheduleMeeting groupnumber={mockGroupNumber} />);

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      `https://fypms-back-end.vercel.app/api/meetings/meeting-details/${mockGroupNumber}`
    ));
  });

  it('should submit the form and call the API', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    });
    
    render(<ScheduleMeeting groupnumber={mockGroupNumber} />);
    
    fireEvent.change(screen.getByLabelText('Topic:'), { target: { value: 'Test Meeting' } });
    fireEvent.change(screen.getByLabelText('Start Time:'), { target: { value: '2024-09-04T12:00' } });
    fireEvent.change(screen.getByLabelText('Duration (minutes):'), { target: { value: '30' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Schedule Meeting' }));
    
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      'https://fypms-back-end.vercel.app/api/meetings/schedule-meeting',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: 'Test Meeting',
          start_time: '2024-09-04T12:00',
          duration: 30,
          number: mockGroupNumber,
        }),
      })
    ));
  });

 
  it('should display "No meetings available for this group" if no meetings are returned', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ meetings: [] }),
    });
    
    render(<ScheduleMeeting groupnumber={mockGroupNumber} />);
    
    await waitFor(() => {
      expect(screen.getByText('No meetings available for this group')).toBeInTheDocument();
    });
  });

  it('should display meeting details if meetings are available', async () => {
    const mockMeetingDetails = {
      meetings: [{
        _id: '1',
        topic: 'Test Meeting',
        start_time: '2024-09-04T12:00:00Z',
        duration: 30,
        join_url: 'https://zoom.us/j/123456789',
      }],
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockMeetingDetails),
    });

    render(<ScheduleMeeting groupnumber={mockGroupNumber} />);

    await waitFor(() => {
      expect(screen.getByText('Test Meeting')).toBeInTheDocument();
      expect(screen.getByText('30 minutes')).toBeInTheDocument();
      expect(screen.getByText('https://zoom.us/j/123456789')).toBeInTheDocument();
    });
  });
});
