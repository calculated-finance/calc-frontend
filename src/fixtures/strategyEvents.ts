export const mockStrategyEvents = {
  events: [
    {
      id: 5435,
      resource_id: '111',
      timestamp: '1678756011252210815',
      block_height: 10350442,
      data: {
        dca_vault_funds_deposited: {
          amount: {
            denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
            amount: '10000000',
          },
        },
      },
    },
    {
      id: 5436,
      resource_id: '111',
      timestamp: '1678756011252210815',
      block_height: 10350442,
      data: {
        dca_vault_execution_triggered: {
          base_denom: 'ukuji',
          quote_denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
          asset_price: '0.957',
        },
      },
    },
    {
      id: 5437,
      resource_id: '111',
      timestamp: '1678756011252210815',
      block_height: 10350442,
      data: {
        dca_vault_execution_completed: {
          sent: {
            denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
            amount: '333333',
          },
          received: {
            denom: 'ukuji',
            amount: '347788',
          },
          fee: {
            denom: 'ukuji',
            amount: '1738',
          },
        },
      },
    },
    {
      id: 5526,
      resource_id: '111',
      timestamp: '1678842475485420027',
      block_height: 10395346,
      data: {
        dca_vault_execution_triggered: {
          base_denom: 'ukuji',
          quote_denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
          asset_price: '0.958',
        },
      },
    },
    {
      id: 5527,
      resource_id: '111',
      timestamp: '1678842475485420027',
      block_height: 10395346,
      data: {
        dca_vault_execution_completed: {
          sent: {
            denom: 'factory/kujira1ltvwg69sw3c5z99c6rr08hal7v0kdzfxz07yj5/demo',
            amount: '333333',
          },
          received: {
            denom: 'ukuji',
            amount: '347425',
          },
          fee: {
            denom: 'ukuji',
            amount: '1737',
          },
        },
      },
    },
  ],
};
