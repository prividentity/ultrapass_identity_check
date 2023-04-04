import { useSnackbar, VariantType } from "notistack";

// added a name to the function to make it easier to debug and import
export default function useToast(): {
  showToast: (message: string, variant: VariantType, duration?: number) => void;
} {
  const { enqueueSnackbar } = useSnackbar();

  const showToast = (
    message: string,
    variant: VariantType,
    duration = 5000
  ) => {
    enqueueSnackbar(message, { variant, autoHideDuration: duration });
  };

  return { showToast };
}
