import { useToast } from "../_components/ui/use-toast";

export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const useCopyText = () => {
  const { toast } = useToast();

  return (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      toast({
        description: "Copied to clipboard",
      });
    } catch (e) {
      toast({
        description: "Failed to copy to clipboard",
      });
    }
  };
};
