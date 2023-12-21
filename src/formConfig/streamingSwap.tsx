import { StepConfig } from '@formConfig/StepConfig';
import { contentData } from 'src/constants';

const streamingSwapSteps: StepConfig[] = [
  {
    href: '/create-strategy/streaming-swap/assets',
    title: contentData.streamingSwap.assets.title,
  },
  {
    href: '/create-strategy/streaming-swap/success',
    title: 'Swap Started Successfully',
    noBackButton: true,
    noJump: true,
    successPage: true,
  },
];

export default streamingSwapSteps;
