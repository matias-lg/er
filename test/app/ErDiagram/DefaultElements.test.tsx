import "@testing-library/jest-dom";
import { render as r } from "@testing-library/react";
import { ReactFlowProvider } from "reactflow";
import DefaultAttribute from "../../../src/app/components/ErDiagram/notations/DefaultAttribute";
import DefaultEntity from "../../../src/app/components/ErDiagram/notations/DefaultEntity";
import DefaultIsA from "../../../src/app/components/ErDiagram/notations/DefaultIsA";
import DefaultRelationship from "../../../src/app/components/ErDiagram/notations/DefaultRelationship";
import DefaultAggregation from "../../../src/app/components/ErDiagram/notations/DefaultAggregation";

const render = (component: JSX.Element) =>
  r(<ReactFlowProvider>{component}</ReactFlowProvider>);

describe("DefaultEntity", () => {
  it("renders the label", () => {
    const data = { label: "Human", isWeak: false };
    const { getByText } = render(<DefaultEntity data={data} />);
    expect(getByText(data.label)).toBeInTheDocument();
  });

  it("renders a weak entity with a double border", () => {
    const data = { label: "Weak Entity", isWeak: true };
    const { getByText } = render(<DefaultEntity data={data} />);
    const entity = getByText(data.label);
    expect(entity).toHaveClass("border-double");
  });

  it("renders a regular entity with a single border", () => {
    const data = { label: "Strong Entity", isWeak: false };
    const { getByText } = render(<DefaultEntity data={data} />);
    const entity = getByText(data.label);
    expect(entity).toHaveClass("border-2");
  });
});

describe("DefaultIsA", () => {
  it("renders the IsA label", () => {
    const { getByText } = render(<DefaultIsA />);
    expect(getByText("IsA")).toBeInTheDocument();
  });
});

describe("DefaultAttribute", () => {
  it("renders the label", () => {
    const data = { label: "date", isKey: false, entityIsWeak: false };
    const { getByText } = render(<DefaultAttribute data={data} />);
    expect(getByText("date")).toBeInTheDocument();
  });

  it("renders the label as underlined if it's a key", () => {
    const data = { label: "ID", isKey: true, entityIsWeak: false };
    const { getByText } = render(<DefaultAttribute data={data} />);
    expect(getByText("ID")).toHaveClass("underline");
  });

  it("renders the label of a key with dashed underline if the entity is weak", () => {
    const data = { label: "ID", isKey: true, entityIsWeak: true };
    const { getByText } = render(<DefaultAttribute data={data} />);
    expect(getByText("ID")).toHaveClass("decoration-dashed");
  });

  it("renders the label without underline if its not a key", () => {
    const data = { label: "Name", isKey: false, entityIsWeak: false };
    const { getByText } = render(<DefaultAttribute data={data} />);
    expect(getByText("Name")).not.toHaveClass("underline");
  });
});

describe("DefaultRelationship", () => {
  it("renders the label passed as prop", () => {
    const label = "Owns";
    const { getByText } = render(
      <DefaultRelationship data={{ label, hasDependant: false }} />,
    );
    expect(getByText(label)).toBeInTheDocument();
  });

  it("renders a double border if the relationship has a dependant", () => {
    const { getByTestId } = render(
      <DefaultRelationship data={{ label: "Owns", hasDependant: true }} />,
    );
    const relationship = getByTestId("relationship");
    expect(relationship).toHaveClass("border-double");
  });

  it("renders a single border if the relationship has no dependant", () => {
    const { getByTestId } = render(
      <DefaultRelationship data={{ label: "Eats", hasDependant: false }} />,
    );
    const relationship = getByTestId("relationship");
    expect(relationship).not.toHaveClass("border-double");
  });
});

describe("DefaultAggregation", () => {
  it("renders the label", () => {
    const label = "UniversityWithStudents";
    const { getByText } = render(<DefaultAggregation data={{ label }} />);
    expect(getByText(label)).toBeInTheDocument();
  });

  it("sets the width and height of the container", () => {
    const width = 600;
    const height = 400;
    const { container } = render(
      <DefaultAggregation data={{ label: "Aggregation", width, height }} />,
    );
    expect(container.firstChild).toHaveStyle(`width: ${width}px`);
    expect(container.firstChild).toHaveStyle(`height: ${height}px`);
  });
});
