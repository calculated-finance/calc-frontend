import { render, screen } from '@testing-library/react';
import { AssetPageStrategyButtons } from '.';

describe('AssetsTabsSelectors tests', () => {
  it('renders strategy category radio selectors', () => {
    render(<AssetPageStrategyButtons />);
    expect(screen.getByRole('radio')).toBeVisible();
    expect(screen.getByText(/Buyx strategies/)).toBeInTheDocument();
    expect(screen.getByText(/Sellx strategies/)).toBeInTheDocument();
  });
});
