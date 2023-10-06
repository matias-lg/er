import { EXAMPLES } from "../../../util/ErdocExamples";

//eslint-disable-next-line  @typescript-eslint/require-await
export async function GET(
  _request: Request,
  { params }: { params: { example: string } },
) {
  const exampleName = params.example;
  if (exampleName in EXAMPLES) {
    return new Response(JSON.stringify({ example: EXAMPLES[exampleName] }), {
      headers: { "content-type": "application/json" },
    });
  } else {
    return new Response(
      JSON.stringify({ error: `Example ${exampleName} not found` }),
      {
        headers: { "content-type": "application/json" },
        status: 404,
      },
    );
  }
}
