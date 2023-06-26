import { render, screen } from '@testing-library/react';
import { useField } from 'formik';
import { defaultDenom } from '@utils/defaultDenom';
import { useMarket } from '../../hooks/useMarket';
import GenerateYield from '.';

jest.mock('formik', () => ({
  useField: jest.fn(),
}));

jest.mock('../../hooks/useMarket', () => ({
  useMarket: jest.fn(),
}));

describe('GenerateYield', () => {
  it('renders without crashing', () => {
    (useField as jest.Mock).mockReturnValue([
      { value: 'mars' },
      { touched: false, error: '' },
      { setValue: jest.fn() },
    ]);
    (useMarket as jest.Mock).mockReturnValue({ data: { deposit_enabled: true }, isLoading: false });

    render(<GenerateYield resultingDenom={{ ...defaultDenom, name: 'Test Denom', icon: 'Icon', id: '1' }} />);
  });

  it('shows the correct error message', () => {
    (useField as jest.Mock).mockReturnValue([
      { value: 'mars' },
      { touched: true, error: 'Test Error' },
      { setValue: jest.fn() },
    ]);
    (useMarket as jest.Mock).mockReturnValue({ data: { deposit_enabled: true }, isLoading: false });

    render(<GenerateYield resultingDenom={{ ...defaultDenom, name: 'Test Denom', icon: 'Icon', id: '1' }} />);

    expect(screen.getByText('Test Error'));
  });

  it('shows no options when there is no mars market', () => {
    (useField as jest.Mock).mockReturnValue([
      { value: 'mars' },
      { touched: true, error: 'Test Error' },
      { setValue: jest.fn() },
    ]);
    (useMarket as jest.Mock).mockReturnValue({ data: undefined, isLoading: false });

    render(<GenerateYield resultingDenom={{ ...defaultDenom, name: 'Test Denom', icon: 'Icon', id: '1' }} />);

    expect(screen.getByText('No yield strategies available for Test Denom yet.'));
  });

  it('shows no options when there is a mars market but it doesnt support deposit', () => {
    (useField as jest.Mock).mockReturnValue([
      { value: 'mars' },
      { touched: true, error: 'Test Error' },
      { setValue: jest.fn() },
    ]);
    (useMarket as jest.Mock).mockReturnValue({ data: { deposit_enabled: false }, isLoading: false });

    render(<GenerateYield resultingDenom={{ ...defaultDenom, name: 'Test Denom', icon: 'Icon', id: '1' }} />);

    expect(screen.getByText('No yield strategies available for Test Denom yet.'));
  });

  it('shows mars option when there is a mars market', () => {
    (useField as jest.Mock).mockReturnValue([
      { value: 'mars' },
      { touched: true, error: 'Test Error' },
      { setValue: jest.fn() },
    ]);
    (useMarket as jest.Mock).mockReturnValue({
      data: { deposit_enabled: true, liquidity_rate: 0.05 },
      isLoading: false,
    });

    render(<GenerateYield resultingDenom={{ ...defaultDenom, name: 'Test Denom', icon: 'Icon', id: '1' }} />);

    expect(screen.getByText('Loan Test Denom on Mars'));
    expect(screen.getByText('~5%'));
  });
});
