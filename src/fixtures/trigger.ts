import { TriggerConfiguration } from '@models/index';

// new date may 22nd 2022 at 5pm
const targetTime = new Date(2022, 4, 22, 17, 0, 0, 0).getTime();

export const mockTimeTrigger: TriggerConfiguration = {
  time: {
    target_time: (targetTime * 1000000).toString(),
  },
};

export const mockPriceTrigger: TriggerConfiguration = {
  price: {
    order_idx: '0',
    target_price: '0.5', // 0.5 DEMO
  },
};
