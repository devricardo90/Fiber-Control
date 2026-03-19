# Fiber Control - Business Rules

## Purpose
This document defines the business rules of Fiber Control.

These rules describe how the product should behave from a business perspective, independent of technical implementation details.

---

## 1. Customer Status Rules

A customer may have one of the following statuses:
- `active`
- `due_today`
- `overdue`
- `suspended`
- `inactive`

### Meanings
- `active`: customer is in good standing
- `due_today`: payment is due today
- `overdue`: payment is late but service is still within tolerance
- `suspended`: payment is too late and service should be blocked or flagged for suspension
- `inactive`: customer is no longer part of the active customer base

---

## 2. Due Date Logic

Each customer has:
- monthly fee
- due day
- grace days
- cutoff days

### Rule
The due date is defined monthly according to the customers configured due day.

Example:
- due day = 10
- payment expected every month on day 10

---

## 3. Grace Period Logic

Grace period defines how long the customer can remain unpaid before being considered officially overdue.

Example:
- due day = 10
- grace days = 3

Behavior:
- day 10: `due_today`
- day 11 to 13: can still be considered in tolerance depending on implementation choice
- after grace period: `overdue`

Recommended interpretation:
- `due_today` only on due date
- `overdue` starts the day after the grace period ends

---

## 4. Suspension Logic

Cutoff days define when the service should be suspended or flagged for suspension.

Example:
- due day = 10
- cutoff days = 5

Behavior:
- up to day 15: not suspended yet
- after day 15: `suspended`

This rule must be configurable per customer or per company policy.

---

## 5. Payment Recognition Rule

When a payment is registered:
- the corresponding billing period must be marked as paid
- customer status must be recalculated
- if the payment covers the expected amount, the customer returns to `active`

If payment is partial:
- system behavior must be explicit
- MVP recommendation: partial payments should not automatically restore full active status unless business policy says so

---

## 6. Billing Period Rule

Payments should be associated with a reference period.

Example:
- March 2026 payment
- April 2026 payment

This avoids ambiguity and allows:
- historical reports
- overdue tracking
- month-by-month visibility

Suggested field:
- `referenceMonth` in format `YYYY-MM`

---

## 7. Overdue Detection Rule

A customer is overdue when:
- the billing period is unpaid
- due date plus grace period has passed

The system must identify overdue customers automatically based on date and payment history.

---

## 8. Automatic Reactivation Rule

If a suspended or overdue customer pays the required amount:
- the related billing period becomes paid
- status must be recalculated
- customer may return to `active`

If there are multiple unpaid periods:
- paying only one period should not fully normalize all pending debt unless business rules explicitly allow it

---

## 9. Payment Status Rules

A payment may have statuses such as:
- `pending`
- `paid`
- `partial`
- `failed`
- `unmatched`

### Meaning
- `pending`: expected but not settled
- `paid`: settled correctly
- `partial`: partially settled
- `failed`: attempted but not completed
- `unmatched`: money entered the bank or system but is not linked to a known customer/payment

---

## 10. Bank Reconciliation Rule

Bank reconciliation compares:
- expected revenue
- received revenue
- unmatched entries

### Outcomes
- matched: received amount linked to known payment/customer
- unmatched: money came in but not linked
- missing: expected payment has not been received

This feature may begin manually and evolve into import/webhook-based reconciliation later.

---

## 11. Financial Summary Rules

The system must calculate:
- total received this month
- total received this year
- total received last year
- expected revenue this month
- overdue amount
- outstanding amount

These values should be based on valid registered payments, not assumptions.

---

## 12. Estimated Tax Rule

Fiber Control does not replace an accountant.

The system only provides estimated tax support.

Each company may configure:
- tax regime label
- estimated tax rate
- due day
- optional notes

Formula:
- estimated tax = total gross revenue configured estimated rate

Example:
- annual revenue = 120,000
- estimated rate = 6%
- estimated tax = 7,200

---

## 13. Fiscal Reminder Rule

The system should support reminders for obligations such as:
- DAS
- Simples tax
- accounting deadlines
- internal fiscal reminders

Each reminder should allow:
- title
- due date
- reminder date
- severity

Suggested statuses:
- `upcoming`
- `due_today`
- `overdue`
- `resolved`

---

## 14. Alerts Rules

The system should generate business alerts for:
- overdue customers
- customers reaching suspension date
- unmatched payments
- tax due soon
- revenue drop
- region underperformance

Alerts should be informative and actionable.

---

## 15. Route Planning Rules

Each customer may belong to a region.

A region may represent:
- neighborhood
- district
- rural area
- route cluster

The system should allow grouping customers by region to support:
- operational visits
- service calls
- expansion analysis

Future enhancement:
- integrate with map and route optimization

---

## 16. Regional Performance Rules

The system should allow business diagnosis by region.

Metrics may include:
- customer count per region
- revenue per region
- overdue customers per region
- growth or decline by region

This supports:
- route optimization
- marketing decisions
- expansion planning

---

## 17. Customer Lifetime Visibility Rule

The system should store enough history to show:
- customer since date
- total amount paid
- overdue history
- payment behavior patterns

This helps decision-making and retention analysis.

---

## 18. Report Rules

The system should support reports such as:
- monthly revenue report
- annual summary report
- customer detail report
- overdue report
- region report

Reports should prioritize clarity and business usefulness.

---

## 19. Data Integrity Rules
- Payments must not exist without a customer, except unmatched bank entries
- Statuses must be recalculated consistently
- Historical records must remain auditable
- Deleting business-critical data should be restricted or soft-deleted in future versions

---

## 20. MVP Rule Set
For MVP, prioritize:
- customers
- due date logic
- payment registration
- status calculation
- overdue visibility
- financial summaries
- basic fiscal reminder support

Do not overcomplicate early versions with full automation before core flows are stable.

---

## 21. Product Rule Priority
If there is ever conflict in implementation, priority order should be:
1. data integrity
2. payment correctness
3. customer status correctness
4. clear financial visibility
5. operational usability
6. automation convenience
