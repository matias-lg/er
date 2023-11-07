import { promises as fs } from "fs";

const EXAMPLES_JSON_DIR = "/src/app/static/examples/";

export async function GET(
  _request: Request,
  { params }: { params: { example: string } },
) {
  const exampleFilename = params.example + ".json";
  console.log(process.cwd());
  try {
    const data = await fs.readFile(
      process.cwd() + EXAMPLES_JSON_DIR + exampleFilename,
      "utf-8",
    );
    const example = JSON.parse(data);
    return new Response(JSON.stringify({ example }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Example ${exampleFilename} not found` }),
      {
        headers: { "content-type": "application/json" },
        status: 404,
      },
    );
  }
}
