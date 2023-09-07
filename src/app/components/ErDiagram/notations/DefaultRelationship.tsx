import { DefaultHandle } from "./DefaultHandle";

type DefaultRelationshipProps = {
  data: { label: string; hasDependant: boolean };
};

export const DefaultRelationship = ({ data }: DefaultRelationshipProps) => {
  {
    /* If has dependencies its a double bordered diamond */
  }
  if (data.hasDependant)
    return (
      <>
        <svg
          version="1.1"
          width="157px"
          height="157px"
          viewBox="-0.5 -0.5 157 157"
        >
          <defs />
          <g>
            <rect
              x="23"
              y="23"
              width="110"
              height="110"
              fill="rgb(255, 255, 255)"
              stroke="rgb(0, 0, 0)"
              strokeWidth={1}
              transform="rotate(-45,78,78)"
              pointerEvents="all"
            />
            <rect
              x="30.5"
              y="30.5"
              width="95"
              strokeWidth={1}
              height="95"
              fill="rgb(255, 255, 255)"
              stroke="rgb(0, 0, 0)"
              transform="rotate(-45,78,78)"
              pointerEvents="all"
            />
            <rect
              x="48"
              y="63"
              width="60"
              height="30"
              fill="none"
              stroke="none"
              pointerEvents="all"
            />
            <g transform="translate(-0.5 -0.5)">
              <switch>
                <foreignObject
                  pointerEvents="none"
                  width="100%"
                  height="100%"
                  requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                  style={{ overflow: "visible", textAlign: "left" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "unsafe center",
                      justifyContent: "unsafe center",
                      width: "58px",
                      height: "1px",
                      paddingTop: "78px",
                      marginLeft: "49px",
                    }}
                  >
                    <div
                      style={{
                        boxSizing: "border-box",
                        fontSize: "0px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          color: "rgb(0, 0, 0)",
                          lineHeight: "1.2",
                          fontSize: "15px",
                          whiteSpace: "normal",
                          overflowWrap: "normal",
                        }}
                      >
                        {data.label}
                      </div>
                    </div>
                  </div>
                </foreignObject>
                <text
                  x="78"
                  y="82"
                  fill="rgb(0, 0, 0)"
                  fontSize="12px"
                  textAnchor="middle"
                >
                  {data.label}
                </text>
              </switch>
            </g>
          </g>
        </svg>
        <DefaultHandle />
      </>
    );
  else {
    // single bordered diamond
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="157px"
          height="157px"
          viewBox="-0.5 -0.5 157 157"
        >
          <defs />
          <g>
            <rect
              x="23"
              y="23"
              width="110"
              height="110"
              fill="rgb(255, 255, 255)"
              stroke="rgb(0, 0, 0)"
              transform="rotate(-45,78,78)"
              pointerEvents="all"
              strokeWidth={1}
            />
            <rect
              x="48"
              y="63"
              width="60"
              height="30"
              fill="none"
              stroke="none"
              pointerEvents="all"
              strokeWidth={1}
            />
            <g transform="translate(-0.5 -0.5)">
              <switch>
                <foreignObject
                  pointerEvents="none"
                  width="100%"
                  height="100%"
                  requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
                  style={{
                    overflow: "visible",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "unsafe center",
                      justifyContent: "unsafe center",
                      width: "58px",
                      height: "1px",
                      paddingTop: "78px",
                      marginLeft: "49px",
                    }}
                  >
                    <div
                      style={{
                        boxSizing: "border-box",
                        fontSize: "0px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          color: "rgb(0, 0, 0)",
                          lineHeight: "1.2",
                          fontSize: "15px",
                          whiteSpace: "normal",
                          overflowWrap: "normal",
                        }}
                      >
                        {data.label}
                      </div>
                    </div>
                  </div>
                </foreignObject>
                <text
                  x="78"
                  y="82"
                  fill="rgb(0, 0, 0)"
                  fontSize="12px"
                  textAnchor="middle"
                >
                  {data.label}
                </text>
              </switch>
            </g>
          </g>
        </svg>
        <DefaultHandle />
      </>
    );
  }
};
