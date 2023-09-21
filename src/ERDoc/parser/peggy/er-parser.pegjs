{{
  const KEYWORDS = [
"entity",
"extends",
"key",
"pkey",
"relation",
"aggregation",
"depends on"
  ]

  function getLocation(location_fun) {
    const location = location_fun();
    const { source, ...rest } = location;
    return rest;
  }
}}


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
	declareEntity _ identifier:entityIdentifier dependsOn:(_ deps:declareWeak{return deps}) _0
    Lcurly _0
        attributes:(
             head:(_0 e:WeakEntityAttribute {return e})
		     tail:( '\n' _0 e:WeakEntityAttribute  {return e})*
             {return [head, ...tail]}
       	)|0..1|
	    _0
	Rcurly {
        return {
            type: "entity",
            name: identifier,
            attributes: attributes.length == 0? [] : attributes[0],
            hasParent: false,
            parentName: null,
            hasDependencies: true,
            dependsOn,
            location: getLocation(location)
        }
    } 
    
    
// Weak entity attributes
WeakEntityAttribute =
	identifier:attributeIdentifier [ \t]* childAttributes:declareComposite? [ \t]* isKey:(declareIsPartialKey {return true})?
    {
    	const attribute = {name: identifier, location: getLocation(location)}
        attribute.isKey = isKey === true
        const isComposite = childAttributes !== null
        attribute.isComposite  = isComposite 
        attribute.childAttributesNames = isComposite ? childAttributes : null
        return attribute
    }
    
declareWeak = dependsOn [ \t]+ relationshipName:relationshipDependencyIdentifier
{ return {relationshipName}}
// END WEAK ENTITY

//BEGIN ENTITY
entity = 
	declareEntity _ identifier:entityIdentifier parentIdentifier:(_ parent:entityExtends{return parent})? _0
    Lcurly _0
        attributes:(
             head:(_0 e:entityAttribute {return e})
		     tail:( '\n' _0 e:entityAttribute {return e})*
             {return [head, ...tail]}
       	)|0..1|
	    _0
	Rcurly {
        return {
            type: "entity",
            name: identifier,
            attributes: attributes.length == 0? [] : attributes[0],
            hasParent: parentIdentifier !== null,
            parentName: parentIdentifier,
            hasDependencies: false,
            dependsOn: null,
            location: getLocation(location)
        }
    } 
    
// Atributos de la entidad
entityAttribute =
	identifier:attributeIdentifier [ \t]* childAttributes:declareComposite? [ \t]* isKey:(declareIsKey {return true})?
    {
    	const attribute = {name: identifier, location: getLocation(location)}
        attribute.isKey = isKey === true
        const isComposite = childAttributes !== null
        attribute.isComposite = isComposite
        attribute.childAttributesNames = isComposite? childAttributes : null
        return attribute
    }
    
declareComposite =
    beginComposite
        childAttribs: listOfAttributes
    {return childAttribs}

beginComposite = ':' [ \t]*
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
    		 attributes: attributes === null? [] : attributes,
             location: getLocation(location)
             }
    }

relationShipAttribute "relationship attribute " = iden:validWord
 { return{
        name: iden,
        isComposite: false,
        childAttributesNames: null,
        location: getLocation(location)
    }
}

listOfParticipants =
    Lparen
    participants:(
        pHead:([ \t]* p:(CompositeParticipantEntity/participantEntity)  {return p})
        pTail:(','[ \t]* p:(CompositeParticipantEntity/participantEntity) {return p})*
    {return [pHead, ...pTail]}
    ) Rparen
    {return participants}


// begin composite participant in relationship
CompositeParticipantEntity = entityName:entityIdentifier childParticipants:declareCompositeParticipantEntity
{
    return {
        entityName,
        isComposite: true,
        childParticipants,
        location: getLocation(location)
    }
}

declareCompositeParticipantEntity =
    beginComposite
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
// end composite participant in relationship

// begin participant entity in relationship
participantEntity = entityName:entityIdentifier constraints:declareConstraints?{
     {
         let cardinality = "N";
         let isTotal = false;
         if (constraints !== null) {
                cardinality = constraints.cardinality;
                isTotal = constraints.isTotalParticipation;
         }
         return {
                entityName,
                isComposite: false,
                cardinality,
                participation: isTotal? "total" : "partial",
                location: getLocation(location)
         }
    }
}

declareConstraints =
    [ \t]+ c:cardinality isTotal: declareTotalparticipation? 
    {return { cardinality: c, isTotalParticipation: isTotal !== null }}

cardinality = cardinality:(nums:[0-9]+{return nums.join('')} / [A-Z]) { return cardinality }
// end participant entity in relationship
declareTotalparticipation = isTotal:"!" { return true}

// Aggregation
aggregation = declareAggregation _ identifier:aggregationIdentifier _0 Lparen aggregatedRelationshipName:relationshipIdentifier Rparen
 (_0 Lcurly _0 Rcurly)?
{ return {
    type: "aggregation",
    name: identifier,
    aggregatedRelationshipName,
    location: getLocation(location)
    }
}

aggregationIdentifier "aggregation identifier" = validWord
// TOKENS
validWord = characters:([a-zA-Z0-9_áéíóúÁÉÍÓÚñÑ]+) ! {return KEYWORDS.some(kw => kw == characters.join('').toLowerCase())} {return characters.join('')}
Lcurly = "{"
Rcurly = "}"
Lbracket = "["
Rbracket = "]"
Lparen = "("
Rparen = ")"

declareEntity = "entity"i
declareExtends = "extends"i
declareIsKey "key" = "key"
declareIsPartialKey "partial key" = "pkey"
declareRelationship = "relation"i
declareAggregation = "aggregation"i
dependsOn = "depends on"i

_ "1 or more whitespaces" = [ \t\n]+
_0 "0 or more whitespaces" = [ \t\n]*


through = "through"i
relationshipDependencyIdentifier "relationship identifier" = validWord
entityIdentifier "entity identifier" = validWord
attributeIdentifier "attribute identifier" = validWord
parentIdentifier "parent identifier" = validWord
relationshipIdentifier "relationship identifier" = validWord

