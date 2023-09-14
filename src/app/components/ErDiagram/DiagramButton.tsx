type DiagramButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

export const DiagramButton = ({
  onClick,
  children,
  className = "",
}: DiagramButtonProps) => {
  return (
    <button
      className={
        "ml-4 flex w-full items-center rounded-md bg-primary p-3 text-sm font-semibold text-gray-100 hover:text-gray-400" +
        " " +
        className
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};
