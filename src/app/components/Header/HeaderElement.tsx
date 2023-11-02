export const HeaderElement = ({
  children,
  className = "",
}: {
  children: JSX.Element;
  className: string;
}) => (
  <div
    className={
      "mx-0 flex items-center border-border px-4 py-2   text-center tracking-wide text-slate-200 " +
      className
    }
  >
    {children}
  </div>
);
