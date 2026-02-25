import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { LoginCard } from '@/components/Forms/LoginCard';

const { mockLogin, anonymousMockLogin, mockNavigate } = vi.hoisted(() => ({
  mockLogin: vi.fn().mockResolvedValue({ error: null}),
  anonymousMockLogin: vi.fn().mockResolvedValue({ error: null }),
  mockNavigate: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: { warn: vi.fn() },
}));

vi.mock('@tanstack/react-router', () => {
  return {
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/api/user.api', () => ({
  userLogin: mockLogin,
  anonymousLogin: anonymousMockLogin,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('LoginCard', () => {
  it('renders all form elements', () => {
    render(<LoginCard />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guest/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute(
      'href',
      '/signup',
    );
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginCard />);

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button', {
      name: /(show|hide) password/i,
    });
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('navigates to dashboard on successful login', async () => {
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(mockNavigate).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' });
  });

  it('shows validation error when auth returns an error', async () => {
    mockLogin.mockResolvedValueOnce({
      error: { message: 'Invalid credentials' },
    });
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows toast on unexpected error', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Network failure'));
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(toast.warn).toHaveBeenCalledWith(
      'Unknown error occurred. Try Again!',
    );
  });

  it('navigates to dashboard on successful guest login', async () => {
    anonymousMockLogin.mockResolvedValueOnce({
      data: { user: { id: 'anon-1' } },
      error: null,
    });
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.click(screen.getByRole('button', { name: 'Guest Login' }));

    expect(anonymousMockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' });
  });

  it('shows validation error on guest login failure', async () => {
    anonymousMockLogin.mockResolvedValueOnce({
      data: null,
      error: { message: 'Anonymous login disabled' },
    });
    const user = userEvent.setup();
    render(<LoginCard />);

    await user.click(screen.getByRole('button', { name: 'Guest Login' }));

    expect(
      await screen.findByText('Anonymous login disabled'),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows pending state when form is being submitted', async () => {
    const user = userEvent.setup();
    const { promise, resolve } = Promise.withResolvers();

    mockLogin.mockReturnValueOnce(promise);

    render(<LoginCard />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');

    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
   

    resolve({ error: null });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).not.toBeDisabled();
    });
    expect(mockNavigate).toHaveBeenCalled();
  });
});
