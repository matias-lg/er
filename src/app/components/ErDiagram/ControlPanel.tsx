import { useTranslations } from "next-intl";
import { HiServer, HiSparkles } from "react-icons/hi2";
import { ControlButton, Controls, useReactFlow } from "reactflow";
import { colors } from "../../util/colors";
import { getLayoutedElements } from "../../hooks/useLayoutedElements";
import ArrowNotation from "./notations/ArrowNotation/ArrowNotation";
import { getERDoc } from "../../../ERDoc";
import { erToReactflowElements } from "../../util/erToReactflowElements";
import { oldElkLayout } from "../../hooks/useOldElkLayout";
import { colaLayout as getColaLayout } from "../../hooks/useColaLayout";
import { parse } from "../../../ERDoc/parser";
import { getSemanticErrors } from "../../../ERDoc/linter";

const ERDOC = `
entity Employee {
    e_id key
    name
}
 
entity Department {
    d_number key
    d_name
}
 
relation Manages(Department: [Management 1!, Research])
 
 
relation Works_for(Employee N, Department 1!)
 
entity Project {
    p_id key
    p_name
}
 
relation Controls(Department 1, Project N!)
 
relation Works_on(Employee M, Project N) {
    hours
}
 
entity Part {
    p_number key
    p_name
}
 
entity Screw extends Part {
    head_style
}
 
entity Supplier {
    s_id key
    s_name
}
 
relation Supplies(Project M, Part N!, Supplier P!) {
    Quantity
}
 
entity Dependent depends on Dependent_of {
    Dep_name pkey
    Gender
}
 
relation Dependent_of(Employee 1, Dependent N!)
`;

const arrowNotation = new ArrowNotation(false);

type ControlPanelProps = {
  onLayoutClick: () => void;
};

export const ControlPanel = ({ onLayoutClick }: ControlPanelProps) => {
  const t = useTranslations("home.erDiagram");
  const { getNodes, setNodes, getEdges, setEdges, fitView } = useReactFlow();

  const handleLayoutClick = () => {
    const nodes = getNodes();
    const edges = getEdges();
    getLayoutedElements(nodes, edges).then((layoutedNodes) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          const layoutedNode = layoutedNodes.find((n) => n.id === node.id);
          return {
            ...node,
            position: layoutedNode?.position!,
            style: { ...node.style, opacity: 1 },
          };
        }),
      );

      setEdges((edges) =>
        edges.map((edge) => ({
          ...edge,
          hidden: false,
          style: {
            ...edge.style,
          },
        })),
      );
      setTimeout(() => {
        window.requestAnimationFrame(() => fitView());
        onLayoutClick();
      }, 0);
    });
  };

  return (
    <Controls showInteractive={false}>
      <ControlButton
        style={{
          backgroundColor: "#fff",
        }}
        title={t("layoutButton")}
        onClick={handleLayoutClick}
      >
        <HiSparkles
          style={{
            color: colors.textEditorBackground,
          }}
        />
      </ControlButton>

      <ControlButton
        style={{
          backgroundColor: "red",
        }}
        title="EXPERIMENT"
        onClick={doExperiment}
      >
        <HiServer
          style={{
            color: colors.textEditorBackground,
          }}
        />
      </ControlButton>
    </Controls>
  );
};

const doExperiment = () => {
  // need to make a local copy for each algo
  const nodesElk1 = nodes.map((n) => ({ ...n }));
  const edgesElk1 = edges.map((e) => ({ ...e }));

  const nodesElk2 = nodes.map((n) => ({ ...n }));
  const edgesElk2 = edges.map((e) => ({ ...e }));

  const nodesCola = nodes.map((n) => ({ ...n }));
  const edgesCola = edges.map((e) => ({ ...e }));

  const layouts = [
    [
      async () => {
        await oldElkLayout(nodesElk1, edgesElk1);
      },
      "Elk2.5k",
      true,
    ],

    [
      async () => {
        await oldElkLayout(nodesElk2, edgesElk2, {
          "elk.force.iterations": "5000",
        });
      },
      "Elk5k",
      true,
    ],

    [
      () => {
        // @ts-ignore
        getColaLayout(nodesCola, edgesCola);
      },
      "WebCola",
      false,
    ],

    [
      async () => {
        await getLayoutedElements(nodes, edges);
      },
      "UltimateLayout",
      true,
    ],
  ] as const;

  async function start() {
    console.log("\n\n--- START ---");

    await logResults(() => parse(ERDOC), "parser");
    await logResults(() => getSemanticErrors(er), "Linter");
    await logResults(
      () => erToReactflowElements(er, arrowNotation.edgeMarkers),
      "ER2Graph",
    );

    await logResults(() => {
      erdocToGraph(ERDOC);
    }, "Parse + Errors + ToGraph");

    for (const [layoutFun, funName, isAsync] of layouts) {
      await logResults(layoutFun, funName, isAsync);
    }
  }

  start().then(() => {
    console.log("--- DONE ---");
  });
};

const erdocToGraph = (str: string) => {
  const [erDoc, _errors] = getERDoc(str);
  return erToReactflowElements(erDoc, arrowNotation.edgeMarkers);
};

const er = parse(ERDOC);
const [nodes, edges] = erdocToGraph(ERDOC);

const eval_fun = async (
  fun: (() => void) | (() => Promise<void>),
  isAsync: boolean = false,
) => {
  const ITERATIONS = 100;
  const measures: number[] = [];
  for (let i = 0; i < ITERATIONS; i++) {
    if (isAsync) {
      const start = performance.now();
      await Promise.resolve(fun());
      const took = performance.now() - start;
      measures.push(took);
    } else {
      const start = performance.now();
      fun();
      const took = performance.now() - start;
      measures.push(took);
    }
  }
  const n = measures.length;
  const mean = measures.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(
    measures.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n,
  );
  return [mean, std];
};

async function logResults(
  fun: () => void,
  fun_name: string,
  isAsync: boolean = false,
) {
  const [took, std] = await eval_fun(fun, isAsync);
  console.log(`${fun_name}: ${took.toFixed(2)}ms ± ${std.toFixed(2)}ms`);
}
