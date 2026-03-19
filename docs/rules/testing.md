# Testing Rules

## Purpose
This document defines the testing standard for Fiber Control.

Testing is part of delivery quality. A technical feature is not complete unless the relevant automated tests exist and pass.

---

## 1. Testing Philosophy
Fiber Control must prioritize:
- correctness
- predictability
- safe refactoring
- confidence during growth

Tests should protect:
- business rules
- route contracts
- critical flows
- regressions

---

## 2. Official Testing Stack
- Vitest
- Supertest

Use:
- integration tests for API routes
- service tests for business rules when needed
- foundation/smoke tests for app boot and critical endpoints

---

## 3. Minimum Testing Rule
Every completed technical feature must include at least:
- 1 happy path test
- 1 error path test
- 1 edge case test

If that is missing, the task is not done.

---

## 4. What Must Be Tested First
Priority order:

### Foundation
- app boot
- `/health`
- Swagger route availability
- env validation behavior where relevant

### Business modules
- create customer
- list customer
- update customer
- register payment
- calculate summaries
- status transitions

### Security-related behavior
- invalid payload rejection
- unauthorized route access once auth exists
- not found behavior
- validation errors

---

## 5. Test Types

### Smoke Tests
Purpose:
- verify app boots correctly
- verify critical endpoints respond

Examples:
- server starts
- `/health` returns 200
- `/docs` is available

### Integration Tests
Purpose:
- verify route + service + repository + database behavior together

Examples:
- create customer through API
- list customers through API
- register payment through API

This is the most important test type for early backend work.

### Service Tests
Purpose:
- verify business logic in isolation when the rule is complex enough

Examples:
- overdue calculation
- suspension logic
- financial summary rules
- tax estimation

Use service tests when logic becomes dense or highly reusable.

---

## 6. Route Test Rules
For every route:
- test success case
- test invalid input
- test relevant not found or conflict case
- assert important response fields
- assert HTTP status code

---

## 7. Business Rule Test Rules
Critical business rules must have direct test coverage.

Examples:
- customer becomes overdue after grace period
- customer becomes suspended after cutoff
- payment restores status correctly
- financial totals are calculated correctly

---

## 8. Database Testing Rules
When a feature touches persistence:
- verify database write behavior
- verify database read behavior
- verify relation integrity when applicable

Avoid assuming persistence works without testing it.

---

## 9. Naming Rules
Test names must clearly describe behavior.

Good examples:
- `should return health status`
- `should create a customer with valid data`
- `should reject customer creation with missing name`
- `should mark customer as overdue after grace period`

Bad examples:
- `test customer`
- `works fine`
- `should do stuff`

---

## 10. Test Isolation Rules
- tests should not depend on execution order
- test data should be predictable
- avoid shared mutable state between tests
- cleanup or reset state when needed
- do not make tests depend on manual environment setup beyond documented project flow

---

## 11. Test Data Rules
Use simple, explicit, realistic data.

Examples:
- customer names
- due days
- monthly fees
- payment references

Avoid:
- vague placeholders with no meaning
- giant fixtures when small data is enough
- overly magical factories early on

---

## 12. When to Add More Tests
Add more than the minimum when:
- the rule is financially sensitive
- the rule affects status transitions
- the feature affects multiple modules
- the feature could break reports or diagnostics
- the feature is security-related

---

## 13. Test Failure Rules
A failing test must not be ignored.

Rules:
- do not merge or consider feature complete with failing core tests
- fix root cause, not just assertion
- if a test becomes obsolete, update it intentionally
- do not delete meaningful tests just to make the suite pass

---

## 14. Definition of Testing Done
A feature passes the testing standard when:
- relevant automated tests exist
- tests pass consistently
- important route behavior is covered
- business-critical rules are protected
- the tests are readable and maintainable

---

## 15. Recommended Initial Coverage Focus
Focus first on:
- health
- app boot
- customers
- payments
- financial summaries
- status transition rules

Do not chase vanity coverage numbers early.
Protect the important flows first.
