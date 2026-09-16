import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserCard from '../../Components/Atoms/UserCard';
import type { IUserProfile } from '../../interfacesAndTypes';

const baseUser: IUserProfile = {
  _id: 'card-001',
  firstName: 'Alice',
  lastName: 'Dev',
  email: 'alice@example.com',
  age: 28,
  gender: 'female',
  bio: 'Passionate frontend developer',
  about: 'Loves React',
};

describe('UserCard', () => {
  it('renders user name, gender abbreviation, age and bio', () => {
    render(<UserCard {...baseUser} />);

    // Name + gender (F) + age in the card title
    expect(screen.getByText(/Alice Dev/)).toBeInTheDocument();
    expect(screen.getByText(/28/)).toBeInTheDocument();
    // Gender abbreviation from USER_GENDER constant: female → 'F'
    expect(screen.getByText(/F,/)).toBeInTheDocument();
    expect(screen.getByText('Passionate frontend developer')).toBeInTheDocument();
  });

  it('shows Ignore and Send Request buttons when showCtas defaults to true', () => {
    render(<UserCard {...baseUser} />);
    expect(screen.getByRole('button', { name: 'Ignore' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Request' })).toBeInTheDocument();
  });

  it('hides action buttons when showCtas is false', () => {
    render(<UserCard {...baseUser} showCtas={false} />);
    expect(screen.queryByRole('button', { name: 'Ignore' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Send Request' })).not.toBeInTheDocument();
  });

  it('shows no gender abbreviation for an unknown gender', () => {
    render(<UserCard {...baseUser} gender="non-binary" />);
    // non-binary is not in USER_GENDER so profileGender is empty
    // Title should be "Alice Dev (28)" without a gender prefix
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toContain('Alice Dev');
    expect(heading.textContent).not.toContain('M,');
    expect(heading.textContent).not.toContain('F,');
  });

  it('renders a fallback profile image when no profilePic is provided', () => {
    render(<UserCard {...baseUser} profilePic={undefined} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', expect.stringContaining('daisyui'));
  });

  it('renders the provided profilePic URL', () => {
    render(<UserCard {...baseUser} profilePic="https://example.com/pic.jpg" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/pic.jpg');
  });
});
