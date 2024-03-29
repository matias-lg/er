import { memo } from "react";
import NodeHandles from "./NodeHandles";

const DefaultAggregation = ({
  data: { label, height = 500, width = 500 },
}: {
  data: { label: string; height?: number; width?: number };
}) => {
  // HACK: we set the width and height of the node with props because the auto layout also
  // gives us the dimensions of the subgraph, which corresponds to the dimensions of the agg. container
  // tailwind doesn't seem to update the width and height of the node when we change the props, so we use
  // inline styles.
  return (
    <>
      <div
        style={{
          width: `${Math.trunc(width)}px`,
          height: `${Math.trunc(height)}px`,
        }}
        className={`z-10 flex border-2 border-dashed border-sky-700 bg-sky-200/[.26] p-2`}
      >
        <div>{label}</div>
      </div>
      <NodeHandles
        TopHandleStyle={[
          { top: "-1%" },
          { top: "-1%", left: "2%" },
          { top: "-1%", left: "25%" },
          { top: "-1%", left: "75%" },
          { top: "-1%", left: "98%" },
        ]}
        BottomHandleStyle={[
          { bottom: "-1%" },
          { bottom: "-1%", left: "2%" },
          { bottom: "-1%", left: "25%" },
          { bottom: "-1%", left: "75%" },
          { bottom: "-1%", left: "98%" },
        ]}
        LeftHandleStyle={[
          { left: "-1%" },
          { left: "-1%", top: "2%" },
          { left: "-1%", top: "25%" },
          { left: "-1%", top: "75%" },
          { left: "-1%", top: "98%" },
        ]}
        RightHandleStyle={[
          { right: "-1%" },
          { right: "-1%", top: "2%" },
          { right: "-1%", top: "25%" },
          { right: "-1%", top: "75%" },
          { right: "-1%", top: "98%" },
        ]}
        use5PerSide={true}
      />
    </>
  );
};

export default memo(DefaultAggregation);
