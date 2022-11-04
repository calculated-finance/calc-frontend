import { Trigger } from 'src/interfaces/generated/response/get_vault';

// new date may 22nd 2022 at 5pm
const targetTime = new Date(2022, 4, 22, 17, 0, 0, 0).getTime();

export const mockTimeTrigger: Trigger = {
  configuration: {
    time: {
      target_time: (targetTime * 1000000).toString(),
    },
  },
  vault_id: '1',
};

export const mockPriceTrigger: Trigger = {
  configuration: {
    f_i_n_limit_order: {
      target_price: '500000', // 0.5 DEMO
    },
  },
  vault_id: '1',
};
