import { renderHook } from '@testing-library/react-hooks';
import { useCalcSigningClient } from '@hooks/useCalcSigningClient';
import { useWallet } from '@hooks/useWallet';
import useFiatPrice from '@hooks/useFiatPrice';
import { defaultDenom } from '@utils/defaultDenom';
import { TestnetDenoms } from '@models/Denom';
import { DcaPlusState } from '@models/dcaPlusFormData';
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
import { useCreateVaultDcaPlus } from '.';
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

const mockState: DcaPlusState = {
  initialDenom: 'mock-initial-denom',
  resultingDenom: 'mock-resulting-denom',
  initialDeposit: 10,
  strategyDuration: 10,
  slippageTolerance: 0.5,
  advancedSettings: false,
  reinvestStrategy: '1',
  autoCompoundStakingRewards: true,
  autoStakeValidator: 'autostake',
  sendToWallet: YesNoValues.Yes,
  recipientAccount: '123address',
  yieldOption: 'mars',
  postPurchaseOption: PostPurchaseOptions.SendToWallet,
};

const mockStateMinimal: DcaPlusState = {
  initialDenom: 'mock-initial-denom',
  resultingDenom: 'mock-resulting-denom',
  initialDeposit: 10,
  strategyDuration: 10,
  slippageTolerance: 0.5,
  advancedSettings: false,
  reinvestStrategy: undefined,
  autoCompoundStakingRewards: false,
  autoStakeValidator: undefined,
  sendToWallet: YesNoValues.Yes,
  recipientAccount: undefined,
  yieldOption: undefined,
  postPurchaseOption: PostPurchaseOptions.SendToWallet,
};

describe('useCreateVaultDcaPlus', () => {
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

    const { result } = renderHook(() => useCreateVaultDcaPlus(initialDenom), {
      wrapper: ({ children }: ChildrenProp) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    expect(
      result.current.mutateAsync({
        state: {} as DcaPlusState,
        reinvestStrategyData: undefined,
      }),
    ).rejects.toThrowError('Invalid client');
  });

  it('should throw an error if state is not defined', () => {
    const { result } = renderHook(() => useCreateVaultDcaPlus(initialDenom), {
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
    const { result } = renderHook(() => useCreateVaultDcaPlus(initialDenom), {
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
    const { result } = renderHook(() => useCreateVaultDcaPlus(initialDenom), {
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
    const { result } = renderHook(() => useCreateVaultDcaPlus(initialDenom), {
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

    const { result } = renderHook(() => useCreateVaultDcaPlus(initialDenom), {
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
      timeTrigger: undefined,
      startPrice: undefined,
      swapAmount: 1,
      priceThreshold: undefined,
      transactionType: 'buy',
      slippageTolerance: 0.5,
      isDcaPlus: true,
      destinationConfig: {
        autoStakeValidator: 'autostake',
        autoCompoundStakingRewards: true,
        recipientAccount: '123address',
        yieldOption: 'mars',
        reinvestStrategyId: '1',
        senderAddress: 'mock-address',
      },
    });
  });

  it('should successfully create a minimal strategy', async () => {
    const mockSuccess = jest.fn().mockResolvedValue('mock-strategy-id');

    (useCalcSigningClient as jest.Mock).mockReturnValue({
      createStrategy: mockSuccess,
    });

    const { result } = renderHook(() => useCreateVaultDcaPlus(initialDenom), {
      wrapper: ({ children }: ChildrenProp) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    const strategyId = await result.current.mutateAsync({
      state: mockStateMinimal,
      reinvestStrategyData: undefined,
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
      timeTrigger: undefined,
      startPrice: undefined,
      swapAmount: 1,
      priceThreshold: undefined,
      transactionType: 'buy',
      slippageTolerance: 0.5,
      isDcaPlus: true,
      destinationConfig: {
        autoStakeValidator: undefined,
        autoCompoundStakingRewards: false,
        recipientAccount: undefined,
        yieldOption: undefined,
        reinvestStrategyId: undefined,
        senderAddress: 'mock-address',
      },
    });
  });
});
