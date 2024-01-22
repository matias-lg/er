import { checkEntityExtendsChildEntity } from "./ERDoc/linter/entity/checkEntityExtendsChild";
import { parse } from "./ERDoc/parser";
import { getSemanticErrors } from "./ERDoc/linter";

const str = `
entity Life extends Westie {
	age
}

entity Mammal extends Life {
	m_id
}

entity Dog extends Mammal {
	name
}

entity Westie extends Dog {

}

entity Frenchie extends Dog {

}`

const cyclicER = parse(str);

const errors = checkEntityExtendsChildEntity(cyclicER);
getSemanticErrors(cyclicER)
