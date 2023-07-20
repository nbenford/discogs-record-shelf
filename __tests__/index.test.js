import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import mockRouter from 'next-router-mock';

//COMPONENT
import Home from '../pages';

//mock router
jest.mock('next/router', () => require('next-router-mock'));

describe('renders HomePage unchanged', () => {
  it('has a title', () => {
    render(<Home />);
    expect(screen.getByTestId('title')).toBeInTheDocument();
  });
  it('title includes Discogs', () => {
    render(<Home />);
    expect(screen.getByTestId('title')).toHaveTextContent('Discogs');
  });
  it('has a subtitle', () => {
    render(<Home />);
    expect(screen.getByTestId('subtitle'));
  });
  it('subtitle includes Record Shelf', () => {
    render(<Home />);
    expect(screen.getByTestId('subtitle')).toHaveTextContent('Record Shelf');
  });
});
