import { renderHook, act } from '@testing-library/react-hooks';
import { useRouter } from 'next/router';
import { useChainId, useChainStore } from '.';
import { ChainId } from './Chains';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@hooks/useFormStore', () => ({
  useFormStore: { setState: jest.fn() },
}));

jest.mock('@hooks/useCosmWasmClient', () => ({
  useCosmWasmClient: { setState: jest.fn() },
}));

describe('useChain hook', () => {
  it('should show loading when router is not ready', () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: false,
      query: { chain: 'kaiyo-1' },
      replace: jest.fn(),
      pathname: '/',
    });

    const { result } = renderHook(() => useChainId());

    expect(result.current.isLoading).toBe(true);
  });

  it('should use valid chain from router query', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: { chain: 'osmosis-1' },
      replace: jest.fn(),
      pathname: '/',
    });

    const { result } = renderHook(() => useChainId());

    // await();

    expect(result.current.chainId).toBe('osmosis-1');
    expect(result.current.isLoading).toBe(false);
  });

  it('should use stored chain if invalid chain is passed', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: { chain: 'invalid' },
      replace: jest.fn(),
      pathname: '/',
    });

    const { result } = renderHook(() => useChainId());

    // await();

    expect(result.current.chainId).toBe('kaiyo-1');
    expect(result.current.isLoading).toBe(false);
  });

  it('should use valid part of invalid chain from router query', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: { chain: `${'osmosis-1'}invalid` },
      replace: jest.fn(),
      pathname: '/',
    });

    const { result } = renderHook(() => useChainId());

    expect(result.current.chainId).toBe('osmosis-1');
    expect(result.current.isLoading).toBe(false);

    // except replace to have been called
    expect(useRouter().replace).toHaveBeenCalledWith({
      pathname: '/',
      query: {
        chain: 'Osmosis',
      },
    });
  });

  it('should use stored chain when router query has no chain', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: {},
      replace: jest.fn(),
      pathname: '/',
    });

    useChainStore.setState({ chainId: 'osmosis-1' });

    const { result } = renderHook(() => useChainId());

    expect(result.current.chainId).toBe('osmosis-1');
    expect(result.current.isLoading).toBe(false);
  });

  it('should update stored chain if its different to query chain', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: { chain: 'osmosis-1' },
      replace: jest.fn(),
      pathname: '/',
    });

    useChainStore.setState({ chainId: 'kaiyo-1' });

    const { result } = renderHook(() => useChainId());

    expect(result.current.chainId).toBe('osmosis-1');
    expect(result.current.isLoading).toBe(false);
    expect(useChainStore.getState().chainId).toBe('osmosis-1');
  });

  it('should do all the updates if setChain is called', () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: { chain: 'osmosis-1' },
      replace: jest.fn(),
      pathname: '/',
    });

    const { result, waitFor } = renderHook(() => useChainId());

    act(() => {
      result.current.setChain('kaiyo-1');
    });

    expect(useRouter().replace).toHaveBeenCalledWith({
      pathname: '/',
      query: {
        chain: 'Kujira',
      },
    });

    waitFor(() => expect(useChainStore.getState().chainId).toBe('kaiyo-1'));
  });
});
