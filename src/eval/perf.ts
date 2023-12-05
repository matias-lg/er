import { performance } from "perf_hooks";
import { Edge } from "reactflow";
import { getERDoc } from "../ERDoc";
import { getSemanticErrors } from "../ERDoc/linter";
import { parse } from "../ERDoc/parser";
import ArrowNotation from "../app/components/ErDiagram/notations/ArrowNotation/ArrowNotation";
import { getLayoutedElements } from "../app/hooks/useLayoutedElements";
import { ErNode } from "../app/types/ErDiagram";
import { erToReactflowElements } from "../app/util/erToReactflowElements";
import { generated } from "../perf-examples";
const notation = new ArrowNotation(false);
const erdocToGraph = (str: string) => {
  const [erDoc, _errors] = getERDoc(str);
  return erToReactflowElements(erDoc, notation.edgeMarkers);
};

const ITERATIONS = 1;
const LAYOUT_ITERATIONS = 1;

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
  for (let i = 0; i < LAYOUT_ITERATIONS; i++) {
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
  fun: (nds: ErNode[], eds: Edge[]) => void,
  getArgs: () => [ErNode[], Edge[]],
  fun_name: string,
  isAsync: boolean = false,
) {
  const [took, std] = await eval_layout_fun(fun, getArgs, isAsync);
  console.log(`${fun_name}: ${took.toFixed(2)}ms ± ${std.toFixed(2)}ms`);
}

const doExperiment = () => {
  const layouts = [
    // [
    //   async (nds: ErNode[], eds: Edge[]) => {
    //     await oldElkLayout(nds, eds);
    //   },
    //   "Elk DFL 2.5k iter",
    //   true,
    // ],
    //
    // [
    //   async (nds: ErNode[], eds: Edge[]) => {
    //     await oldElkLayout(nds, eds, {
    //       "elk.force.iterations": "5000",
    //     });
    //   },
    //   "DFL 5k iter",
    //   true,
    // ],
    //

    // [
    //   (nds: ErNode[], eds: Edge[]) => {
    //     // @ts-ignore
    //     getColaLayout(nds, eds);
    //   },
    //   "WebCola",
    //   false,
    // ],

    [
      async (nds: ErNode[], eds: Edge[]) => {
        await getLayoutedElements(nds, eds);
      },
      "Multi-Layout",
      true,
    ],
  ] as const;

  async function start() {
    const testcases = [generated];
    console.log(`Running ${ITERATIONS} iterations for processing functions`);
    console.log(`Running ${LAYOUT_ITERATIONS} iterations for layout functions`);

    for (const erdoc of testcases) {
      const er = parse(erdoc);
      const [nodes, edges] = erdocToGraph(erdoc);
      console.log("\n\n--- START ---");
      console.log(
        `Er Document with ${er.entities.length} entities, ${er.relationships.length} relationships and ${er.aggregations.length} aggregations`,
      );
      console.log(`Graph with ${nodes.length} nodes and ${edges.length} edges`);

      await logProcessingFuncs(() => parse(erdoc), "parser");
      await logProcessingFuncs(() => getSemanticErrors(er), "Linter");
      await logProcessingFuncs(
        () => erToReactflowElements(er, notation.edgeMarkers),
        "ER2Graph",
      );

      await logProcessingFuncs(() => {
        erdocToGraph(erdoc);
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
  }

  start().then(() => {
    console.log("--- DONE ---");
  });
};

doExperiment();
