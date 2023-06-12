/*
# TODO:
Entidades:
 [X] Entidad Base
 [X] Declarar llaves
 [X] Atributos multivaluados
 [X] Jerarquía de Clases
 [X] Entidades débiles

Relaciones:
 [X] Relación Base
 [X] Relaciones N-arias
 [ ] Arcos etiquetados
 [X] Restricciones cardinalidad de cada entidad
 [X] Restricciones de participación de cada entidad

Agregación:
[ ] Agregación Base
*/

start
  = all:((entity/relationship)/_{return null})* {
    const elements = all.filter(ele => ele != null)
    const er = {entities: [], relationships: []};
    for (const e of elements) {
    	if (e.type == "entity") er.entities.push(e)
        if (e.type == "relationship") er.relationships.push(e)
    }
  	return er;
  }


// BEGIN TOKENS
validWord = characters:[a-zA-Z0-9_]+ {return characters.join('')}
Lcurly = "{"
Rcurly = "}"
Lbracket = "["
Rbracket = "]"
Lparen = "("
Rparen = ")"

declareEntity = "entity"i
declareExtends = "extends"i
_ "1 or more whitespaces" = [ \t\n]+
_0 "0 or more whitespaces" = [ \t\n]*
declareIsKey "key" = "key"i

declareRelationship = "relation"i
// END TOKENS

//BEGIN ENTITY
entityIdentifier "entity identifier" = validWord

entity = 
	declareEntity _ identifier:entityIdentifier dependsOn:(_ deps:declareWeak{return deps})? parentIdentifier:(_ parent:entityExtends{return parent})? _0
    Lcurly _0
        attributes:(
             head:(_0 e:entityAttribute {return e})
		     tail:( '\n' _0 e:entityAttribute {return e})*
             {return [head, ...tail]}
       	)
	    _0
	Rcurly {
        const hasDependencies = dependsOn !== null
        return {
            type: "entity",
            name: identifier,
            attributes,
            hasParent: parentIdentifier !== null,
            parentName: parentIdentifier,
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
        attribute.childAttributesNames = isMultivalued? childAttributes : null
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
relationshipDependencyIdentifier "relationship identifier" = validWord
declareWeak = dependsOn [ \t]+ entityName:entityIdentifier [ \t]+ through [ \t]+ relationshipName:relationshipDependencyIdentifier
{ return {entityName, relationshipName}}

// END ENTITY


// RELATIONSHIP 
relationship
	= declareRelationship _ identifier:relationshipIdentifier _0 participants:listOfParticipants Lcurly _0
        attributes:(
             head:(_0 e:relationShipAttribute{return e})
		     tail:( '\n' _0 e:relationShipAttribute{return e})*
             {return [head, ...tail]}
       	)
    _0
    Rcurly 
    
    {
        return {
    		 type: "relationship",
    		 name: identifier,
             participantEntities: participants,
    		 attributes
             }
    }

relationshipIdentifier "relationship identifier" = validWord
relationShipAttribute "relationship attribute " = iden:validWord
 { return{
        name: iden,
        isMultivalued: false,
        childAttributesNames: null
    }
}

listOfParticipants =
    Lparen
    participants:(
        pHead:([ \t]* p:participantEntity [ \t]*  {return p})
        pTail:(','[ \t]* p:participantEntity {return p})*
    {return [pHead, ...pTail]}
    ) Rparen
    {return participants}

participantEntity = (entityName:entityIdentifier cardinalityInfo:declareCardinality?{
     {
         let cardinality = "N";
         let isTotal = false;
         if (cardinalityInfo !== null) {
                cardinality = cardinalityInfo.cardinality;
                isTotal = cardinalityInfo.isTotalParticipation;
         }
         return {
                entityName,
                cardinality,
                participation: isTotal? "total" : "partial"
         }
    }
})

declareCardinality =
    [ \t]+ c:cardinality isTotal:'!'?{return { cardinality: c, isTotalParticipation: isTotal === '!' }}

cardinality = cardinality:(nums:[0-9]+{return parseInt(nums.join(''))} / [A-Z])? { return cardinality === null? "N" : cardinality }

 /*
        attributes:(
             head:(_0 e:entityAttribute {return e})
		     tail:( '\n' _0 e:entityAttribute {return e})*
             {return [head, ...tail]}
       	)
*/