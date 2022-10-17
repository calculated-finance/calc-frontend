const totalExecutions = (initialDeposit: number | undefined, swapAmount: number) =>
  Math.ceil((initialDeposit || 0) / swapAmount);

export default totalExecutions;
