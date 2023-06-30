import { renderHook, act } from '@testing-library/react-hooks';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { useWallet } from '@hooks/useWallet';
import useFiatPrice from '@hooks/useFiatPrice';
import { defaultDenom } from '@utils/defaultDenom';
import { TestnetDenoms } from '@models/Denom';
import { dcaInStrategyViewModal, dcaPlusStrategyViewModal } from 'src/fixtures/strategy';
import YesNoValues from '@models/YesNoValues';
import { PostPurchaseOptions } from '@models/PostPurchaseOptions';
import { useStrategyInfoStore } from 'src/pages/create-strategy/dca-in/customise/useStrategyInfo';
import { TransactionType } from '@components/TransactionType';
import { FormNames } from '@hooks/useFormStore';
import { StrategyTypes } from '@models/StrategyTypes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@helpers/test/testQueryClient';
import { ChildrenProp } from '@helpers/ChildrenProp';
import { DcaInFormDataAll } from '@models/DcaInFormData';
import TriggerTypes from '@models/TriggerTypes';
import { useCreateVaultDca } from '.';
import { useTrackCreateVault } from '../useTrackCreateVault';
import { handleError } from '../handleError';

jest.mock('@hooks/useCalcSigningClient');
jest.mock('@hooks/useWallet');
jest.mock('@hooks/useFiatPrice');
jest.mock('../useTrackCreateVault');
jest.mock('../handleError');

const initialDenom = {
  ...defaultDenom,
  id: TestnetDenoms.Kuji,
};

const mockCreateStrategy = jest.fn();
const mockTrackCreateVault = jest.fn();

const mockState: DcaInFormDataAll = {
  initialDenom: 'mock-initial-denom',
  resultingDenom: 'mock-resulting-denom',
  initialDeposit: 10,
  swapAmount: 10,
  slippageTolerance: 0.5,
  advancedSettings: false,
  reinvestStrategy: '1',
  autoCompoundStakingRewards: true,
  autoStakeValidator: 'validator',
  sendToWallet: YesNoValues.Yes,
  recipientAccount: 'adress1234',
  yieldOption: 'mars',
  postPurchaseOption: PostPurchaseOptions.SendToWallet,
  startDate: new Date('2021-01-01T00:00:00.000Z'),
  purchaseTime: '11:11',
  executionInterval: 'daily',
  executionIntervalIncrement: 1,
  startPrice: 1.5,
  startImmediately: YesNoValues.Yes,
  triggerType: TriggerTypes.Date,
  priceThresholdEnabled: YesNoValues.No,
  priceThresholdValue: 2.5,
};

const mockStateMinimal: DcaInFormDataAll = {
  initialDenom: 'mock-initial-denom',
  resultingDenom: 'mock-resulting-denom',
  initialDeposit: 10,
  swapAmount: 10,
  slippageTolerance: 0.5,
  advancedSettings: false,
  reinvestStrategy: undefined,
  autoCompoundStakingRewards: false,
  autoStakeValidator: undefined,
  sendToWallet: YesNoValues.Yes,
  recipientAccount: undefined,
  yieldOption: undefined,
  postPurchaseOption: PostPurchaseOptions.SendToWallet,
  startDate: undefined,
  purchaseTime: undefined,
  executionInterval: 'daily',
  executionIntervalIncrement: 2,
  startPrice: undefined,
  startImmediately: YesNoValues.Yes,
  triggerType: TriggerTypes.Date,
  priceThresholdEnabled: YesNoValues.No,
  priceThresholdValue: undefined,
};

describe('useCreateVaultDca', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStrategyInfoStore.setState({
      strategyInfo: {
        transactionType: TransactionType.Buy,
        formName: FormNames.DcaPlusIn,
        strategyType: StrategyTypes.DCAPlusIn,
      },
    });

    (useCalcSigningClient as jest.Mock).mockReturnValue({
      createStrategy: mockCreateStrategy,
    });

    (useWallet as jest.Mock).mockReturnValue({
      address: 'mock-address',
    });

    (useFiatPrice as jest.Mock).mockReturnValue({
      price: 1,
    });

    (handleError as jest.Mock).mockReturnValue(jest.fn());

    (useTrackCreateVault as jest.Mock).mockReturnValue(mockTrackCreateVault);
  });

  it('should throw an error if client is not defined', () => {
    (useCalcSigningClient as jest.Mock).mockReturnValueOnce(undefined);

    const { result } = renderHook(() => useCreateVaultDca(initialDenom), {
      wrapper: ({ children }: ChildrenProp) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    expect(
      result.current.mutateAsync({
        state: {} as DcaInFormDataAll,
        reinvestStrategyData: undefined,
      }),
    ).rejects.toThrowError('Invalid client');
  });

  it('should throw an error if state is not defined', () => {
    const { result } = renderHook(() => useCreateVaultDca(initialDenom), {
      wrapper: ({ children }: ChildrenProp) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    expect(
      result.current.mutateAsync({
        state: undefined,
        reinvestStrategyData: dcaPlusStrategyViewModal,
      }),
    ).rejects.toThrowError('No state');
  });

  it('should throw an error if reinvest strategy is set but strategy doesnt exist', () => {
    const { result } = renderHook(() => useCreateVaultDca(initialDenom), {
      wrapper: ({ children }: ChildrenProp) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    expect(
      result.current.mutateAsync({
        state: { ...mockState, reinvestStrategy: '1' },
        reinvestStrategyData: undefined,
      }),
    ).rejects.toThrowError('Invalid reinvest strategy.');
  });

  it('should throw an error if price doesnt exist', () => {
    (useFiatPrice as jest.Mock).mockReturnValue({
      price: undefined,
    });
    const { result } = renderHook(() => useCreateVaultDca(initialDenom), {
      wrapper: ({ children }: ChildrenProp) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    expect(
      result.current.mutateAsync({
        state: mockState,
        reinvestStrategyData: dcaInStrategyViewModal,
      }),
    ).rejects.toThrowError('Invalid price');
  });

  it('should throw an error if addresss doesnt exist', () => {
    (useWallet as jest.Mock).mockReturnValue({});
    const { result } = renderHook(() => useCreateVaultDca(initialDenom), {
      wrapper: ({ children }: ChildrenProp) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    expect(
      result.current.mutateAsync({
        state: mockState,
        reinvestStrategyData: dcaInStrategyViewModal,
      }),
    ).rejects.toThrowError('No sender address');
  });

  it('should successfully create a strategy', async () => {
    const mockSuccess = jest.fn().mockResolvedValue('mock-strategy-id');

    (useCalcSigningClient as jest.Mock).mockReturnValue({
      createStrategy: mockSuccess,
    });

    const { result } = renderHook(() => useCreateVaultDca(initialDenom), {
      wrapper: ({ children }: ChildrenProp) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    const strategyId = await result.current.mutateAsync({
      state: mockState,
      reinvestStrategyData: dcaInStrategyViewModal,
    });

    expect(strategyId).toEqual('mock-strategy-id');
    expect(mockSuccess).toHaveBeenCalledWith('mock-address', 10, '100000', {
      initialDenom: {
        id: 'mock-initial-denom',
        ...defaultDenom,
      },
      resultingDenom: {
        id: 'mock-resulting-denom',
        ...defaultDenom,
      },
      timeInterval: { interval: 'daily', increment: 1 },
      startPrice: 1.5,
      swapAmount: 10,
      priceThreshold: 2.5,
      transactionType: 'buy',
      slippageTolerance: 0.5,
      destinationConfig: {
        autoStakeValidator: 'validator',
        autoCompoundStakingRewards: true,
        recipientAccount: 'adress1234',
        yieldOption: 'mars',
        reinvestStrategyId: '1',
        senderAddress: 'mock-address',
      },
      timeTrigger: {
        startDate: new Date('2021-01-01T00:00:00.000Z'),
        startTime: '11:11',
      },
    });
  });

  it('should successfully create a minimal strategy', async () => {
    const mockSuccess = jest.fn().mockResolvedValue('mock-strategy-id');

    (useCalcSigningClient as jest.Mock).mockReturnValue({
      createStrategy: mockSuccess,
    });

    const { result } = renderHook(() => useCreateVaultDca(initialDenom), {
      wrapper: ({ children }: ChildrenProp) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    const strategyId = await result.current.mutateAsync({
      state: mockStateMinimal,
      reinvestStrategyData: dcaInStrategyViewModal,
    });

    expect(strategyId).toEqual('mock-strategy-id');
    expect(mockSuccess).toHaveBeenCalledWith('mock-address', 10, '100000', {
      initialDenom: {
        id: 'mock-initial-denom',
        ...defaultDenom,
      },
      resultingDenom: {
        id: 'mock-resulting-denom',
        ...defaultDenom,
      },
      timeInterval: { interval: 'daily', increment: 2 },
      startPrice: undefined,
      swapAmount: 10,
      priceThreshold: undefined,
      transactionType: 'buy',
      slippageTolerance: 0.5,
      destinationConfig: {
        autoStakeValidator: undefined,
        autoCompoundStakingRewards: false,
        recipientAccount: undefined,
        yieldOption: undefined,
        reinvestStrategyId: undefined,
        senderAddress: 'mock-address',
      },
      timeTrigger: {
        startDate: undefined,
        startTime: undefined,
      },
    });
  });
});
