import { performance } from "perf_hooks";
import { Edge } from "reactflow";
import { getERDoc } from "../ERDoc";
import { getSemanticErrors } from "../ERDoc/linter";
import { parse } from "../ERDoc/parser";
import ArrowNotation from "../app/components/ErDiagram/notations/ArrowNotation/ArrowNotation";
import { getLayoutedElements } from "../app/hooks/useLayoutedElements";
import { ErNode } from "../app/types/ErDiagram";
import { erToReactflowElements } from "../app/util/erToReactflowElements";
import { generated } from "./perf-examples";
import { oldElkLayout } from "../app/hooks/useOldElkLayout";
import { colaLayout as getColaLayout } from "../app/hooks/useColaLayout";
import * as fs from "fs";

const notation = new ArrowNotation(false);
const erdocToGraph = (str: string) => {
  const [erDoc, _errors] = getERDoc(str);
  return erToReactflowElements(erDoc, notation.edgeMarkers);
};

const ITERATIONS = 100;
const LAYOUT_ITERATIONS = 10;

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
  return [took, std];
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
  return [took, std];
}

const doExperiment = () => {
  const layouts = [
    [
      async (nds: ErNode[], eds: Edge[]) => {
        await oldElkLayout(nds, eds);
      },
      "elk2k",
      true,
    ],

    [
      async (nds: ErNode[], eds: Edge[]) => {
        await oldElkLayout(nds, eds, {
          "elk.force.iterations": "5000",
        });
      },
      "elk5k",
      true,
    ],

    [
      (nds: ErNode[], eds: Edge[]) => {
        // @ts-ignore
        getColaLayout(nds, eds);
      },
      "cola",
      false,
    ],

    [
      async (nds: ErNode[], eds: Edge[]) => {
        await getLayoutedElements(nds, eds);
      },
      "multi",
      true,
    ],
  ] as const;

  type measure = {
    mean: number;
    std: number;
  };

  type testResult = {
    input: {
      erdoc: {
        entities: number;
        relations: number;
        aggregations: number;
      };

      graph: {
        nodes: number;
        edges: number;
      };
    };

    results: {
      processing: {
        parser: measure;
        linter: measure;
        er2graph: measure;
        all: measure;
      };
      layout: {
        elk2k: measure;
        elk5k: measure;
        cola: measure;
        multi: measure;
      };
    };
  };

  const initTestResult = (): testResult => ({
    input: {
      erdoc: {
        entities: 0,
        relations: 0,
        aggregations: 0,
      },

      graph: {
        nodes: 0,
        edges: 0,
      },
    },

    results: {
      processing: {
        parser: { mean: 0, std: 0 },
        linter: { mean: 0, std: 0 },
        er2graph: { mean: 0, std: 0 },
        all: { mean: 0, std: 0 },
      },
      layout: {
        elk2k: { mean: 0, std: 0 },
        elk5k: { mean: 0, std: 0 },
        cola: { mean: 0, std: 0 },
        multi: { mean: 0, std: 0 },
      },
    },
  });

  async function start() {
    const testcases_dir = "src/eval/reports";
    const testcases = fs.readdirSync(testcases_dir).map((f) => {
      const content = fs.readFileSync(`${testcases_dir}/${f}`, "utf-8");
      return content;
    });

    console.log(`Running ${ITERATIONS} iterations for processing functions`);
    console.log(`Running ${LAYOUT_ITERATIONS} iterations for layout functions`);
    const results: testResult[] = [];

    for (const erdoc of testcases) {
      const result = initTestResult();
      const er = parse(erdoc);
      const [nodes, edges] = erdocToGraph(erdoc);
      console.log("\n\n--- START ---");
      const n_entities = er.entities.length;
      const n_relations = er.relationships.length;
      const n_aggregations = er.aggregations.length;
      const n_nodes = nodes.length;
      const n_edges = edges.length;

      result.input = {
        erdoc: {
          entities: n_entities,
          relations: n_relations,
          aggregations: n_aggregations,
        },

        graph: {
          nodes: n_nodes,
          edges: n_edges,
        },
      };

      console.log(
        `Er Document with ${n_entities} entities, ${n_relations} relationships and ${n_aggregations} aggregations`,
      );
      console.log(`Graph with ${n_nodes} nodes and ${n_edges} edges`);

      const [parseMean, parseStd] = await logProcessingFuncs(
        () => parse(erdoc),
        "parser",
      );
      const [linterMean, linterStd] = await logProcessingFuncs(
        () => getSemanticErrors(er),
        "Linter",
      );
      const [er2flowMean, er2flowStd] = await logProcessingFuncs(
        () => erToReactflowElements(er, notation.edgeMarkers),
        "ER2Graph",
      );

      const [allMean, allStd] = await logProcessingFuncs(() => {
        erdocToGraph(erdoc);
      }, "Parse + Errors + ToGraph");

      result.results.processing = {
        parser: { mean: parseMean, std: parseStd },
        linter: { mean: linterMean, std: linterStd },
        er2graph: { mean: er2flowMean, std: er2flowStd },
        all: { mean: allMean, std: allStd },
      };

      for (const [layoutFun, funName, isAsync] of layouts) {
        const [mean, std] = await logLayoutFuncs(
          layoutFun,
          () => [nodes.map((n) => ({ ...n })), edges.map((e) => ({ ...e }))],
          funName,
          isAsync,
        );
        result.results.layout[funName] = { mean, std };
      }
      results.push(result);
    }
    console.log("Finished, writing results to file");
    const OUTPUT_FILE = "src/eval/eval-results.json";
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  }

  start().then(() => {
    console.log("--- DONE ---");
  });
};

doExperiment();
