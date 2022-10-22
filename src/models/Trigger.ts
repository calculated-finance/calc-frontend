type TimeTrigger = {
  f_i_n_limit_order?: never;
  time: {
    target_time: string;
  };
};

type PriceTrigger = {
  time?: never;
  f_i_n_limit_order: {
    target_price: string;
  };
};

export type Trigger = {
  configuration: TimeTrigger | PriceTrigger;
};
