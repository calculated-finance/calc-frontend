import { render, screen } from '@testing-library/react';
import { YieldOption } from './YieldOption'; // Adjust the import path to where your YieldOption component is

describe('YieldOption', () => {
  it('renders without crashing', () => {
    render(<YieldOption icon={<div>Icon</div>} description="Test Description" apr={0.05} />);
  });

  it('displays the correct APR', () => {
    render(<YieldOption icon={<div>Icon</div>} description="Test Description" apr={0.05} />);
    expect(screen.getByText('~5%'));
  });

  it('displays the correct APR', () => {
    render(<YieldOption icon={<div>Icon</div>} description="Test Description" apr={0.0512} />);
    expect(screen.getByText('~5.12%'));
  });

  it('displays the correct description', () => {
    render(<YieldOption icon={<div>Icon</div>} description="Test Description" apr={0.05} />);
    expect(screen.getByText('Test Description'));
  });

  it('displays the correct icon', () => {
    render(<YieldOption icon={<div>Icon</div>} description="Test Description" apr={0.05} />);
    expect(screen.getByText('Icon'));
  });
});
