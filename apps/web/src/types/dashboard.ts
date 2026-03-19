export type FinanceOverview = {
  referenceMonth: string;
  totalReceivedThisMonth: number;
  totalReceivedThisYear: number;
  totalReceivedLastYear: number;
  expectedRevenueThisMonth: number;
  overdueAmount: number;
  outstandingAmount: number;
};

export type OverdueReportSummary = {
  totalCustomers: number;
  overdueCustomers: number;
  suspendedCustomers: number;
  totalOutstandingAmount: number;
};

export type OverdueReport = {
  summary: OverdueReportSummary;
  customers: {
    id: string;
    fullName: string;
    status: "overdue" | "suspended";
    regionName: string | null;
    monthlyFee: number;
    outstandingAmount: number;
    latestReferenceMonth: string | null;
  }[];
};

export type AnnualSummaryReport = {
  year: number;
  summary: {
    totalPayments: number;
    totalExpectedAmount: number;
    totalReceivedAmount: number;
    totalOutstandingAmount: number;
  };
  monthlyBreakdown: {
    referenceMonth: string;
    expectedAmount: number;
    receivedAmount: number;
    outstandingAmount: number;
  }[];
};

export type Alert = {
  type: "overdue_customer" | "cutoff_soon" | "pending_payment";
  severity: "high" | "medium" | "low";
  code: string;
  message: string;
  daysLate?: number;
  daysUntilCutoff?: number;
  daysUntilDue?: number;
  customer: {
    id: string;
    fullName: string;
    status: "active" | "due_today" | "overdue" | "suspended" | "inactive";
    regionName: string | null;
  };
  payment: {
    referenceMonth: string;
    expectedAmount: number;
    receivedAmount: number;
    outstandingAmount: number;
  };
};

export type AlertsOverview = {
  referenceDate: string;
  referenceMonth: string;
  summary: {
    totalAlerts: number;
    overdueCustomers: number;
    customersReachingCutoff: number;
    pendingPayments: number;
  };
  alerts: Alert[];
};

export type RegionReport = {
  referenceMonth: string;
  regions: {
    regionId: string;
    regionName: string;
    customerCount: number;
    expectedAmount: number;
    receivedAmount: number;
    outstandingAmount: number;
  }[];
};
