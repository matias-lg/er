const CustomSVGs = () => (
  <svg>
    <defs>
      <marker
        id="black-arrow"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        fill="black"
        color="black"
        orient="auto-start-reverse"
      >
        <polygon points="0 0, 10 3.5, 0 7" />
      </marker>

      {/* Custom SVG for black arrow marker */}
      <marker
        id="1to1-arrow"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        fill="black"
        color="black"
        orient="auto-start-reverse"
      >
        <polygon points="0 0, 12 3.5, 0 7" />
      </marker>
    </defs>
  </svg>
);

export default CustomSVGs;
