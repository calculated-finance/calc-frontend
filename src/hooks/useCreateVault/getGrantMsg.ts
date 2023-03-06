import { STAKING_ROUTER_CONTRACT_ADDRESS } from 'src/constants';
import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { MsgGrant } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { Timestamp } from 'cosmjs-types/google/protobuf/timestamp';

export function getGrantMsg(senderAddress: string): { typeUrl: string; value: MsgGrant } {
  // https://github.com/confio/cosmjs-types/blob/cae4762f5856efcb32f49ac26b8fdae799a3727a/src/cosmos/staking/v1beta1/authz.ts
  // https://www.npmjs.com/package/cosmjs-types
  const secondsInOneYear = 31536000;
  return {
    typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
    value: {
      granter: senderAddress,
      grantee: STAKING_ROUTER_CONTRACT_ADDRESS,
      grant: {
        authorization: {
          typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
          value: GenericAuthorization.encode(
            GenericAuthorization.fromPartial({
              msg: '/cosmos.staking.v1beta1.MsgDelegate',
            }),
          ).finish(),
        },
        expiration: Timestamp.fromPartial({
          seconds: new Date().getTime() / 1000 + secondsInOneYear,
          nanos: 0,
        }),
      },
    } as MsgGrant,
  };
}
