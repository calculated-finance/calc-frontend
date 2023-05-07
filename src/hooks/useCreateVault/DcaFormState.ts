import { DcaInFormDataAll } from '@models/DcaInFormData';
import { DcaPlusState } from '@models/dcaPlusFormData';
import { WeightedScaleState } from '@models/weightedScaleFormData';

export type DcaFormState = DcaInFormDataAll | DcaPlusState | WeightedScaleState;
