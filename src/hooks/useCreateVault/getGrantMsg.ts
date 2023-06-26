import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { MsgGrant } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { Timestamp } from 'cosmjs-types/google/protobuf/timestamp';

export function getGrantMsg(
  granter: string,
  grantee: string,
  typeUrl: string = '/cosmos.authz.v1beta1.GenericAuthorization',
  value: Uint8Array = GenericAuthorization.encode(
    GenericAuthorization.fromPartial({ msg: '/cosmos.staking.v1beta1.MsgDelegate' }),
  ).finish(),
  seconds: number = new Date().getTime() / 1000 + 31536000, // 31536000 seconds in a year
): { typeUrl: string; value: MsgGrant } {
  return {
    typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
    value: {
      granter,
      grantee,
      grant: {
        authorization: {
          typeUrl,
          value,
        },
        expiration: Timestamp.fromPartial({ seconds, nanos: 0 }),
      },
    } as MsgGrant,
  };
}
