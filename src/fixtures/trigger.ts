import { TriggerConfiguration } from 'src/interfaces/generated/response/get_vaults_by_address';

// new date may 22nd 2022 at 5pm
const targetTime = new Date(2022, 4, 22, 17, 0, 0, 0).getTime();

export const mockTimeTrigger: TriggerConfiguration = {
  time: {
    target_time: (targetTime * 1000000).toString(),
  },
};

export const mockPriceTrigger: TriggerConfiguration = {
  fin_limit_order: {
    target_price: '500000', // 0.5 DEMO
  },
};
