import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockUseWallet } from '@helpers/test/mockUseWallet';
import { mockGetPairs } from '@helpers/test/mockGetPairs';
import { ThemeProvider } from '@chakra-ui/react';
import theme from 'src/theme';
import { mockFiatPrice } from '@helpers/test/mockFiatPrice';
import { mockBalances } from '@helpers/test/mockBalances';
import { useKujira } from '@hooks/useKujira';
import { KujiraQueryClient } from 'kujira.js';
import { FormNames, useFormStore } from '@hooks/useFormStore';
import selectEvent from 'react-select-event';
import { Chains } from '@hooks/useChain/Chains';
import { useOsmosis } from '@hooks/useOsmosis';
import { mockGetBalance } from '@helpers/test/mockGetBalance';
import userEvent from '@testing-library/user-event';
import { StrategyTypes } from '@models/StrategyTypes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@helpers/test/testQueryClient';
import steps from '@formConfig/dcaIn';
import { TransactionType } from '@components/TransactionType';
import { StrategyInfoProvider } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { dcaPlusInSteps } from '@formConfig/dcaPlusIn';
import weightedScaleOutSteps from '@formConfig/weightedScaleOut';
import { Assets } from '.';



const mockRouter = {
    isReady: true,
    push: jest.fn(),
    pathname: '/',
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


async function renderTarget(children: JSX.Element) {
    await act(() => {
        render(
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <StrategyInfoProvider strategyInfo={{
                        strategyType: StrategyTypes.DCAIn,
                        transactionType: TransactionType.Buy,
                        formName: FormNames.DcaIn,
                    }} >
                        {children}
                    </StrategyInfoProvider>
                </QueryClientProvider>
            </ThemeProvider>,
        );
    });
}
async function renderTargetWeightedScaleOut(children: JSX.Element) {
    await act(() => {
        render(
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <StrategyInfoProvider strategyInfo={{
                        strategyType: StrategyTypes.WeightedScaleOut,
                        transactionType: TransactionType.Sell,
                        formName: FormNames.WeightedScaleOut,
                    }} >
                        {children}
                    </StrategyInfoProvider>
                </QueryClientProvider>
            </ThemeProvider>,
        );
    });
}
async function renderTargetDcaPlusIn(children: JSX.Element) {
    await act(() => {
        render(
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <StrategyInfoProvider strategyInfo={{
                        strategyType: StrategyTypes.DCAPlusIn,
                        transactionType: TransactionType.Buy,
                        formName: FormNames.DcaPlusIn,
                    }} >
                        {children}
                    </StrategyInfoProvider>
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
                it('DCA In', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

                    await renderTarget(<Assets stepsConfig={steps} strategyType={StrategyTypes.DCAIn} />)

                    expect(
                        screen.getByText('How will you fund your first investment?')
                    ).toBeInTheDocument()
                });
                it('DCA+ In', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

                    await renderTargetDcaPlusIn(<Assets stepsConfig={dcaPlusInSteps} strategyType={StrategyTypes.DCAPlusIn} />)

                    expect(
                        screen.getByText('How will you fund your first investment?')
                    ).toBeInTheDocument()
                });
            })

            describe('Sell strategies', () => {
                it('Weighted Scale Out', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), jest.fn());

                    await renderTargetWeightedScaleOut(<Assets stepsConfig={weightedScaleOutSteps} strategyType={StrategyTypes.WeightedScaleOut} />)

                    expect(
                        screen.getByText('What position do you want to take profit on?')
                    ).toBeInTheDocument()
                });


            })



        });


        describe('DCA+ In Tests', () => {





            describe('when initial denom is selected', () => {
                describe('and there are available funds', () => {
                    it('should show available funds', async () => {
                        mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                        await renderTarget(<Assets stepsConfig={steps} strategyType={StrategyTypes.DCAIn} />);

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

                        await renderTarget(<Assets stepsConfig={steps} strategyType={StrategyTypes.DCAIn} />);

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

                        await renderTarget(<Assets stepsConfig={steps} strategyType={StrategyTypes.DCAIn} />);

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
                    await renderTarget(<Assets stepsConfig={steps} strategyType={StrategyTypes.DCAIn} />);

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


                    expect(mockRouter.push).toHaveBeenCalledWith({
                        pathname: '/create-strategy/dca-in/customise',
                        query: { chain: Chains.Kujira },
                    });
                });
            });

            describe('connect wallet button behaviour', () => {
                it('shows connect wallet when not connected', async () => {
                    mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

                    await renderTarget(<Assets stepsConfig={steps} strategyType={StrategyTypes.DCAIn} />);
                    expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
                });

                it('does not show connect wallet when connected', async () => {
                    mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
                    await renderTarget(<Assets stepsConfig={steps} strategyType={StrategyTypes.DCAIn} />);

                    expect(screen.getByText(/Next/)).toBeInTheDocument();
                });
            });
        })


        describe('DCA+ In Tests', () => {


            describe('when initial denom is selected', () => {
                describe('and there are available funds', () => {
                    it('should show available funds', async () => {
                        mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                        await renderTargetDcaPlusIn(<Assets stepsConfig={dcaPlusInSteps} strategyType={StrategyTypes.DCAPlusIn} />)

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

                        await renderTargetDcaPlusIn(<Assets stepsConfig={dcaPlusInSteps} strategyType={StrategyTypes.DCAPlusIn} />)

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

                        await renderTargetDcaPlusIn(<Assets stepsConfig={dcaPlusInSteps} strategyType={StrategyTypes.DCAPlusIn} />)

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

                    await renderTargetDcaPlusIn(<Assets stepsConfig={dcaPlusInSteps} strategyType={StrategyTypes.DCAPlusIn} />)

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


                    expect(mockRouter.push).toHaveBeenCalledWith({
                        pathname: '/create-strategy/dca-plus-in/customise',
                        query: { chain: 'Kujira' },
                    });
                });
            });

            describe('connect wallet button behaviour', () => {
                it('shows connect wallet when not connected', async () => {
                    mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

                    await renderTargetDcaPlusIn(<Assets stepsConfig={dcaPlusInSteps} strategyType={StrategyTypes.DCAPlusIn} />)
                    expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
                });

                it('does not show connect wallet when connected', async () => {
                    mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
                    await renderTargetDcaPlusIn(<Assets stepsConfig={dcaPlusInSteps} strategyType={StrategyTypes.DCAPlusIn} />)

                    expect(screen.getByText(/Next/)).toBeInTheDocument();
                });
            });
        })
    })



    describe.only('Weighted Scale Out Tests', () => {




        describe('when initial denom is selected', () => {
            describe('and there are available funds', () => {
                it('should show available funds', async () => {
                    mockUseWallet(mockGetPairs(), jest.fn(), mockGetBalance());

                    await renderTargetWeightedScaleOut(<Assets stepsConfig={weightedScaleOutSteps} strategyType={StrategyTypes.WeightedScaleOut} />)

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

                    await renderTargetWeightedScaleOut(<Assets stepsConfig={weightedScaleOutSteps} strategyType={StrategyTypes.WeightedScaleOut} />)

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

                    await renderTargetWeightedScaleOut(<Assets stepsConfig={weightedScaleOutSteps} strategyType={StrategyTypes.WeightedScaleOut} />)
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

                await renderTargetWeightedScaleOut(<Assets stepsConfig={weightedScaleOutSteps} strategyType={StrategyTypes.WeightedScaleOut} />)

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

                expect(mockRouter.push).toHaveBeenCalledWith({
                    pathname: '/create-strategy/weighted-scale-out/customise',
                    query: { chain: 'Kujira' },
                });
            });
        });

        describe('connect wallet button behaviour', () => {
            it('shows connect wallet when not connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), false);

                await renderTargetWeightedScaleOut(<Assets stepsConfig={weightedScaleOutSteps} strategyType={StrategyTypes.WeightedScaleOut} />)
                expect(screen.getByText(/Connect to a wallet/)).toBeInTheDocument();
            });

            it('does not show connect wallet when connected', async () => {
                mockUseWallet(jest.fn(), jest.fn(), jest.fn(), jest.fn(), true);
                await renderTargetWeightedScaleOut(<Assets stepsConfig={weightedScaleOutSteps} strategyType={StrategyTypes.WeightedScaleOut} />)

                expect(screen.getByText(/Next/)).toBeInTheDocument();
            });
        });
    })

})



