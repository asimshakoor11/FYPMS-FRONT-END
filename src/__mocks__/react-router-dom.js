import { vi } from 'vitest';

const originalRouter = vi.importActual('react-router-dom');

vi.mock('react-router-dom', async () => {
  const actual = await originalRouter;
  return {
    ...actual,
    useNavigate: vi.fn(),
    BrowserRouter: actual.BrowserRouter, // Keep the original implementation
  };
});
