import { renderHook, act } from '@testing-library/react-hooks';
import { useRouter } from 'next/router';
import { useChain, useChainStore } from '.';
import { Chains } from './Chains';

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
      query: { chain: Chains.Kujira },
      replace: jest.fn(),
      pathname: '/',
    });

    const { result } = renderHook(() => useChain());

    expect(result.current.isLoading).toBe(true);
  });

  it('should use valid chain from router query', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: { chain: Chains.Osmosis },
      replace: jest.fn(),
      pathname: '/',
    });

    const { result } = renderHook(() => useChain());

    // await();

    expect(result.current.chain).toBe(Chains.Osmosis);
    expect(result.current.isLoading).toBe(false);
  });

  it('should use stored chain if invalid chain is passed', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: { chain: 'invalid' },
      replace: jest.fn(),
      pathname: '/',
    });

    const { result } = renderHook(() => useChain());

    // await();

    expect(result.current.chain).toBe(Chains.Kujira);
    expect(result.current.isLoading).toBe(false);
  });

  it('should use valid part of invalid chain from router query', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: { chain: `${Chains.Osmosis}invalid` },
      replace: jest.fn(),
      pathname: '/',
    });

    const { result } = renderHook(() => useChain());

    expect(result.current.chain).toBe(Chains.Osmosis);
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

    useChainStore.setState({ chain: Chains.Osmosis });

    const { result } = renderHook(() => useChain());

    expect(result.current.chain).toBe(Chains.Osmosis);
    expect(result.current.isLoading).toBe(false);
  });

  it('should update stored chain if its different to query chain', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: { chain: Chains.Osmosis },
      replace: jest.fn(),
      pathname: '/',
    });

    useChainStore.setState({ chain: Chains.Kujira });

    const { result } = renderHook(() => useChain());

    expect(result.current.chain).toBe(Chains.Osmosis);
    expect(result.current.isLoading).toBe(false);
    expect(useChainStore.getState().chain).toBe(Chains.Osmosis);
  });

  it('should do all the updates if setChain is called', () => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: { chain: Chains.Osmosis },
      replace: jest.fn(),
      pathname: '/',
    });

    const { result, waitFor } = renderHook(() => useChain());

    act(() => {
      result.current.setChain(Chains.Kujira);
    });

    expect(useRouter().replace).toHaveBeenCalledWith({
      pathname: '/',
      query: {
        chain: 'Kujira',
      },
    });

    waitFor(() => expect(useChainStore.getState().chain).toBe(Chains.Kujira));
  });
});
