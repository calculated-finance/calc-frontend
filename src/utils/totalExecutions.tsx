const totalExecutions = (initialDeposit: number, swapAmount: number) => Math.ceil(initialDeposit / swapAmount);

export default totalExecutions;
