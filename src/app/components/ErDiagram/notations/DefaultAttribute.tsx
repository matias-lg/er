import { memo } from "react";
import NodeHandles from "./NodeHandles";

const DefaultAttribute = ({
  data,
}: {
  data: { label: string; isKey: boolean; entityIsWeak: boolean };
}) => (
  <>
    <div className="min-w-[60px] rounded-[50%] border-2 border-yellow-300 bg-yellow-100 p-2 text-center">
      <p
        className={`${data.isKey && "underline underline-offset-4"} ${
          data.entityIsWeak && "decoration-dashed"
        }`}
      >
        {data.label}
      </p>
      <p className={data.isKey ? "underline underline-offset-auto" : ""}></p>
    </div>
    <NodeHandles
      TopHandleStyle={[{ top: "1%" }]}
      BottomHandleStyle={[{ bottom: "1%" }]}
      RightHandleStyle={[{ right: "1%" }]}
      LeftHandleStyle={[{ left: "1%" }]}
    />
  </>
);

export default memo(DefaultAttribute);
