import { getSlippageTolerance } from '../useCreateVault/buildCreateVaultParams';

export function buildSlippageTolerance(
  slippageTolerance: number | null | undefined,
  initialSlippageTolerance: number | null | undefined,
) {
  const isSlippageToleranceDirty = slippageTolerance !== initialSlippageTolerance;
  if (isSlippageToleranceDirty) {
    return {
      slippage_tolerance: getSlippageTolerance(true, slippageTolerance),
    };
  }
  return {};
}
