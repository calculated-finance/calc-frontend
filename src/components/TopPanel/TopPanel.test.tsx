import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWallet } from '@wizard-ui/react';
import TopPanel from './TopPanel';

jest.mock('@wizard-ui/react');

describe('Home', () => {
  describe('top panel', () => {
    describe('when user has not connected to a wallet', () => {
      beforeEach(() => {
        (useWallet as jest.Mock).mockImplementation(() => ({
          connected: false,
        }));
      });
      it('renders the connect wallet button', () => {
        render(<TopPanel />);

        expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
      });
    });

    describe('when user has connected to a wallet', () => {
      describe('when a user has no strategies set', () => {
        beforeEach(() => {
          (useWallet as jest.Mock).mockImplementation(() => ({
            connected: true,
          }));
        });
        it('renders the connect wallet button', () => {
          render(<TopPanel />);

          expect(screen.getByText(/Ready to set up a CALC Strategy?/)).toBeInTheDocument();
          expect(screen.getByText(/Get Started/)).toBeInTheDocument();
        });
      });
    });
  });
});
