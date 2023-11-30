import { oldElkLayout } from "./app/hooks/useOldElkLayout";
import { colaLayout as getColaLayout } from "./app/hooks/useColaLayout";
import { getLayoutedElements } from "./app/hooks/useLayoutedElements";
import ArrowNotation from "./app/components/ErDiagram/notations/ArrowNotation/ArrowNotation";
import { getERDoc } from "./ERDoc";
import { erToReactflowElements } from "./app/util/erToReactflowElements";

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

const erdocToGraph = (str: string) => {
  const [erDoc, _errors] = getERDoc(ERDOC);
  return erToReactflowElements(erDoc, arrowNotation.edgeMarkers);
};

const eval_fun = async (fun: (() => void) | (() => Promise<void>)) => {
  const ITERATIONS = 100;
  const measures: number[] = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    if (fun instanceof Promise) await fun();
    else fun();
    const took = performance.now() - start;
    measures.push(took);
  }
  const n = measures.length;
  const mean = measures.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(
    measures.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) /
      n,
  );
  return [mean, std];
};

const [nodes, edges] = erdocToGraph(ERDOC);

console.log(nodes)

console.log(edges)

const layouts = [
  [
    async () => {
      await oldElkLayout(nodes, edges);
    },
    "Elk2.5k",
  ],

  [
    async () => {
      await oldElkLayout(nodes, edges, {
        "elk.force.iterations": "5000",
      });
    },
    "Elk5k",
  ],

  [
    () => {
      // @ts-ignore
      getColaLayout(nodes, edges);
    },
    "WebCola",
  ],
  [async () => getLayoutedElements(nodes, edges), "UltimateLayout"],
] as const;

eval_fun(() => {
  erdocToGraph(ERDOC);
})
  .then(([took, std]) => {
    console.log(
      `Parse + Errors + ToGraph: ${took.toFixed(2)}ms ± ${std.toFixed(2)}ms`,
    );
  })
  .then(() => {
    for (const [layoutFun, funName] of layouts) {
      eval_fun(layoutFun).then(([ltook, lstd]) => {
        console.log(`${funName}: ${ltook.toFixed(2)}ms ± ${lstd.toFixed(2)}ms`);
      });
    }
  });
