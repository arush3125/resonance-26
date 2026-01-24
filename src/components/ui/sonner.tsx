import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

import { sonnerToastClassNames } from "./sonner.constants";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: sonnerToastClassNames,
      }}
      {...props}
    />
  );
};

export { Toaster };

// Separate export for utility to satisfy react-refresh rule
export { toast };
