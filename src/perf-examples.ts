export const withSemanticErrors = `
entity Employee {
    e_id key
    name
}
 
entity Department {
    d_number key
    d_name
}
 
relation Manages(Department: [Management 1!, Research])
 
 
relation Works_for(Employee N, Department 1!)
 
entity Project extends Screw {
    p_id 
    p_name
}
 
relation Controls(Department 1, Project N!)
 
relation Works_on(Employee M, Project N) {
    hours
}
 
entity Part extends Project {
    a
}
 
entity Screw extends Part {
    head_style
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
 
relation Dependent_of(Employee 1, Dependent N)

entity Dependent depends on Dependent_of {
    Dep_name pkey
    Gender
}
`;


export const veryLarge = `
entity university {
    university_id key
    name
    address
}

entity department {
    dept_id key
    name
    head
}

relation has_department(university 1!, department N!)

entity professor {
    professor_id key
    name
    email
}

entity student {
    student_id key
    name
    email
}

entity course {
    course_id key
    name
    credits
}

relation teaches(professor 1, course N!)

entity enrollment {
    enrollment_id key
    enrollment_date
    grade
}

relation enrolls_in(student 1, course 1!, enrollment N!)

entity library {
    library_id key
    name
    location
}

entity book {
    book_id key
    title
    author
    publication_date
}

relation contains(library 1, book N!)

entity publisher {
    publisher_id key
    name
    location
}

entity author {
    author_id key
    name
    birth_date
}

relation publishes(publisher 1!, book N!)
relation writes(author 1, book N!)

entity conference {
    conference_id key
    name
    date
    location
}

entity paper {
    paper_id key
    title
    abstract
}

relation presents(professor 1!, paper N!) {
    presentation_date
}

entity event {
    event_id key
    name
    date
    location
}

relation attends(student 1!, event N!) {
    attendance_date
}

entity project {
    project_id key
    name
    description
}

entity task {
    task_id key
    name
    deadline
}

relation works_on(student 1!, project N!, task M!)

entity hospital {
    hospital_id key
    name
    address
}

entity doctor {
    doctor_id key
    name
    specialization
}

relation works_at(doctor 1, hospital N!)

entity patient depends on treats {
    patient_id pkey
    name
    dob
}

relation treats(doctor 1!, patient N!) {
    treatment_date
}

entity medication {
    medication_id key
    name
    dosage
}

relation prescribes(doctor 1, medication N!)

entity pharmacy {
    pharmacy_id key
    name
    location
}

relation dispenses(medication 1!, pharmacy N!) {
    dispensing_date
}

entity bank {
    bank_id key
    name
    address
}

entity branch depends on has_branches {
    branch_id pkey
    branch_no
    location
}

relation has_branches(bank 1!, branch N!)

entity account {
    account_id key
    balance
    type
}

entity loan {
    loan_id key
    amount
    type
}

relation accts(bank_with_branches 1, account N!)
relation loans(bank_with_branches 1, loan N!)

entity customer {
    customer_id key
    name
    address
    phone
}

entity premium_customer extends customer {
    discount
}

relation has_account(customer N, account M!)
relation has_loan(customer N, loan M!)

aggregation bank_with_branches(has_branches)

entity employee {
    employee_id key
    name
    salary
}

entity manager extends employee {
    department
}

relation works_at(employee 1!, bank_with_branches N!)

entity transaction {
    transaction_id key
    date
    amount
}

relation makes(account 1!, transaction N!)

entity atm_machine {
    atm_id key
    location
}

relation located_at(atm_machine 1, bank_with_branches N!)

entity credit_card {
    card_no key
    expiration_date
    credit_limit
}

relation issued_to(credit_card 1!, customer N!)

entity mortgage extends loan {
    property_address
    interest_rate
}

entity checking_account extends account {
    monthly_fee
    overdraft_protection
}

relation owns(customer 1!, checking_account N!)
relation has(credit_card 1!, checking_account N!)

entity savings_account extends account {
    interest_rate
    minimum_balance
}

relation owns(customer 1!, savings_account N!)
relation has(credit_card 1!, savings_account N!)

entity transaction_log {
    log_id key
    description
    date
}

relation logs(transaction_log 1, transaction N!)

entity service_provider {
    provider_id key
    name
    location
}

entity service {
    service_id key
    name
    description
}

entity service_location extends service {
    location
}

relation provides(service_provider 1, service_location N!, service M!)
relation offers(customer N, service_location M!)
relation requires(service M!, service_location N!)
`

