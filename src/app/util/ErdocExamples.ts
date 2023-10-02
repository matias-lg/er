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

relation accts(bank_branch 1, account N!)
relation loans(bank_branch 1, loan N!)

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





`
};
