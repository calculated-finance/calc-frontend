import { createStandaloneToast } from '@chakra-ui/react';
import theme from 'src/theme';

const { ToastContainer: ToastContainerInternal, toast: toastInternal } = createStandaloneToast({ theme });

export const ToastContainer = ToastContainerInternal;
export const toast = toastInternal;
