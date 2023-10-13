const EdgeCustomSVGs = () => (
  <svg>
    <defs>
      <marker
        id="black-arrow"
        markerWidth="10"
        markerHeight="7"
        refX="10"
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
        refX={3}
        refY={2.5}
        fill="black"
        color="black"
        orient="auto-start-reverse"
      >
        <polygon points="0 0, 5 2.5, 0 5" />
      </marker>
    </defs>
  </svg>
);

export default EdgeCustomSVGs;
