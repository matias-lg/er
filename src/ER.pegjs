/*
# TODO:
Entidades:
 [X] Entidad Base
 [X] Declarar llaves
 [X] Atributos multivaluados
 [X] Jerarquía de Clases
 [X] Entidades débiles

Relaciones:
 [ ] Arcos etiquetados
 [ ] Relaciones N-arias
 [ ] Restricciones cardinalidad de cada entidad
 [ ] Restricciones de participación de cada entidad

Agregación:
[ ] Agregación Base
*/

start
  = all:((entity/relation)/_{return null})* {
    const elements = all.filter(ele => ele != null)
    const er = {entities: [], relations: []};
    for (const e of elements) {
    	if (e.type == "entity") er.entities.push(e)
        if (e.type == "relation") er.relations.push(e)
    }
  	return er;
  }


// BEGIN TOKENS
validWord = characters:[a-zA-Z0-9_]+ {return characters.join('')}
Lcurly = "{"
Rcurly = "}"
Lbracket = "["
Rbracket = "]"

declareEntity = "entity"i
declareExtends = "extends"i
_ "1 or more whitespaces" = [ \t\n]+
_0 "0 or more whitespaces" = [ \t\n]*
declareIsKey "key" = "key"i

declareRelation = "relation"i
// END TOKENS

//BEGIN ENTITY
entityIdentifier "entity identifier" = validWord

entity = 
	declareEntity _ identifier:entityIdentifier dependsOn:(_ deps:declareWeak{return deps})? parentIdentifier:(_ parent:entityExtends{return parent})? _0
    Lcurly _0
        attributes:
            (atrib:entityAttribute '\n' _0{return atrib})*
		    (lastAtrib:entityAttribute {return lastAtrib})*
	    _0
	Rcurly {
        const hasDependencies = dependsOn !== null
        return {
            type: "entity",
            name: identifier,
            attributes,
            hasParent: parentIdentifier !== null,
            parent: parentIdentifier,
            hasDependencies,
            dependsOn: hasDependencies? dependsOn : null 
        }
    } 
    
    
// Atributos de la entidad
entityAttribute =
	identifier:attributeIdentifier [ \t]* childAttributes:declareMultivalued? [ \t]* isKey:(declareIsKey {return true})?
    {
    	const attribute = {name: identifier}
        attribute.isKey = isKey === true
        const isMultivalued = childAttributes !== null
        attribute.isMultivalued = isMultivalued
        attribute.childAttributesNames = isMultivalued? childAttributes : []
        return attribute
    }
    
declareMultivalued =
    beginMultivalued
        childAttribs: listOfAttributes
    {return childAttribs}

beginMultivalued = ':' [ \t]*
listOfAttributes =
    Lbracket
        attributes:(
            firstAttrs:([ \t]* singleAttr:attributeIdentifier [ \t]* ',' [ \t]* {return singleAttr})*
    	    finalAttr:([ \t]* singleAttr:attributeIdentifier [ \t]* {return singleAttr})
            {return firstAttrs.concat(finalAttr)}
        ) Rbracket
    {return attributes}

attributeIdentifier "attribute identifier" = validWord
// Jerarquia de clase
entityExtends
	= (declareExtends _ parent:parentIdentifier {return parent})   
parentIdentifier "parent identifier" = validWord

// Entidad débil
dependsOn = "depends on"i
through = "through"i
relationDependencyIdentifier "relation identifier" = validWord
declareWeak = dependsOn [ \t]+ entity:entityIdentifier [ \t]+ through [ \t]+ relation:relationDependencyIdentifier
{ return {entity, relation}}

// END ENTITY


// RELATION 
relation
	= declareRelation _ identifier:validWord _0 Lcurly
 	/* relation body */
    _0
    Rcurly 
    
    {return {
    		 type: "relation",
    		 name: identifier,
    		 atributtes: [1]
             }
    }
