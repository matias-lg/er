import { generate } from "peggy"
import fs from "fs"

const PARSER_FILE = './src/ER.pegjs'
const parser = generate(fs.readFileSync(PARSER_FILE, 'utf8'))

export default parser