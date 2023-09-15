import { Tooltip } from "@chakra-ui/react";

type DiagramButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  labelPlacement?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export const DiagramButton = ({
  onClick,
  children,
  label,
  labelPlacement = "top",
  className = "",
}: DiagramButtonProps) => {
  return (
    <Tooltip label={label} aria-label={label} placement={labelPlacement}>
      <button
        className={
          "flex w-full items-center rounded-md bg-primary p-3 text-sm font-semibold text-gray-100 hover:text-gray-400" +
          " " +
          className
        }
        onClick={onClick}
      >
        {children}
      </button>
    </Tooltip>
  );
};
