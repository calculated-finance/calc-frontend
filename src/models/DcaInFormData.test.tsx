import AutoStakeValues from './AutoStakeValues';
import { allValidationSchema } from './DcaInFormData';
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
  startPrice: null,

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

function testValidation(data, expected) {
  try {
    allValidationSchema.validateSync({ ...mockData, ...data });
  } catch (e) {
    if (e instanceof Error) {
      expect(e.message).toEqual(expected);
    }
  }
}

describe('DCA form data', () => {
  describe('all fields valid', () => {
    it('should not throw', () => {
      expect(() => allValidationSchema.validateSync(mockData)).not.toThrow();
    });
  });
  describe('resultingDenom', () => {
    it('must be denom', () => {
      testValidation({ resultingDenom: 'invalid' }, 'Resulting Denom is required.');
    });
    it('is required', () => {
      testValidation({ resultingDenom: '' }, 'Resulting Denom is required.');
    });
  });
  describe('initialDenom', () => {
    it('must be denom', () => {
      testValidation({ initialDenom: 'invalid' }, 'Initial Denom is required.');
    });
    it('is required', () => {
      testValidation({ initialDenom: '' }, 'Initial Denom is required.');
    });
  });
  describe('initialDeposit', () => {
    it('must be number', () => {
      testValidation(
        { initialDeposit: 'invalid' },
        'Initial Deposit must be a `number` type, but the final value was: `NaN` (cast from the value `"invalid"`).',
      );
    });
    it('is required', () => {
      testValidation({ initialDeposit: null }, 'Initial Deposit is a required field');
    });
  });
});
