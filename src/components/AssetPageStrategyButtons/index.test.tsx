import { render, screen } from '@testing-library/react';
import StrategyUrls from 'src/pages/create-strategy/StrategyUrls';
import '@testing-library/jest-dom';
import { useState as useStateMock } from 'react';
import { AssetPageStrategyButtons, BuyButtons, SellButtons } from '.';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: StrategyUrls.DCAIn,
      query: '',
      asPath: '',
    };
  },
}));
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
jest.mock('src/pages/create-strategy/dca-in/customise/useStrategyInfo');

describe('AssetsTabsSelectors tests', () => {
  const setState = jest.fn();

  beforeEach(() => {
    (useStateMock as jest.Mock).mockImplementation((init) => [init, setState]);
  });

  it('renders strategy category radio selectors', () => {
    render(<AssetPageStrategyButtons />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByText(/Buy strategies/)).toBeInTheDocument();
    expect(screen.getByText(/Sell strategies/)).toBeInTheDocument();
  });
  it('renders strategy type buttons', () => {
    render(<AssetPageStrategyButtons />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  describe('Buy button links', () => {
    describe('Buy button links when DCA In is selected', () => {
      it('Dca+ In button has correct link', () => {
        render(<BuyButtons pathname="dca-in" />);
        expect(screen.getByTestId('dca-plus-in')).toHaveAttribute('href', `${StrategyUrls.DCAPlusIn}?chain=`);
        expect(screen.getByTestId('weighted-scale-in')).toHaveAttribute(
          'href',
          `${StrategyUrls.WeightedScaleIn}?chain=`,
        );
      });

      describe('Buy button links when DCA+ In is selected', () => {
        it('Dca In and Weighted Scale In buttons have correct links', () => {
          render(<BuyButtons pathname="dca-plus-in" />);
          expect(screen.getByTestId('dca-in')).toHaveAttribute('href', `${StrategyUrls.DCAIn}?chain=`);
          expect(screen.getByTestId('weighted-scale-in')).toHaveAttribute(
            'href',
            `${StrategyUrls.WeightedScaleIn}?chain=`,
          );
        });
      });

      describe('Buy button links when Weighted Scale In is selected', () => {
        it('Dca In and DCA+ In buttons have correct links', () => {
          render(<BuyButtons pathname="weighted-scale-in" />);
          expect(screen.getByTestId('dca-in')).toHaveAttribute('href', `${StrategyUrls.DCAIn}?chain=`);
          expect(screen.getByTestId('dca-plus-in')).toHaveAttribute('href', `${StrategyUrls.DCAPlusIn}?chain=`);
        });
      });
    });

    describe('Sell button links', () => {
      describe('Sell button links when DCA Out is selected', () => {
        it('Dca+ Out and Weighted Scale Out buttons have correct links', () => {
          render(<SellButtons pathname="dca-out" />);
          expect(screen.getByTestId('dca-plus-out')).toHaveAttribute('href', `${StrategyUrls.DCAPlusOut}?chain=`);
          expect(screen.getByTestId('weighted-scale-out')).toHaveAttribute(
            'href',
            `${StrategyUrls.WeightedScaleOut}?chain=`,
          );
        });

        describe('Sell button links when DCA+ Out is selected', () => {
          it('Dca Out and Weighted Scale Out buttons have correct links', () => {
            render(<SellButtons pathname="dca-plus-out" />);
            expect(screen.getByTestId('dca-out')).toHaveAttribute('href', `${StrategyUrls.DCAOut}?chain=`);
            expect(screen.getByTestId('weighted-scale-out')).toHaveAttribute(
              'href',
              `${StrategyUrls.WeightedScaleOut}?chain=`,
            );
          });
        });

        describe('Buy button links when Weighted Scale Out is selected', () => {
          it('Dca+ Out and DCA Out buttons have correct links', () => {
            render(<SellButtons pathname="weighted-scale-Out" />);
            expect(screen.getByTestId('dca-out')).toHaveAttribute('href', `${StrategyUrls.DCAOut}?chain=`);
            expect(screen.getByTestId('dca-plus-out')).toHaveAttribute('href', `${StrategyUrls.DCAPlusOut}?chain=`);
          });
        });
      });
    });
  });
});
