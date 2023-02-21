import { useSnackbar, VariantType } from "notistack";

// added a name to the function to make it easier to debug and import
export default function useToast(): {
  showToast: (message: string, variant: VariantType) => void;
} {
  const { enqueueSnackbar } = useSnackbar();

  const showToast = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, { variant });
  };

  return { showToast };
}
