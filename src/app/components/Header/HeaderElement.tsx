export const HeaderElement = ({
  children,
  className = "",
}: {
  children: JSX.Element;
  className: string;
}) => (
  <div
    className={
      "mx-0 items-center border-border px-4 py-2   text-center tracking-wide text-slate-200 " +
      className
    }
  >
    <div className="flex items-center">{children}</div>
  </div>
);
