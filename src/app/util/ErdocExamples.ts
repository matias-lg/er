//prettier-ignore
export const EXAMPLES: {
  [key: string]: string;
} = {
  bank:
`entity bank {
    code key
    name
    addr
}

entity bank_branch depends on has_branches {
    addr
    branch_no pkey
}

relation has_branches(bank 1!, bank_branch N!)

entity account {
    acct_no key
    balance
    type
}

entity loan {
    loan_no key
    amount
    type
}

relation accts(Bank_With_Branches 1, account N!)
relation loans(Bank_With_Branches 1, loan N!)

entity customer {
    ssn key
    name
    addr
    phone
}

entity premium_customer extends customer {
    discount
}

relation a_c(customer N, account M!)
relation l_c(customer N, loan M!)

aggregation Bank_With_Branches(has_branches)


    `,

company:
`
entity Employee {
    e_id key
    name
}

entity Department {
    d_number key
    d_name
}

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
`,

subclass: `entity Employee {
  name
  id key
  bday
}
 
entity Management_Employee extends Employee {}
entity Manager extends Management_Employee {}
entity CEO extends Management_Employee {}
entity Engineer extends Employee {}
entity Senior_Engineer extends Engineer {}
entity Team_Leader extends Senior_Engineer {}
entity Intern extends Engineer {}
entity Secretary extends Employee {
  typing_speed
}
`,

aggregation: `entity Human {
  id key
  name
  age
}
 
entity Coffee {
  id key
  species
  roast_date
}
 
relation Drinks(Human 1, Coffee) {
  amount
}
 
aggregation Human_drinks_coffee(Drinks)`,

roles: `entity Employee {
  id key
  name
  age
}
 
relation Manages(Employee: [Intern, Manager 1])`

};

export const EXAMPLE_NAMES = Object.keys(EXAMPLES);
