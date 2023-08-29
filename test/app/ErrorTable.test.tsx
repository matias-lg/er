import { render } from "@testing-library/react";
import ErrorTable from "../../src/app/[locale]/ErrorTable";
import { NextIntlClientProvider } from "next-intl";
import { SemanticError } from "../../src/ERDoc/types/linter/SemanticError";
import messages from "../../src/locales/en.json";

describe("Error table component", () => {
  it("should display 'Syntax error' when there's one", () => {
    const { getByText } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ErrorTable
          hasSyntaxError={true}
          semanticErrors={[]}
          syntaxError={new Error("Syntax error")}
        />
        ,
      </NextIntlClientProvider>,
    );
    expect(getByText("Syntax error")).toBeTruthy();
  });
});

describe("Semantic Error messages", () => {
  const defaultLocation = {
    start: {
      offset: 0,
      line: 0,
      column: 0,
    },
    end: {
      offset: 0,
      line: 0,
      column: 0,
    },
  };

  const testCases: [string, SemanticError, string][] = [
    [
      "should display entity duplicate error",
      {
        type: "ENTITY_DUPLICATE",
        entityName: "Human",
        location: defaultLocation,
      },
      'Entity "Human" is duplicate',
    ],

    [
      "should display entity has no key error",
      {
        type: "ENTITY_HAS_NO_KEY",
        entityName: "Human",
        location: defaultLocation,
      },
      'Entity "Human" has no key',
    ],

    [
      "should display entity duplicate attribute error",
      {
        type: "ENTITY_DUPLICATE_ATTRIBUTE",
        entityName: "Human",
        attributeName: "name",
        location: defaultLocation,
      },
      'Entity "Human" has duplicate attribute "name"',
    ],

    [
      "should display entity extends non-existent entity error",
      {
        type: "ENTITY_EXTENDS_NON_EXISTENT_ENTITY",
        entityName: "Human",
        extendsEntityName: "Animal",
        location: defaultLocation,
      },
      'Entity "Human" extends non-existent entity "Animal"',
    ],

    [
      "should display weak entity not in relationship error",
      {
        type: "WEAK_ENTITY_NOT_IN_RELATIONSHIP",
        entityName: "Human",
        relationshipName: "Has",
        location: defaultLocation,
      },
      'Weak entity "Human" depends on relationship "Has", but it doesn\'t participate in it',
    ],

    [
      "should display weak entity not total participation error",
      {
        type: "WEAK_ENTITY_NOT_TOTAL_PARTICIPATION",
        entityName: "Human",
        relationshipName: "Has",
        location: defaultLocation,
      },
      'Weak entity "Human" doesn\'t have total participation in relationship "Has"',
    ],

    [
      "should display weak entity depends on non-existent relationship error",
      {
        type: "WEAK_ENTITY_DEPENDS_ON_NON_EXISTENT_RELATIONSHIP",
        entityName: "Human",
        relationshipName: "Has",
        location: defaultLocation,
      },
      'Weak entity "Human" depends on non-existent relationship "Has"',
    ],

    [
      "should display child entity has key error",
      {
        type: "CHILD_ENTITY_HAS_KEY",
        entityName: "Human",
        location: defaultLocation,
      },
      'Child entity "Human" has identifying key',
    ],

    [
      "should display relationship duplicate error",
      {
        type: "RELATIONSHIP_DUPLICATE",
        relationshipName: "Has",
        location: defaultLocation,
      },
      'Relationship "Has" is duplicate',
    ],

    [
      "should display relationship duplicate attribute error",
      {
        type: "RELATIONSHIP_DUPLICATE_ATTRIBUTE",
        relationshipName: "Has",
        attributeName: "since",
        location: defaultLocation,
      },
      'Relationship "Has" has duplicate attribute "since"',
    ],

    [
      "should display relationship duplicate participant error",
      {
        type: "RELATIONSHIP_DUPLICATE_PARTICIPANT",
        relationshipName: "Has",
        entityName: "Human",
        location: defaultLocation,
      },
      'Relationship "Has" has duplicate participant "Human"',
    ],

    [
      "should display relationship participating entity not exists error",
      {
        type: "RELATIONSHIP_PARTICIPATING_ENTITY_NOT_EXISTS",
        relationshipName: "Has",
        entityName: "Human",
        location: defaultLocation,
      },
      'Relationship "Has" has non-existent participating entity "Human"',
    ],

    [
      "should display relationship less than two participants error",
      {
        type: "RELATIONSHIP_LESS_THAN_TWO_PARTICIPATING_ENTITIES",
        relationshipName: "Has",
        location: defaultLocation,
      },
      "Relationship \"Has\" has less than two participating entities",
    ],

    [
      "should display aggregation uses entity name error",
      {
        type: "AGGREGATION_USES_ENTITY_NAME",
        aggregationName: "Has",
        location: defaultLocation,
      },
      'Entity with name "Has" already exists',
    ],

    [
      "should display aggregation duplicate error",
      {
        type: "AGGREGATION_DUPLICATE",
        aggregationName: "Has",
        location: defaultLocation,
      },
      'Aggregation "Has" is duplicate',
    ],

    [
      "should display aggregation relationship not exists error",
      {
        type: "AGGREGATION_RELATIONSHIP_NOT_EXISTS",
        aggregationName: "Human_has_Thing",
        relationshipName: "Has",
        location: defaultLocation,
      },
      'Aggregation "Human_has_Thing" encapsulates non-existent relationship "Has"',
    ],

    [
      "should display aggregation relationship already used error",
      {
        type: "AGGREGATION_RELATIONSHIP_ALREADY_USED",
        aggregationName: "Human_has_Thing",
        relationshipName: "Has",
        location: defaultLocation,
      },
      'Aggregation "Human_has_Thing" encapsulates relationship "Has", which is already used',
    ]


  ];

  for (const [desc, err, expectedMsg] of testCases) {
    it(desc, () => {
      const { getByText } = render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <ErrorTable
            hasSyntaxError={false}
            semanticErrors={[err]}
            syntaxError={null}
          />
          ,
        </NextIntlClientProvider>,
      );
      expect(getByText(expectedMsg)).toBeTruthy();
    });
  }
});
