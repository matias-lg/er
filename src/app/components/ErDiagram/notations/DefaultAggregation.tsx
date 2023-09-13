import { memo } from "react";
import DefaultHandle from "./DefaultHandle";

const DefaultAggregation = ({
  data,
}: {
  data: { label: string; height: number; width: number };
}) => {
  // HACK: we set the width and height of the node with props because the auto layout also
  // gives us the dimensions of the subgraph, which corresponds to the dimensions of the agg. container
  // tailwind doesn't seem to update the width and height of the node when we change the props, so we use
  // inline styles.
  return (
    <>
      <div
        style={{
          width: `${Math.trunc(data.width) || "500"}px`,
          height: `${Math.trunc(data.height) || "500"}px`,
        }}
        className={`z-10 flex border-2 border-dashed border-sky-700 bg-sky-200/[.26] p-2`}
      >
        <div>{data.label}</div>
      </div>
      <DefaultHandle />
    </>
  );
};

export default memo(DefaultAggregation);
