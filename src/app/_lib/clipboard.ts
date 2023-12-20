import { useToast } from "../_components/ui/use-toast";

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
