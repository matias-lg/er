import { useContext, useEffect } from "react";
import { Context } from "../../context";

const AUTO_LAYOUT_LOCAL_STORAGE_KEY = "auto-layout";
let didInit = false;
const loadFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    let storedState: null | boolean | string = localStorage.getItem(
      AUTO_LAYOUT_LOCAL_STORAGE_KEY,
    );
    if (storedState === null) return null;
    else return storedState === "true";
  } else return null;
};

const AutoLayoutSwitch = ({ title }: { title: string }) => {
  const { autoLayoutEnabled, setAutoLayoutEnabled } = useContext(Context);

  useEffect(() => {
    if (didInit) return;
    didInit = true;
    // load from localStorage in the client, default to true
    const storedState = loadFromLocalStorage();
    setAutoLayoutEnabled(storedState ?? true);
  }, []);

  useEffect(() => {
    if (autoLayoutEnabled === null) return;
    localStorage.setItem(
      AUTO_LAYOUT_LOCAL_STORAGE_KEY,
      JSON.stringify(autoLayoutEnabled),
    );
  }, [autoLayoutEnabled]);

  const handleCheckboxChange = () => {
    setAutoLayoutEnabled((prev) => !prev);
  };

  return (
    <>
      <span className="cursor-pointer pr-2" onClick={handleCheckboxChange}>
        {title}
      </span>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={autoLayoutEnabled!}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div
            className={`box block h-7 w-12 rounded-full ${
              autoLayoutEnabled ? "bg-secondary" : "bg-[#CBD5E0]"
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white transition ${
              autoLayoutEnabled ? "translate-x-full" : ""
            }`}
          ></div>
        </div>
      </label>
    </>
  );
};

export default AutoLayoutSwitch;
