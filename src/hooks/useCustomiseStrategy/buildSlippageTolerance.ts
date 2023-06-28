import { getSlippageWithoutTrailingZeros } from '../useCreateVault/buildCreateVaultParams';

export function buildSlippageTolerance(slippageTolerance: number, initialSlippageTolerance: number) {
  const isSlippageToleranceDirty = slippageTolerance !== initialSlippageTolerance;
  if (isSlippageToleranceDirty) {
    return {
      slippage_tolerance: getSlippageWithoutTrailingZeros(slippageTolerance),
    };
  }
  return {};
}
