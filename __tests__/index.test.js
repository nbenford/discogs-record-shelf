import Home from '../pages';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

describe('renders HomePage unchanged', () => {
  it('renders a homepage', () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
  it('has a title', () => {
    const { container } = render(<Home />);
    expect(screen.getByTestId('title'));
  });
  it('title includes Discogs', () => {
    const { container } = render(<Home />);
    expect(screen.getByTestId('title')).toHaveTextContent('Discogs');
  });
  it('has a subtitle', () => {
    const { container } = render(<Home />);
    expect(screen.getByTestId('subtitle'));
  });
  it('subtitle includes Record Shelf', () => {
    const { container } = render(<Home />);
    expect(screen.getByTestId('subtitle')).toHaveTextContent('Record Shelf');
  });
});
