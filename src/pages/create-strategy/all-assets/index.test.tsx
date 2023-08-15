import { render, screen, waitFor, within, act } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from '@helpers/test/testQueryClient';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { mockGetPairs } from '@helpers/test/mockGetPairs';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { mockGetBalance } from '@helpers/test/mockGetBalance';
import { mockFiatPrice } from '@helpers/test/mockFiatPrice';
import { mockBalances } from '@helpers/test/mockBalances';
import { useKujira } from '@hooks/useKujira';
import { KujiraQueryClient } from 'kujira.js';
import { useFormStore } from '@hooks/useFormStore';
import { useOsmosis } from '@hooks/useOsmosis';
import { Chains } from '@hooks/useChain/Chains';
import DcaInPage from '../dca-in/assets/index.page';
import DcaOutPage from '../dca-out/assets/index.page';
import DcaPlusInPage from '../dca-plus-in/assets/index.page';
import DcaPlusOutPage from '../dca-plus-out/assets/index.page';
import WeightedScaleInPage from '../weighted-scale-in/assets/index.page';
import WeightedScaleOutPage from '../weighted-scale-out/assets/index.page';

// MOCKS

const mockStateMachine = {
    state: {},
    actions: {
        updateAction: jest.fn(),
        resetAction: jest.fn(),
    },
};

const mockKujiraQuery = {
    bank: {
        allBalances: mockBalances(),
    },
};

jest.mock('@hooks/useWallet');


async function renderTargetDcaIn() {
    await act(() => {
        render(
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <DcaInPage />
                </QueryClientProvider>
            </ThemeProvider>,
        );
    });
}
async function renderTargetDcaOut() {
    await act(() => {
        render(
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <DcaOutPage />
                </QueryClientProvider>
            </ThemeProvider>,
        );
    });
}
async function renderTargetDcaPlusIn() {
    await act(() => {
        render(
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <DcaPlusInPage />
                </QueryClientProvider>
            </ThemeProvider>,
        );
    });
}
async function renderTargetDcaPlusOut() {
    await act(() => {
        render(
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <DcaPlusOutPage />
                </QueryClientProvider>
            </ThemeProvider>,
        );
    });
}
async function renderTargetWeightedScaleIn() {
    await act(() => {
        render(
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <WeightedScaleInPage />
                </QueryClientProvider>
            </ThemeProvider>,
        );
    });
}
async function renderTargetWeightedScaleOut() {
    await act(() => {
        render(
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <WeightedScaleOutPage />
                </QueryClientProvider>
            </ThemeProvider>,
        );
    });
}



















// DCA IN

const mockRouterDcaIn = {
    isReady: true,
    push: jest.fn(),
    pathname: '/create-strategy/dca-in/assets',
    query: { id: '1', chain: 'Kujira' },
    events: {
        on: jest.fn(),
    },
};


describe('DCA In Assets page', () => {

    jest.mock('next/router', () => ({
        useRouter() {
            return mockRouterDcaIn;
        },
    }));

    beforeEach(async () => {
        jest.clearAllMocks();

        useFormStore.setState({
            forms: mockStateMachine.state,
            updateForm: () => mockStateMachine.actions.updateAction,
            resetForm: () => mockStateMachine.actions.resetAction,
        });
        useOsmosis.setState({
            query: jest.fn(),
        });

        useKujira.setState({
            query: {
                bank: {
                    allBalances: mockBalances(),
                },
            } as unknown as KujiraQueryClient,
        });
        mockFiatPrice();
    });

    describe('on page load', () => {
        it('renders the heading', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetDcaIn();

            expect(
                within(screen.getByTestId('strategy-modal-header')).getByText('Choose Funding & Assets'),
            ).toBeInTheDocument();
        });
    });

    describe('when initial denom is selected', () => {
        describe('and there are available funds', () => {
            it('should show available funds', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaIn();

                const select = await waitFor(() => screen.getByLabelText(/How will you fund your first investment?/));
                selectEvent.select(select, ['DEMO']);

                await waitFor(() => expect(screen.getByText('88.08')).toBeInTheDocument());
            });
        });
    });

    describe('when initial denom is selected', () => {
        describe('and there are not available funds', () => {
            it('should show an amount of none', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaIn();

                const select = await waitFor(() => screen.getByLabelText(/How will you fund your first investment?/));
                await selectEvent.select(select, ['USK']);

                await waitFor(() => expect(screen.getByText('None')).toBeInTheDocument());
            });
        });
    });

    describe('when initial deposit is entered', () => {
        describe('and the amount is greater than the available funds', () => {
            it('should show an error', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaIn();

                const initalDenomSelect = await waitFor(() =>
                    screen.getByLabelText(/How will you fund your first investment?/),
                );
                await selectEvent.select(initalDenomSelect, ['DEMO']);

                await waitFor(() => expect(screen.getByText('88.08')).toBeInTheDocument());
                const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));

                // enter initial deposit
                await act(async () => {
                    await waitFor(() => userEvent.type(input, '100'), { timeout: 5000 });
                });

                // select resulting denom
                const select = await waitFor(() => screen.getByLabelText(/What asset do you want to invest in?/));
                await selectEvent.select(select, ['KUJI']);

                // submit
                await act(async () => {
                    await waitFor(() => userEvent.click(screen.getByText(/Next/)));
                });

                await waitFor(() =>
                    expect(
                        screen.getByText('Initial Deposit must be less than or equal to than your current balance'),
                    ).toBeInTheDocument(),
                );

                expect(screen.getByText('Next')).toBeDisabled();
            });
        });
    });

    describe('when form is filled and submitted', () => {
        it('submits form successfully', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetDcaIn();

            // wait for balances to load
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((r) => setTimeout(r, 1000));

            // select initial denom
            await waitFor(() => screen.getByText(/How will you fund your first investment?/));
            await selectEvent.select(screen.getByLabelText(/How will you fund your first investment?/), ['USK']);

            // enter initial deposit
            const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));
            await waitFor(() => userEvent.type(input, '1'), { timeout: 5000 });

            // select resulting denom
            await selectEvent.select(screen.getByLabelText(/What asset do you want to invest in?/), ['NBTC']);

            // submit
            await waitFor(() => userEvent.click(screen.getByText(/Next/)));

            expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                initialDeposit: 1,
                resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
                strategyType: 'DCA In'
            });

            expect(mockRouterDcaIn.push).toHaveBeenCalledWith({
                pathname: '/create-strategy/dca-in/customise',
                query: { chain: Chains.Kujira },
            });
        });
    });

    describe('connect wallet button behaviour', () => {
        it('shows connect wallet when not connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

            await renderTargetDcaIn();
            expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
        });

        it('does not show connect wallet when connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
            await renderTargetDcaIn();

            expect(screen.getByText(/Next/)).toBeInTheDocument();
        });
    });
});


// DCA OUT 


const mockRouterDcaOut = {
    isReady: true,
    push: jest.fn(),
    pathname: '/create-strategy/dca-out/assets',
    query: { id: '1', chain: 'Kujira' },
    events: {
        on: jest.fn(),
    },
};


jest.mock('next/router', () => ({
    useRouter() {
        return mockRouterDcaOut;
    },
}));

jest.mock('kujira.js');





describe('DCA Out Assets page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFiatPrice();
        useFormStore.setState({
            forms: mockStateMachine.state,
            updateForm: () => mockStateMachine.actions.updateAction,
            resetForm: () => mockStateMachine.actions.resetAction,
        });

        useOsmosis.setState({
            query: jest.fn(),
        });

        useKujira.setState({
            query: {
                bank: {
                    allBalances: mockBalances(),
                },
            } as unknown as KujiraQueryClient,
        });
    });
    describe('on page load', () => {
        it('renders the heading', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetDcaOut();

            expect(
                within(screen.getByTestId('strategy-modal-header')).getByText('Choose Funding & Assets'),
            ).toBeInTheDocument();
        });
    });

    describe('when initial denom is selected', () => {
        describe('and there are available funds', () => {
            it('should show available funds', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaOut();

                const select = await waitFor(() => screen.getByLabelText(/What position do you want to take profit on?/));
                selectEvent.select(select, ['KUJI']);

                await waitFor(() => expect(screen.getByText('12.053333')).toBeInTheDocument());
            });
        });
    });

    describe('when initial denom is selected', () => {
        describe('and there are not available funds', () => {
            it('should show an amount of none', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaOut();

                const select = await waitFor(() => screen.getByLabelText(/What position do you want to take profit on?/));
                await selectEvent.select(select, ['NBTC']);

                await waitFor(() => expect(screen.getByText('None')).toBeInTheDocument());
            });
        });
    });

    describe('when initial deposit is entered', () => {
        describe('and the amount is greater than the available funds', () => {
            it('should show an error', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaOut();

                const initalDenomSelect = await waitFor(() =>
                    screen.getByLabelText(/What position do you want to take profit on?/),
                );
                await selectEvent.select(initalDenomSelect, ['KUJI']);

                await waitFor(() => expect(screen.getByText('12.053333')).toBeInTheDocument());
                const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));

                // enter initial deposit
                await act(async () => {
                    await waitFor(() => userEvent.type(input, '100'), { timeout: 5000 });
                });

                // select resulting denom
                const select = await waitFor(() => screen.getByLabelText(/How do you want to hold your profits?/));
                await selectEvent.select(select, ['OSMO']);

                // submit
                await act(async () => {
                    await waitFor(() => userEvent.click(screen.getByText(/Next/)));
                });

                await waitFor(() =>
                    expect(
                        screen.getByText('Initial Deposit must be less than or equal to than your current balance'),
                    ).toBeInTheDocument(),
                );

                expect(screen.getByText('Next')).toBeDisabled();
            });
        });
    });

    describe('when form is filled and submitted', () => {
        it('submits form successfully', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetDcaOut();

            // wait for balances to load
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((r) => setTimeout(r, 1000));

            // select initial denom
            await waitFor(() => screen.getByText(/What position do you want to take profit on?/));
            await selectEvent.select(screen.getByLabelText(/What position do you want to take profit on?/), ['KUJI']);

            // enter initial deposit
            const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));
            await waitFor(() => userEvent.type(input, '1'), { timeout: 5000 });

            // select resulting denom
            await selectEvent.select(screen.getByLabelText(/How do you want to hold your profits?/), ['OSMO']);

            // submit
            await waitFor(() => userEvent.click(screen.getByText(/Next/)));

            expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                initialDenom: 'ukuji',
                initialDeposit: 1,
                resultingDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
                strategyType: 'DCA Out'

            });

            expect(mockRouterDcaOut.push).toHaveBeenCalledWith({
                pathname: '/create-strategy/dca-out/customise',
                query: { chain: 'Kujira' },
            });
        });
    });

    describe('connect wallet button behaviour', () => {
        it('shows connect wallet when not connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

            await renderTargetDcaOut();
            expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
        });

        it('does not show connect wallet when connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
            await renderTargetDcaOut();

            expect(screen.getByText(/Next/)).toBeInTheDocument();
        });
    });
});


// DCA+ In

const mockRouterDcaPlusIn = {
    isReady: true,
    push: jest.fn(),
    pathname: '/create-strategy/dca-plus-in/assets',
    query: { id: '1', chain: 'Kujira' },
    events: {
        on: jest.fn(),
    },
};

jest.mock('@hooks/useWallet');

jest.mock('next/router', () => ({
    useRouter() {
        return mockRouterDcaPlusIn;
    },
}));





describe('DCA In Assets page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useFormStore.setState({
            forms: mockStateMachine.state,
            updateForm: () => mockStateMachine.actions.updateAction,
            resetForm: () => mockStateMachine.actions.resetAction,
        });

        useOsmosis.setState({
            query: jest.fn(),
        });

        useKujira.setState({
            query: {
                bank: {
                    allBalances: mockBalances(),
                },
            } as unknown as KujiraQueryClient,
        });
        mockFiatPrice();
    });
    describe('on page load', () => {
        it('renders the heading', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetDcaPlusIn();

            expect(
                within(screen.getByTestId('strategy-modal-header')).getByText('Choose Funding & Assets'),
            ).toBeInTheDocument();
        });
    });

    describe('when initial denom is selected', () => {
        describe('and there are available funds', () => {
            it('should show available funds', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaPlusIn();

                const select = await waitFor(() => screen.getByLabelText(/How will you fund your first investment?/));
                selectEvent.select(select, ['DEMO']);

                await waitFor(() => expect(screen.getByText('88.08')).toBeInTheDocument());
            });
        });
    });
    describe('when initial denom is selected', () => {
        describe('and there are not available funds', () => {
            it('should show an amount of none', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaPlusIn();

                const select = await waitFor(() => screen.getByLabelText(/How will you fund your first investment?/));
                await selectEvent.select(select, ['USK']);

                await waitFor(() => expect(screen.getByText('None')).toBeInTheDocument());
            });
        });
    });

    describe('when initial deposit is entered', () => {
        describe('and the amount is greater than the available funds', () => {
            it('should show an error', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaPlusIn();

                const initalDenomSelect = await waitFor(() =>
                    screen.getByLabelText(/How will you fund your first investment?/),
                );
                await selectEvent.select(initalDenomSelect, ['DEMO']);

                await waitFor(() => expect(screen.getByText('88.08')).toBeInTheDocument());
                const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));

                // enter initial deposit
                await act(async () => {
                    await waitFor(() => userEvent.type(input, '100'), { timeout: 5000 });
                });

                // select resulting denom
                const select = await waitFor(() => screen.getByLabelText(/What asset do you want to invest in?/));
                await selectEvent.select(select, ['KUJI']);

                // submit
                await act(async () => {
                    await waitFor(() => userEvent.click(screen.getByText(/Next/)));
                });

                await waitFor(() =>
                    expect(
                        screen.getByText('Initial Deposit must be less than or equal to than your current balance'),
                    ).toBeInTheDocument(),
                );

                expect(screen.getByText('Next')).toBeDisabled();
            });
        });
    });

    describe('when form is filled and submitted', () => {
        it('submits form successfully', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetDcaPlusIn();

            // wait for balances to load
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((r) => setTimeout(r, 1000));

            // select initial denom
            await waitFor(() => screen.getByText(/How will you fund your first investment?/));
            await selectEvent.select(screen.getByLabelText(/How will you fund your first investment?/), ['USK']);

            // enter initial deposit
            const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));
            await waitFor(() => userEvent.type(input, '50'), { timeout: 5000 });

            // select resulting denom
            await selectEvent.select(screen.getByLabelText(/What asset do you want to invest in?/), ['NBTC']);

            // submit
            await waitFor(() => userEvent.click(screen.getByText(/Next/)));

            expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                initialDeposit: 50,
                resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
                strategyType: 'DCA+ In'
            });

            expect(mockRouterDcaPlusIn.push).toHaveBeenCalledWith({
                pathname: '/create-strategy/dca-plus-in/customise',
                query: { chain: 'Kujira' },
            });
        });
    });

    describe('connect wallet button behaviour', () => {
        it('shows connect wallet when not connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

            await renderTargetDcaPlusIn();
            expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
        });

        it('does not show connect wallet when connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
            await renderTargetDcaPlusIn();

            expect(screen.getByText(/Next/)).toBeInTheDocument();
        });
    });
});


// DCA+ out

const mockRouterDcaPlusOut = {
    isReady: true,
    push: jest.fn(),
    pathname: '/create-strategy/dca-plus-out/assets',
    query: { id: '1', chain: 'Kujira' },
    events: {
        on: jest.fn(),
    },
};

jest.mock('@hooks/useWallet');

jest.mock('next/router', () => ({
    useRouter() {
        return mockRouterDcaPlusOut;
    },
}));





describe('DCA Out Assets page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFiatPrice();

        useFormStore.setState({
            forms: mockStateMachine.state,
            updateForm: () => mockStateMachine.actions.updateAction,
            resetForm: () => mockStateMachine.actions.resetAction,
        });

        useOsmosis.setState({
            query: jest.fn(),
        });

        useKujira.setState({
            query: mockKujiraQuery as unknown as KujiraQueryClient,
        });
    });
    describe('on page load', () => {
        it('renders the heading', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetDcaPlusOut();

            expect(
                within(screen.getByTestId('strategy-modal-header')).getByText('Choose Funding & Assets'),
            ).toBeInTheDocument();
        });
    });

    describe('when initial denom is selected', () => {
        describe('and there are available funds', () => {
            it('should show available funds', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaPlusOut();

                const select = await waitFor(() => screen.getByLabelText(/What position do you want to take profit on?/));
                selectEvent.select(select, ['KUJI']);

                await waitFor(() => expect(screen.getByText('12.053333')).toBeInTheDocument());
            });
        });
    });
    describe('when initial denom is selected', () => {
        describe('and there are not available funds', () => {
            it('should show an amount of none', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaPlusOut();

                const select = await waitFor(() => screen.getByLabelText(/What position do you want to take profit on?/));
                await selectEvent.select(select, ['NBTC']);

                await waitFor(() => expect(screen.getByText('None')).toBeInTheDocument());
            });
        });
    });

    describe('when initial deposit is entered', () => {
        describe('and the amount is greater than the available funds', () => {
            it('should show an error', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetDcaPlusOut();

                const initalDenomSelect = await waitFor(() =>
                    screen.getByLabelText(/What position do you want to take profit on?/),
                );
                await selectEvent.select(initalDenomSelect, ['KUJI']);

                await waitFor(() => expect(screen.getByText('12.053333')).toBeInTheDocument());
                const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));

                // enter initial deposit
                await act(async () => {
                    await waitFor(() => userEvent.type(input, '100'), { timeout: 5000 });
                });

                // select resulting denom
                const select = await waitFor(() => screen.getByLabelText(/How do you want to hold your profits?/));
                await selectEvent.select(select, ['DEMO']);

                // submit
                await act(async () => {
                    await waitFor(() => userEvent.click(screen.getByText(/Next/)));
                });

                await waitFor(() =>
                    expect(
                        screen.getByText('Initial Deposit must be less than or equal to than your current balance'),
                    ).toBeInTheDocument(),
                );

                expect(screen.getByText('Next')).toBeDisabled();
            });
        });
    });

    describe('when form is filled and submitted', () => {
        it('submits form successfully', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetDcaPlusOut();

            // wait for balances to load
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((r) => setTimeout(r, 1000));

            // select initial denom
            await waitFor(() => screen.getByText(/What position do you want to take profit on?/));
            await selectEvent.select(screen.getByLabelText(/What position do you want to take profit on?/), ['KUJI']);

            // enter initial deposit
            const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));
            await waitFor(() => userEvent.type(input, '10'), { timeout: 5000 });

            // select resulting denom
            await selectEvent.select(screen.getByLabelText(/How do you want to hold your profits?/), ['DEMO']);

            // submit
            await waitFor(() => userEvent.click(screen.getByText(/Next/)));

            expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                initialDenom: 'ukuji',
                initialDeposit: 10,
                resultingDenom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
                strategyType: 'DCA+ Out'
            });

            expect(mockRouterDcaPlusOut.push).toHaveBeenCalledWith({
                pathname: '/create-strategy/dca-plus-out/customise',
                query: { chain: 'Kujira' },
            });
        });
    });

    describe('connect wallet button behaviour', () => {
        it('shows connect wallet when not connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

            await renderTargetDcaPlusOut();
            expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
        });

        it('does not show connect wallet when connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
            await renderTargetDcaPlusOut();

            expect(screen.getByText(/Next/)).toBeInTheDocument();
        });
    });
});


// WS In

const mockRouterWeightedScaleIn = {
    isReady: true,
    push: jest.fn(),
    pathname: '/create-strategy/weighted-scale-in/assets',
    query: { id: '1', chain: 'Kujira' },
    events: {
        on: jest.fn(),
    },
};

jest.mock('next/router', () => ({
    useRouter() {
        return mockRouterWeightedScaleIn;
    },
}));





describe('Assets page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useFormStore.setState({
            forms: mockStateMachine.state,
            updateForm: () => mockStateMachine.actions.updateAction,
            resetForm: () => mockStateMachine.actions.resetAction,
        });

        useOsmosis.setState({
            query: jest.fn(),
        });

        useKujira.setState({
            query: {
                bank: {
                    allBalances: mockBalances(),
                },
            } as unknown as KujiraQueryClient,
        });
        mockFiatPrice();
    });
    describe('on page load', () => {
        it('renders the heading', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetWeightedScaleIn();

            expect(
                within(screen.getByTestId('strategy-modal-header')).getByText('Choose Funding & Assets'),
            ).toBeInTheDocument();
        });
    });

    describe('when initial denom is selected', () => {
        describe('and there are available funds', () => {
            it('should show available funds', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetWeightedScaleIn();

                const select = await waitFor(() => screen.getByLabelText(/How will you fund your first investment?/));
                selectEvent.select(select, ['DEMO']);

                await waitFor(() => expect(screen.getByText('88.08')).toBeInTheDocument());
            });
        });
    });

    describe('when initial denom is selected', () => {
        describe('and there are not available funds', () => {
            it('should show an amount of none', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetWeightedScaleIn();

                const select = await waitFor(() => screen.getByLabelText(/How will you fund your first investment?/));
                await selectEvent.select(select, ['USK']);

                await waitFor(() => expect(screen.getByText('None')).toBeInTheDocument());
            });
        });
    });

    describe('when initial deposit is entered', () => {
        describe('and the amount is greater than the available funds', () => {
            it('should show an error', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetWeightedScaleIn();

                const initalDenomSelect = await waitFor(() =>
                    screen.getByLabelText(/How will you fund your first investment?/),
                );
                await selectEvent.select(initalDenomSelect, ['DEMO']);

                await waitFor(() => expect(screen.getByText('88.08')).toBeInTheDocument());
                const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));

                // enter initial deposit
                await act(async () => {
                    await waitFor(() => userEvent.type(input, '100'), { timeout: 5000 });
                });

                // select resulting denom
                const select = await waitFor(() => screen.getByLabelText(/What asset do you want to invest in?/));
                await selectEvent.select(select, ['KUJI']);

                // submit
                await act(async () => {
                    await waitFor(() => userEvent.click(screen.getByText(/Next/)));
                });

                await waitFor(() =>
                    expect(
                        screen.getByText('Initial Deposit must be less than or equal to than your current balance'),
                    ).toBeInTheDocument(),
                );

                expect(screen.getByText('Next')).toBeDisabled();
            });
        });
    });

    describe('when form is filled and submitted', () => {
        it('submits form successfully', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetWeightedScaleIn();

            // wait for balances to load
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((r) => setTimeout(r, 1000));

            // select initial denom
            await waitFor(() => screen.getByText(/How will you fund your first investment?/));
            await selectEvent.select(screen.getByLabelText(/How will you fund your first investment?/), ['USK']);

            // enter initial deposit
            const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));
            await waitFor(() => userEvent.type(input, '50'), { timeout: 5000 });

            // select resulting denom
            await selectEvent.select(screen.getByLabelText(/What asset do you want to invest in?/), ['NBTC']);

            // submit
            await waitFor(() => userEvent.click(screen.getByText(/Next/)));

            expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                initialDeposit: 50,
                resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
                strategyType: 'Weighted Scale In'
            });

            expect(mockRouterWeightedScaleIn.push).toHaveBeenCalledWith({
                pathname: '/create-strategy/weighted-scale-in/customise',
                query: { chain: 'Kujira' },
            });
        });
    });

    describe('connect wallet button behaviour', () => {
        it('shows connect wallet when not connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

            await renderTargetWeightedScaleIn();
            expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
        });

        it('does not show connect wallet when connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
            await renderTargetWeightedScaleIn();

            expect(screen.getByText(/Next/)).toBeInTheDocument();
        });
    });
});


// WS Out 

const mockRouterWeightedScaleOut = {
    isReady: true,
    push: jest.fn(),
    pathname: '/create-strategy/weighted-scale-out/assets',
    query: { id: '1', chain: 'Kujira' },
    events: {
        on: jest.fn(),
    },
};

jest.mock('@hooks/useWallet');

jest.mock('next/router', () => ({
    useRouter() {
        return mockRouterWeightedScaleOut;
    },
}));







describe('DCA Out Assets page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFiatPrice();

        useFormStore.setState({
            forms: mockStateMachine.state,
            updateForm: () => mockStateMachine.actions.updateAction,
            resetForm: () => mockStateMachine.actions.resetAction,
        });

        useOsmosis.setState({
            query: jest.fn(),
        });

        useKujira.setState({
            query: mockKujiraQuery as unknown as KujiraQueryClient,
        });
    });

    describe('on page load', () => {
        it('renders the heading', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetWeightedScaleOut();

            expect(
                within(screen.getByTestId('strategy-modal-header')).getByText('Choose Funding & Assets'),
            ).toBeInTheDocument();
        });
    });

    describe('when initial denom is selected', () => {
        describe('and there are available funds', () => {
            it('should show available funds', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetWeightedScaleOut();

                const select = await waitFor(() => screen.getByLabelText(/What position do you want to take profit on?/));
                selectEvent.select(select, ['KUJI']);

                await waitFor(() => expect(screen.getByText('12.053333')).toBeInTheDocument());
            });
        });
    });

    describe('when initial denom is selected', () => {
        describe('and there are not available funds', () => {
            it('should show an amount of none', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetWeightedScaleOut();

                const select = await waitFor(() => screen.getByLabelText(/What position do you want to take profit on?/));
                await selectEvent.select(select, ['NBTC']);

                await waitFor(() => expect(screen.getByText('None')).toBeInTheDocument());
            });
        });
    });

    describe('when initial deposit is entered', () => {
        describe('and the amount is greater than the available funds', () => {
            it('should show an error', async () => {
                mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                await renderTargetWeightedScaleOut();

                const initalDenomSelect = await waitFor(() =>
                    screen.getByLabelText(/What position do you want to take profit on?/),
                );
                await selectEvent.select(initalDenomSelect, ['KUJI']);

                await waitFor(() => expect(screen.getByText('12.053333')).toBeInTheDocument());
                const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));

                // enter initial deposit
                await act(async () => {
                    await waitFor(() => userEvent.type(input, '100'), { timeout: 5000 });
                });

                // select resulting denom
                const select = await waitFor(() => screen.getByLabelText(/How do you want to hold your profits?/));
                await selectEvent.select(select, ['DEMO']);

                // submit
                await act(async () => {
                    await waitFor(() => userEvent.click(screen.getByText(/Next/)));
                });

                await waitFor(() =>
                    expect(
                        screen.getByText('Initial Deposit must be less than or equal to than your current balance'),
                    ).toBeInTheDocument(),
                );

                expect(screen.getByText('Next')).toBeDisabled();
            });
        });
    });

    describe('when form is filled and submitted', () => {
        it('submits form successfully', async () => {
            mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

            await renderTargetWeightedScaleOut();

            // wait for balances to load
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((r) => setTimeout(r, 1000));

            // select initial denom
            await waitFor(() => screen.getByText(/What position do you want to take profit on?/));
            await selectEvent.select(screen.getByLabelText(/What position do you want to take profit on?/), ['KUJI']);

            // enter initial deposit
            const input = await waitFor(() => screen.getByPlaceholderText(/Enter amount/));
            await waitFor(() => userEvent.type(input, '10'), { timeout: 5000 });

            // select resulting denom
            await selectEvent.select(screen.getByLabelText(/How do you want to hold your profits?/), ['DEMO']);

            // submit
            await waitFor(() => userEvent.click(screen.getByText(/Next/)));

            expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                initialDenom: 'ukuji',
                initialDeposit: 10,
                resultingDenom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
                strategyType: 'Weighted Scale Out'

            });

            expect(mockRouterWeightedScaleOut.push).toHaveBeenCalledWith({
                pathname: '/create-strategy/weighted-scale-out/customise',
                query: { chain: 'Kujira' },
            });
        });
    });

    describe('connect wallet button behaviour', () => {
        it('shows connect wallet when not connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

            await renderTargetWeightedScaleOut();
            expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
        });

        it('does not show connect wallet when connected', async () => {
            mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
            await renderTargetWeightedScaleOut();

            expect(screen.getByText(/Next/)).toBeInTheDocument();
        });
    });
});

