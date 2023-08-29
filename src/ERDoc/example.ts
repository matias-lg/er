import { getERDoc } from ".";
import { performance } from "perf_hooks";

const sample_er = `
entity bank {
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

relation a_c(customer N, account M!)
relation l_c(customer N, loan M!)
`;

const now = performance.now();
const [_, errs] = getERDoc(sample_er);
const took = performance.now() - now;
for (const err of errs) {
  console.error(err);
}
console.log(`Parse + lint took ${took.toPrecision(5)}ms`);
