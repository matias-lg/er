import { memo } from "react";
import { Fragment } from "react";
import { Handle, Position } from "reactflow";

const handleTypes = ["source", "target"] as const;
const IsAHandles = () =>
  // prettier-ignore
  <>
    {handleTypes.map((type) => (
    <Fragment key={type}>
        <Handle type={type} style={{ opacity: 0,}} position={Position.Top} id="t"/>
        <Handle type={type} style={{ opacity: 0, position: "absolute", right: "25%"}}  position={Position.Right} id="r" />
        <Handle type={type} style={{ opacity: 0, position: "absolute", left: "25%"}} position={Position.Left} id="l" />
        <Handle type={type} style={{ opacity: 0, position: "absolute", top: "106%"}} position={Position.Bottom} id="b"/>
    </Fragment>
    ))}
  </>;

const DefaultIsA = () => {
  return (
    <>
      <svg className="block h-16 w-24 overflow-visible">
        <path
          d="M8,0 L88,0 L48,70 z"
          fill="#bbf7d0"
          stroke-width="2"
          stroke="#15803d"
        ></path>
      </svg>

      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        <div className="mb-2">IsA</div>
      </div>

      <IsAHandles />
    </>
  );
};

export default memo(DefaultIsA);
