import { render, screen } from '@testing-library/react';
import Home from './index.page';
import '@testing-library/jest-dom';

describe('Home', () => {
  it('renders the heading', () => {
    render(<Home />);

    expect(screen.getByText(/Welcome to CALC/)).toBeInTheDocument();
  });

  describe('top panel', () => {
    describe('when user has not connected to a wallet', () => {
      it('renders the connect wallet button', () => {
        render(<Home />);

        expect(screen.getByText(/Connect Wallet/)).toBeInTheDocument();
      });
    });
  });
});
