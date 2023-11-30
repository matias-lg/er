import { oldElkLayout } from "./app/hooks/useOldElkLayout";
import { colaLayout as getColaLayout } from "./app/hooks/useColaLayout";
import { getLayoutedElements } from "./app/hooks/useLayoutedElements";
import { parse } from "./ERDoc/parser";
import { getERDoc } from "./ERDoc";
import { erToReactflowElements } from "./app/util/erToReactflowElements";
import ArrowNotation from "./app/components/ErDiagram/notations/ArrowNotation/ArrowNotation";
import { getSemanticErrors } from "./ERDoc/linter";
import { performance } from "perf_hooks";

const notation = new ArrowNotation(false);

const ITERATIONS = 10;
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
 
entity Project extends Screw {
    p_id 
    p_name
}
 
relation Controls(Department 1, Project N!)
 
relation Works_on(Employee M, Project N) {
    hours
}
 
entity Part extends Project {
    a
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
 
relation Dependent_of(Employee 1, Dependent N)

entity Dependent depends on Dependent_of {
    Dep_name pkey
    Gender
}
`;

const erdocToGraph = (str: string) => {
  const [erDoc, _errors] = getERDoc(str);
  return erToReactflowElements(erDoc, notation.edgeMarkers);
};

const eval_fun = async (
  fun: (() => void) | (() => Promise<void>),
  isAsync: boolean = false,
) => {
  const measures: number[] = [];
  for (let i = 0; i < ITERATIONS; i++) {
    let start: number, took: number;
    if (isAsync) {
      start = performance.now();
      await Promise.resolve(fun());
      took = performance.now() - start;
    } else {
      start = performance.now();
      fun();
      took = performance.now() - start;
    }
    measures.push(took);
  }

  const n = measures.length;
  const mean = measures.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(
    measures.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n,
  );
  return [mean, std];
};

async function logProcessingFuncs(
  fun: () => void,
  fun_name: string,
  isAsync: boolean = false,
) {
  const [took, std] = await eval_fun(fun, isAsync);
  console.log(`${fun_name}: ${took.toFixed(2)}ms ± ${std.toFixed(2)}ms`);
}

const eval_layout_fun = async (
  fun: ((n: any, e: any) => void) | ((n: any, e: any) => Promise<void>),
  getArgs: () => [any[], any[]],
  isAsync: boolean = false,
) => {
  const measures: number[] = [];
  for (let i = 0; i < ITERATIONS; i++) {
    let start: number, took: number;
    const [nodes, edges] = getArgs();
    if (isAsync) {
      start = performance.now();
      await Promise.resolve(fun(nodes, edges));
      took = performance.now() - start;
    } else {
      start = performance.now();
      fun(nodes, edges);
      took = performance.now() - start;
    }
    measures.push(took);
  }

  const n = measures.length;
  const mean = measures.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(
    measures.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n,
  );
  return [mean, std];
};

async function logLayoutFuncs(
  fun: (nds: typeof nodes, eds: typeof edges) => void,
  getArgs: () => [typeof nodes, typeof edges],
  fun_name: string,
  isAsync: boolean = false,
) {
  const [took, std] = await eval_layout_fun(fun, getArgs, isAsync);
  console.log(`${fun_name}: ${took.toFixed(2)}ms ± ${std.toFixed(2)}ms`);
}

const er = parse(ERDOC);
const [nodes, edges] = erdocToGraph(ERDOC);

const doExperiment = () => {
  const layouts = [
    [
      async (nds: typeof nodes, eds: typeof edges) => {
        await oldElkLayout(nds, eds);
      },
      "Elk DFL 2.5k iter",
      true,
    ],

    [
      async (nds: typeof nodes, eds: typeof edges) => {
        await oldElkLayout(nds, eds, {
          "elk.force.iterations": "5000",
        });
      },
      "DFL 5k iter",
      true,
    ],

    [
      (nds: typeof nodes, eds: typeof edges) => {
        // @ts-ignore
        getColaLayout(nds, eds);
      },
      "WebCola",
      false,
    ],

    [
      async (nds: typeof nodes, eds: typeof edges) => {
        await getLayoutedElements(nds, eds);
      },
      "Multi-Layout",
      true,
    ],
  ] as const;

  async function start() {
    console.log("\n\n--- START ---");

    const WARMUPS = 10;
    for (let i = 0; i < WARMUPS; i++) {
      parse(ERDOC);
      getSemanticErrors(er);
      erToReactflowElements(er, notation.edgeMarkers);
    }

    await logProcessingFuncs(() => parse(ERDOC), "parser");
    await logProcessingFuncs(() => getSemanticErrors(er), "Linter");
    await logProcessingFuncs(
      () => erToReactflowElements(er, notation.edgeMarkers),
      "ER2Graph",
    );

    await logProcessingFuncs(() => {
      erdocToGraph(ERDOC);
    }, "Parse + Errors + ToGraph");
    for (const [layoutFun, funName, isAsync] of layouts) {
      await logLayoutFuncs(
        layoutFun,
        () => [nodes.map((n) => ({ ...n })), edges.map((e) => ({ ...e }))],
        funName,
        isAsync,
      );
    }
  }

  start().then(() => {
    console.log("--- DONE ---");
  });
};

doExperiment();
