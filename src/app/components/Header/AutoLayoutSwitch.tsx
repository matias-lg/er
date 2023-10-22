import { useContext, useEffect, useState } from "react";
import { Context } from "../../context";

const AUTO_LAYOUT_LOCAL_STORAGE_KEY = "auto-layout";

const loadFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    let storedState: null | boolean | string = localStorage.getItem(
      AUTO_LAYOUT_LOCAL_STORAGE_KEY,
    );
    if (storedState === null) return null;
    else return storedState === "true";
  } else return null;
};

const AutoLayoutSwitch = () => {
  const { setAutoLayoutEnabled } = useContext(Context);

  const [isChecked, setIsChecked] = useState<boolean | null>(null);

  useEffect(() => {
    // load from localStorage in the client, default to true
    const storedState = loadFromLocalStorage();
    if (storedState !== null) {
      setIsChecked(storedState);
    } else {
      setIsChecked(true);
    }
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked((isChecked) => !isChecked);
  };

  useEffect(() => {
    console.log("isCheked", isChecked);
    setAutoLayoutEnabled(isChecked!);
    localStorage.setItem(
      AUTO_LAYOUT_LOCAL_STORAGE_KEY,
      JSON.stringify(isChecked),
    );
  }, [isChecked, setAutoLayoutEnabled]);

  return (
    <>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked!}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div
            className={`box block h-7 w-12 rounded-full ${
              isChecked ? "bg-secondary" : "bg-[#CBD5E0]"
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white transition ${
              isChecked ? "translate-x-full" : ""
            }`}
          ></div>
        </div>
      </label>
    </>
  );
};

export default AutoLayoutSwitch;
