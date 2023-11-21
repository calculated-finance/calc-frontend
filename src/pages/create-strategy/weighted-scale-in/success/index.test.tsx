// import { act, render, screen, waitFor, within } from '@testing-library/react';
// import { QueryClientProvider } from '@tanstack/react-query';
// import '@testing-library/jest-dom';
// import { queryClient } from '@helpers/test/testQueryClient';
// import { mockUseWallet } from '@helpers/test/mockUseWallet';
// import { mockUseStrategy } from '@helpers/test/mockGetVault';
// import { ChainId } from '@hooks/useChain/Chains';
// import Page from './index.page';

// const mockRouter = {
//   isReady: true,
//   push: jest.fn(),
//   pathname: '/create-strategy/weighted-scale-in/success',
//   query: { strategyId: '1', timeSaved: 100, chain: 'kaiyo-1' },
//   events: {
//     on: jest.fn(),
//   },
// };

// jest.mock('@hooks/useWallet');

// jest.mock('next/router', () => ({
//   useRouter() {
//     return mockRouter;
//   },
// }));

// async function renderTarget() {
//   act(() => {
//     render(
//       <QueryClientProvider client={queryClient}>
//         <Page />
//       </QueryClientProvider>,
//     );
//   });
// }

// describe('DCA In success page', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//   it('renders the heading', async () => {
//     mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn());

//     await renderTarget();

//     await waitFor(() =>
//       expect(
//         within(screen.getByTestId('strategy-modal-header')).getByText('Strategy Set Successfully'),
//       ).toBeInTheDocument(),
//     );
//   });
//   it('renders time saved', async () => {
//     mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn());
//     await renderTarget();
//     screen.getByText('100 minutes');
//   });
//   it('shows link to my strategies page', async () => {
//     mockUseWallet(mockUseStrategy(), jest.fn(), jest.fn());

//     await renderTarget();

//     await waitFor(() =>
//       expect(screen.getByText(/View strategy details/)).toHaveAttribute(
//         'href',
//         '/strategies/details?id=1&chain=Kujira',
//       ),
//     );
//   });
// });
