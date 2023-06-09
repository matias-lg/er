start
  = all:((entity/weakEntity/relationship/aggregation)/_{return null})* {
    const elements = all.filter(ele => ele != null)
    const er = {entities: [], relationships: [], aggregations: []};
    for (const e of elements) {
    	if (e.type == "entity") er.entities.push(e);
        if (e.type == "relationship") er.relationships.push(e);
        if (e.type == "aggregation") er.aggregations.push(e);
    }
  	return er;
  }

// BEGIN WEAK ENTITY
weakEntity = 
	declareEntity _ identifier:entityIdentifier dependsOn:(_ deps:declareWeak{return deps}) parentIdentifier:(_ parent:entityExtends{return parent})? _0
    Lcurly _0
        attributes:(
             head:(_0 e:WeakEntityAttribute {return e})
		     tail:( '\n' _0 e:WeakEntityAttribute  {return e})*
             {return [head, ...tail]}
       	)
	    _0
	Rcurly {
        return {
            type: "entity",
            name: identifier,
            attributes,
            hasParent: parentIdentifier !== null,
            parentName: parentIdentifier,
            hasDependencies: true,
            dependsOn,
        }
    } 
    
    
// Weak entity attributes
WeakEntityAttribute =
	identifier:attributeIdentifier [ \t]* childAttributes:declareMultivalued? [ \t]* isKey:(declareIsPartialKey {return true})?
    {
    	const attribute = {name: identifier}
        attribute.isKey = isKey === true
        const isMultivalued = childAttributes !== null
        attribute.isMultivalued = isMultivalued
        attribute.childAttributesNames = isMultivalued? childAttributes : null
        return attribute
    }
    
declareWeak = dependsOn [ \t]+ entityName:entityIdentifier [ \t]+ through [ \t]+ relationshipName:relationshipDependencyIdentifier
{ return {entityName, relationshipName}}
// END WEAK ENTITY

//BEGIN ENTITY
entity = 
	declareEntity _ identifier:entityIdentifier parentIdentifier:(_ parent:entityExtends{return parent})? _0
    Lcurly _0
        attributes:(
             head:(_0 e:entityAttribute {return e})
		     tail:( '\n' _0 e:entityAttribute {return e})*
             {return [head, ...tail]}
       	)
	    _0
	Rcurly {
        return {
            type: "entity",
            name: identifier,
            attributes,
            hasParent: parentIdentifier !== null,
            parentName: parentIdentifier,
            hasDependencies: false,
            dependsOn: null,
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
            head:([ \t]* h:attributeIdentifier {return h})
    	    tail:( ',' [ \t]* t:attributeIdentifier {return t})*
            {return [head, ...tail]}
        ) Rbracket
    {return attributes}

// Jerarquia de clase
entityExtends
	= (declareExtends _ parent:parentIdentifier {return parent})   

// END ENTITY


// RELATIONSHIP 
relationship
	= declareRelationship _ identifier:relationshipIdentifier _0 participants:listOfParticipants attributes:(_0 Lcurly _0
        attribList:(
             head:(_0 e:relationShipAttribute{return e})
		     tail:( '\n' _0 e:relationShipAttribute{return e})*
             {return [head, ...tail]}
       	)?
    _0
    Rcurly {return attribList === null? [] : attribList})?
    
    {
        return {
    		 type: "relationship",
    		 name: identifier,
             participantEntities: participants,
    		 attributes: attributes === null? [] : attributes
             }
    }

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
        pHead:([ \t]* p:(MultivaluedParticipantEntity/participantEntity)  {return p})
        pTail:(','[ \t]* p:(MultivaluedParticipantEntity/participantEntity) {return p})*
    {return [pHead, ...pTail]}
    ) Rparen
    {return participants}


// begin Multivalued participant in relationship
MultivaluedParticipantEntity = entityName:entityIdentifier childParticipants:declareMultivaluedParticipantEntity
{
    return {
        entityName,
        isMultivalued: true,
        childParticipants
    }
}

declareMultivaluedParticipantEntity =
    beginMultivalued
    childParticipants: listOfChildParticipants
    {return childParticipants}

listOfChildParticipants =
    Lbracket
    participants:(
        pHead:([ \t]* p:participantEntity {return p})
        pTail:(','[ \t]* p:participantEntity {return p})*
    {return [pHead, ...pTail]}
    ) Rbracket
    {return participants}
// end Multivalued participant in relationship

// begin participant entity in relationship
participantEntity = entityName:entityIdentifier cardinalityInfo:declareCardinality?{
     {
         let cardinality = "N";
         let isTotal = false;
         if (cardinalityInfo !== null) {
                cardinality = cardinalityInfo.cardinality;
                isTotal = cardinalityInfo.isTotalParticipation;
         }
         return {
                entityName,
                isMultivalued: false,
                cardinality,
                participation: isTotal? "total" : "partial"
         }
    }
}

declareCardinality =
    [ \t]+ c:cardinality isTotal: declareTotalparticipation 
    {return { cardinality: c, isTotalParticipation: isTotal }}

cardinality = cardinality:(nums:[0-9]+{return nums.join('')} / [A-Z])? { return cardinality === null? "N" : cardinality }
// end participant entity in relationship
declareTotalparticipation = isTotal:"!"? { return isTotal !== null}

// Aggregation
aggregation = declareAggregation _ identifier:aggregationIdentifier _0 Lparen aggregatedRelationshipName:relationshipIdentifier Rparen
 (_0 Lcurly _0 Rcurly)?
{ return {
    type: "aggregation",
    name: identifier,
    aggregatedRelationshipName
    }
}

aggregationIdentifier "aggregation identifier" = validWord
// TOKENS
validWord = characters:[a-zA-Z0-9_áéíóúÁÉÍÓÚñÑ]+ {return characters.join('')}
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
declareIsKey "key" = "key"
declareIsPartialKey "partial key" = "pkey"

dependsOn = "depends on"i
through = "through"i
relationshipDependencyIdentifier "relationship identifier" = validWord
entityIdentifier "entity identifier" = validWord
attributeIdentifier "attribute identifier" = validWord
parentIdentifier "parent identifier" = validWord
relationshipIdentifier "relationship identifier" = validWord

declareRelationship = "relation"i
declareAggregation = "aggregation"i