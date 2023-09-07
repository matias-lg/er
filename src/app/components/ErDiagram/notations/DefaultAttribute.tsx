import DefaultHandle from "./DefaultHandle";

export const DefaultAttribute = ({
  data,
}: {
  data: { label: string; isKey: boolean; entityIsWeak: boolean };
}) => (
  <>
    <div className="min-w-[60px] rounded-[50%] border-[1px] border-black bg-white p-2 text-center">
      <p
        className={`${data.isKey && "underline underline-offset-4"} ${
          data.entityIsWeak && "decoration-dashed"
        }`}
      >
        {data.label}
      </p>
      <p className={data.isKey ? "underline underline-offset-auto" : ""}></p>
    </div>
    <DefaultHandle />
  </>
);
