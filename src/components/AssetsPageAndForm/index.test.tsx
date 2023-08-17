import { render, screen, act, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { queryClient } from '@helpers/test/testQueryClient';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { mockGetPairs } from '@helpers/test/mockGetPairs';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import { mockFiatPrice } from '@helpers/test/mockFiatPrice';
import { mockBalances } from '@helpers/test/mockBalances';
import { useKujira } from '@hooks/useKujira';
import { KujiraQueryClient } from 'kujira.js';
import { useFormStore } from '@hooks/useFormStore';
import selectEvent from 'react-select-event';
import { Chains } from '@hooks/useChain/Chains';
import { useOsmosis } from '@hooks/useOsmosis';
import { mockGetBalance } from '@helpers/test/mockGetBalance';
import { featureFlags } from 'src/constants';
import userEvent from '@testing-library/user-event';
import DcaInPage from '../../pages/create-strategy/dca-in/assets/index.page';
import DcaOutPage from '../../pages/create-strategy/dca-out/assets/index.page';
import DcaPlusInPage from '../../pages/create-strategy/dca-plus-in/assets/index.page';
import WeightedScaleInPage from '../../pages/create-strategy/weighted-scale-in/assets/index.page';
import DcaPlusOutPage from '../../pages/create-strategy/dca-plus-out/assets/index.page';
import WeightedScaleOutPage from '../../pages/create-strategy/weighted-scale-out/assets/index.page';


const mockRouter = {
    isReady: true,
    push: jest.fn(),
    pathname: '/create-strategy/dca-in/assets',
    query: { id: '1', chain: 'Kujira' },
    events: {
        on: jest.fn(),
    },
};

jest.mock('@hooks/useWallet');


jest.mock('next/router', () => ({
    useRouter() { return mockRouter },
}));

const mockStateMachine = {
    state: {},
    actions: {
        updateAction: jest.fn(),
        resetAction: jest.fn(),
    },
};


async function renderTarget(SelectedComponent: () => JSX.Element) {
    await act(() => {
        render(
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <SelectedComponent />
                </QueryClientProvider>
            </ThemeProvider>,
        );
    });
}

describe('Assets page', () => {
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

    // Issue with rendering the heading correctly. 


    describe('on page load', () => {
        describe('renders first question correctly', () => {
            describe('Buy strategies', () => {
                it('Dca In', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

                    await renderTarget(DcaInPage)

                    expect(
                        screen.getByText('How will you fund your first investment?')
                    ).toBeInTheDocument()
                });
                it('Dca+ In', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

                    await renderTarget(DcaPlusInPage)

                    expect(
                        screen.getByText('How will you fund your first investment?')
                    ).toBeInTheDocument()
                });
                it('Weighted Scale In', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

                    await renderTarget(WeightedScaleInPage)

                    expect(
                        screen.getByText('How will you fund your first investment?')
                    ).toBeInTheDocument()
                })

            })

            describe('Sell strategies', () => {
                it('DCA Out', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

                    await renderTarget(DcaOutPage)

                    expect(
                        screen.getByText('What position do you want to take profit on?')
                    ).toBeInTheDocument()
                });
                it('DCA+ Out', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

                    await renderTarget(DcaPlusOutPage)

                    expect(
                        screen.getByText('What position do you want to take profit on?')
                    ).toBeInTheDocument()
                });
                it('Weighted Scale Out', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

                    await renderTarget(WeightedScaleOutPage)

                    expect(
                        screen.getByText('What position do you want to take profit on?')
                    ).toBeInTheDocument()
                });


            })


        })



    });



    describe('DCA In Tests', () => {

        describe('when initial denom is selected', () => {
            describe('and there are available funds', () => {
                it('should show available funds', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                    await renderTarget(DcaInPage);

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

                    await renderTarget(DcaInPage);

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

                    await renderTarget(DcaInPage);

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
                await renderTarget(DcaInPage);

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


                if (featureFlags.singleAssetsEnabled) {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                        initialDeposit: 1,
                        resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
                        strategyType: 'DCA In'
                    });
                } else {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                        initialDeposit: 1,
                        resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
                    });
                }


                expect(mockRouter.push).toHaveBeenCalledWith({
                    pathname: '/create-strategy/dca-in/customise',
                    query: { chain: Chains.Kujira },
                });
            });
        });

        describe('connect wallet button behaviour', () => {
            it('shows connect wallet when not connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

                await renderTarget(DcaInPage);
                expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
            });

            it('does not show connect wallet when connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
                await renderTarget(DcaInPage);

                expect(screen.getByText(/Next/)).toBeInTheDocument();
            });
        });
    })



    describe('DCA Out Tests', () => {

        describe('when initial denom is selected', () => {
            describe('and there are available funds', () => {
                it('should show available funds', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                    await renderTarget(DcaOutPage);

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

                    await renderTarget(DcaOutPage);

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

                    await renderTarget(DcaOutPage);

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

                await renderTarget(DcaOutPage);

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

                if (featureFlags.singleAssetsEnabled) {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'ukuji',
                        initialDeposit: 1,
                        resultingDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
                        strategyType: 'DCA Out'
                    });
                } else {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'ukuji',
                        initialDeposit: 1,
                        resultingDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
                    });
                }

                expect(mockRouter.push).toHaveBeenCalledWith({
                    pathname: '/create-strategy/dca-out/customise',
                    query: { chain: 'Kujira' },
                });
            });
        });

        describe('connect wallet button behaviour', () => {
            it('shows connect wallet when not connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

                await renderTarget(DcaOutPage);
                expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
            });

            it('does not show connect wallet when connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
                await renderTarget(DcaOutPage);

                expect(screen.getByText(/Next/)).toBeInTheDocument();
            });
        });


    })



    describe('DCA+ In Tests', () => {
        describe('when initial deposit is entered', () => {
            describe('and the amount is greater than the available funds', () => {
                it('should show an error', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                    await renderTarget(DcaPlusInPage);

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
                await renderTarget(DcaPlusInPage);

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

                if (featureFlags.singleAssetsEnabled) {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                        initialDeposit: 50,
                        resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
                        strategyType: 'DCA+ In'
                    });
                } else {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                        initialDeposit: 50,
                        resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
                    });
                }

                expect(mockRouter.push).toHaveBeenCalledWith({
                    pathname: '/create-strategy/dca-plus-in/customise',
                    query: { chain: 'Kujira' },
                });
            });
        });

        describe('connect wallet button behaviour', () => {
            it('shows connect wallet when not connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

                await renderTarget(DcaPlusInPage);
                expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
            });

            it('does not show connect wallet when connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
                await renderTarget(DcaPlusInPage);

                expect(screen.getByText(/Next/)).toBeInTheDocument();
            });
        });

    })



    describe('DCA+ Out Tests', () => {

        describe('when initial denom is selected', () => {
            describe('and there are available funds', () => {
                it('should show available funds', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                    await renderTarget(DcaPlusOutPage);

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

                    await renderTarget(DcaPlusOutPage);

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

                    await renderTarget(DcaPlusOutPage);

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
                await renderTarget(DcaPlusOutPage);

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

                if (featureFlags.singleAssetsEnabled) {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'ukuji',
                        initialDeposit: 10,
                        resultingDenom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
                        strategyType: 'DCA+ Out'
                    });
                } else {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'ukuji',
                        initialDeposit: 10,
                        resultingDenom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
                    });
                }

                expect(mockRouter.push).toHaveBeenCalledWith({
                    pathname: '/create-strategy/dca-plus-out/customise',
                    query: { chain: 'Kujira' },
                });
            });
        });

        describe('connect wallet button behaviour', () => {
            it('shows connect wallet when not connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

                await renderTarget(DcaPlusOutPage);
                expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
            });

            it('does not show connect wallet when connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
                await renderTarget(DcaPlusOutPage);

                expect(screen.getByText(/Next/)).toBeInTheDocument();
            });
        });
    })




    describe('Weighted Scale In Tests', () => {

        describe('when initial denom is selected', () => {
            describe('and there are available funds', () => {
                it('should show available funds', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                    await renderTarget(WeightedScaleInPage);

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

                    await renderTarget(WeightedScaleInPage);

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

                    await renderTarget(WeightedScaleInPage);

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
                await renderTarget(WeightedScaleInPage);

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

                if (featureFlags.singleAssetsEnabled) {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                        initialDeposit: 50,
                        resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
                        strategyType: 'Weighted Scale In'
                    });
                } else {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'factory/kujira1r85reqy6h0lu02vyz0hnzhv5whsns55gdt4w0d7ft87utzk7u0wqr4ssll/uusk',
                        initialDeposit: 50,
                        resultingDenom: 'ibc/784AEA7C1DC3C62F9A04EB8DC3A3D1DCB7B03BA8CB2476C5825FA0C155D3018E',
                    });
                }

                expect(mockRouter.push).toHaveBeenCalledWith({
                    pathname: '/create-strategy/weighted-scale-in/customise',
                    query: { chain: 'Kujira' },
                });
            });
        });

        describe('connect wallet button behaviour', () => {
            it('shows connect wallet when not connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

                await renderTarget(WeightedScaleInPage);
                expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
            });

            it('does not show connect wallet when connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
                await renderTarget(WeightedScaleInPage);

                expect(screen.getByText(/Next/)).toBeInTheDocument();
            });
        });

    })




    describe('Weighted Scale Out Tests', () => {

        describe('when initial denom is selected', () => {
            describe('and there are available funds', () => {
                it('should show available funds', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                    await renderTarget(WeightedScaleOutPage);

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

                    await renderTarget(WeightedScaleOutPage);

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

                    await renderTarget(WeightedScaleOutPage);

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

                await renderTarget(WeightedScaleOutPage);

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

                if (featureFlags.singleAssetsEnabled) {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'ukuji',
                        initialDeposit: 10,
                        resultingDenom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
                        strategyType: 'Weighted Scale Out'
                    });
                } else {
                    expect(mockStateMachine.actions.updateAction).toHaveBeenCalledWith({
                        initialDenom: 'ukuji',
                        initialDeposit: 10,
                        resultingDenom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
                    });
                }
                expect(mockRouter.push).toHaveBeenCalledWith({
                    pathname: '/create-strategy/weighted-scale-out/customise',
                    query: { chain: 'Kujira' },
                });
            });
        });

        describe('connect wallet button behaviour', () => {
            it('shows connect wallet when not connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

                await renderTarget(WeightedScaleOutPage);
                expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
            });

            it('does not show connect wallet when connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
                await renderTarget(WeightedScaleOutPage);

                expect(screen.getByText(/Next/)).toBeInTheDocument();
            });
        });
    })

});


