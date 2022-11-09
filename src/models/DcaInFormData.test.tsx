import timekeeper from 'timekeeper';
import AutoStakeValues from './AutoStakeValues';
import { allValidationSchema, DcaInFormDataAll } from './DcaInFormData';
import { Denoms } from './Denom';
import { ExecutionIntervals } from './ExecutionIntervals';
import SendToWalletValues from './SendToWalletValues';
import { StartImmediatelyValues } from './StartImmediatelyValues';
import TriggerTypes from './TriggerTypes';
import YesNoValues from './YesNoValues';

const mockData = {
  resultingDenom: Denoms.USK,
  initialDenom: Denoms.Kuji,
  initialDeposit: 10,
  advancedSettings: false,
  startImmediately: StartImmediatelyValues.Yes,
  triggerType: TriggerTypes.Date,
  startDate: null,
  purchaseTime: '',
  startPrice: 1,

  executionInterval: ExecutionIntervals.Daily,
  swapAmount: 1,
  slippageTolerance: 2,
  priceThresholdEnabled: YesNoValues.No,
  priceThresholdValue: null,
  sendToWallet: SendToWalletValues.Yes,
  autoStake: AutoStakeValues.No,
  recipientAccount: '',
  autoStakeValidator: '',
};

function testValidation(data: Partial<DcaInFormDataAll>, expected = '', context = {}) {
  let result = {};
  try {
    result = allValidationSchema.validateSync({ ...mockData, ...data }, { context });
  } catch (e) {
    if (e instanceof Error) {
      expect(e.message).toEqual(expected);
    } else {
      throw e;
    }
    return {} as DcaInFormDataAll;
  }

  expect(expected).toBe('');
  return result as DcaInFormDataAll;
}

const yesterday = new Date('2022-11-01T00:00:00.000+00:00');
const today = new Date('2022-11-02T00:00:00.000+00:00');
const tomorrow = new Date('2022-11-03T00:00:00.000+00:00');

describe('DCA form data', () => {
  beforeAll(() => {
    timekeeper.freeze(new Date('2022-11-02T12:00:00.000+00:00'));
  });

  afterAll(() => {
    timekeeper.reset();
  });
  describe('all fields valid', () => {
    it('should not throw', () => {
      expect(() => allValidationSchema.validateSync(mockData)).not.toThrow();
    });
  });
  describe('resultingDenom', () => {
    it('must be denom', () => {
      testValidation({ resultingDenom: 'invalid' }, 'Resulting Denom is a required field');
    });
    it('is required', () => {
      testValidation({ resultingDenom: '' }, 'Resulting Denom is a required field');
    });
  });
  describe('initialDenom', () => {
    it('must be denom', () => {
      testValidation({ initialDenom: 'invalid' }, 'Initial Denom is a required field');
    });
    it('is required', () => {
      testValidation({ initialDenom: '' }, 'Initial Denom is a required field');
    });
  });
  describe('initialDeposit', () => {
    it('must be number', () => {
      testValidation(
        { initialDeposit: 'invalid' as any },
        'Initial Deposit must be a `number` type, but the final value was: `NaN` (cast from the value `"invalid"`).',
      );
    });
    it('is required', () => {
      testValidation({ initialDeposit: null as any }, 'Initial Deposit is a required field', {
        balances: [{ denom: Denoms.Kuji, amount: 5 }],
      });
    });
    it('must be positive', () => {
      testValidation({ initialDeposit: 0 }, 'Initial Deposit must be a positive number', {
        balances: [{ denom: Denoms.Kuji, amount: 5 }],
      });
    });
    it('must be less than funds', () => {
      testValidation(
        { initialDeposit: 10 },
        'Initial Deposit must be less than or equal to than your current balance',
        {
          balances: [{ denom: Denoms.Kuji, amount: 5 }],
        },
      );
    });
    it('when balance is not listed', () => {
      testValidation(
        { initialDeposit: 10 },
        'Initial Deposit must be less than or equal to than your current balance',
        {
          balances: [{ denom: Denoms.Demo, amount: 5 }],
        },
      );
    });
  });
  describe('triggerType', () => {
    it('is required', () => {
      testValidation({ triggerType: undefined }, 'Trigger Type is a required field');
    });
    describe('when price type is set', () => {
      it('is Date when startImmediately is Yes', () => {
        const result = testValidation({
          triggerType: TriggerTypes.Price,
          startImmediately: StartImmediatelyValues.Yes,
        });
        expect(result.triggerType).toBe(TriggerTypes.Date);
      });
      it('is Price when startImmediately is No', () => {
        const result = testValidation({
          triggerType: TriggerTypes.Price,
          startImmediately: StartImmediatelyValues.No,
        });
        expect(result.triggerType).toBe(TriggerTypes.Price);
      });
    });
  });
  describe('startDate', () => {
    it('is valid', () => {
      testValidation({ startImmediately: StartImmediatelyValues.No, startDate: tomorrow });
    });
    it('is required', () => {
      testValidation(
        { startImmediately: StartImmediatelyValues.No, startDate: null },
        'Start Date is a required field',
      );
    });
    it('must be in the future', () => {
      testValidation(
        { startImmediately: StartImmediatelyValues.No, startDate: today },
        'Start Date must be in the future',
      );
    });
    describe('when advance settings enabled', () => {
      describe('time is earlier today', () => {
        it('is valid', () => {
          testValidation({
            startDate: today,
            advancedSettings: true,
            startImmediately: StartImmediatelyValues.No,
            purchaseTime: '23:00',
          });
        });
        describe('time is before yesterday', () => {
          it('must be no later than earlier today', () => {
            testValidation(
              {
                startDate: yesterday,
                advancedSettings: true,
                startImmediately: StartImmediatelyValues.No,
                purchaseTime: '13:00',
              },
              'Date and time must be in the future',
            );
          });
        });
      });
    });
    describe('when triggerType is Price', () => {
      it('is null', () => {
        const result = testValidation({
          startImmediately: StartImmediatelyValues.No,
          triggerType: TriggerTypes.Price,
          startDate: new Date(),
        });
        expect(result.startDate).toBeNull();
      });
    });
    describe('when start immediately is Yes', () => {
      it('is null', () => {
        const result = testValidation({
          startImmediately: StartImmediatelyValues.Yes,
          triggerType: TriggerTypes.Date,
          startDate: new Date(),
        });
        expect(result.startDate).toBeNull();
      });
    });
  });

  describe('startPrice', () => {
    it('is valid', () => {
      testValidation({
        startImmediately: StartImmediatelyValues.No,
        triggerType: TriggerTypes.Price,
        startPrice: 1,
      });
    });

    it('must be a number', () => {
      testValidation(
        {
          startImmediately: StartImmediatelyValues.No,
          triggerType: TriggerTypes.Price,
          startPrice: 'a' as any,
        },
        'Start Price must be a `number` type, but the final value was: `NaN` (cast from the value `"a"`).',
      );
    });
    it('must be positive', () => {
      testValidation(
        {
          startImmediately: StartImmediatelyValues.No,
          triggerType: TriggerTypes.Price,
          startPrice: 0,
        },
        'Start Price must be a positive number',
      );
    });
  });
});
