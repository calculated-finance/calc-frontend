export default 'hi';
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { useWallet } from '@wizard-ui/react';
// import { CONTRACT_ADDRESS } from 'src/constants';

// import { useMutation } from '@tanstack/react-query';
// import { ExecuteResult } from '@cosmjs/cosmwasm-stargate';
// import getDenomInfo from '@utils/getDenomInfo';

// const useTopUpStrategy = () => {
//   const { address: senderAddress, client } = useWallet();

//   // return useMutation<ExecuteResult, Error, any>(([{ topUpAmount }, quoteDenom, id]) => {
//     return useMutation<ExecuteResult, Error, any>(([{ topUpAmount }, quoteDenom, id]) => {
//     const { deconversion } = getDenomInfo(quoteDenom);
//     const msg = {
//       topup: {},
//     };

//     const funds = [{ denom: quoteDenom, amount: deconversion(topUpAmount).toString() }];

//     // const result = client!.execute(senderAddress, CONTRACT_ADDRESS, msg, 'auto', undefined, funds);
//     return Promise.resolve();
//   });
// };
// export default useTopUpStrategy;
