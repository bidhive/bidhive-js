import { createGet } from "../client";
import { BidState } from "./bid";
import type { Customer } from "./customer";
import type { User } from "./user";

interface DashboardAggregations {
  total_won_value: number;
  total_lost_value: number;
  total_submitted_value: number;
  total_won: number;
  total_lost: number;
  total_registered: number;
  total_by_type: [{ type: string; total: number }];
}

interface BidsByStatusData {
  date_from: string;
  date_to: string;
  totals: { [key in BidState]?: number };
}

interface BidNoBidData {
  date_from: string;
  date_to: string;
  total_bid: number;
  total_nobid: number;
  avg_decision_result_value: number;
}

interface BidRegistrationsByTimeData {
  date_from: string;
  date_to: string;
  count: number;
  data: {
    date: string;
    value: number;
  }[];
}

interface Top10CustomersData {
  date_from: string;
  date_to: string;
  count: number;
  data: {
    customer: Customer;
    count: number;
  }[];
}

interface ResourceAllocationData {
  date_from: string;
  date_to: string;
  count: number;
  data: {
    user: User;
    total_tasks: number;
  }[];
}

interface DashboardQueryDates {
  [key: string]: string | undefined;
  date_from?: string;
  date_to?: string;
  utcoffset?: string;
}

export const DashboardAPI = {
  loadAggregations: createGet<DashboardAggregations, DashboardQueryDates>(
    "/public/dashboard/aggregations/"
  ),

  loadBidsByStatus: createGet<BidsByStatusData, DashboardQueryDates>(
    "/public/dashboard/bids-by-status/"
  ),

  loadBidNoBid: createGet<BidNoBidData, DashboardQueryDates>(
    "/public/dashboard/bid-no-bid/"
  ),

  loadBidRegistrationsByTime: createGet<
    BidRegistrationsByTimeData,
    DashboardQueryDates
  >("/public/dashboard/bid-registrations-by-time/"),

  loadResourceAllocation: createGet<
    ResourceAllocationData,
    DashboardQueryDates
  >("/public/dashboard/task-completion/"),

  loadTop10Customers: createGet<Top10CustomersData, DashboardQueryDates>(
    "/public/dashboard/top-10-customers/"
  ),
};
