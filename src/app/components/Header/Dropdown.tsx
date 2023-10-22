export const Dropdown = ({
  title,
  items,
}: {
  title: JSX.Element | string;
  items: [string, () => void][];
}) => {
  return (
    <ul className="flex">
      <li className="dropdown group relative  border-border px-1  py-2  tracking-wide text-slate-200">
        {title}
        <div className="dropdown-menu absolute z-[999] hidden h-auto pt-[0.87rem] text-sm group-hover:block">
          <ul className="top-0 w-36  bg-primary px-0 py-2 shadow">
            {items.map(([title, onClick], idx) => (
              <li className="py-1" key={idx}>
                <a
                  className="block cursor-pointer px-2 py-1 hover:bg-slate-700 "
                  onClick={onClick}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </ul>
  );
};
