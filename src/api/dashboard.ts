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

/**
 * URL parameters used in dashboard queries
 */
interface DashboardQueryDates {
  [key: string]: string | undefined;
  /** The date from which data will be filtered, if given */
  date_from?: string;
  /** The date to which data will be filtered, if given */
  date_to?: string;
  /** The timezone UTC offset for date filtering */
  utcoffset?: string;
}

/** Contains related dashboard API calls */
export const DashboardAPI = {
  /** Loads bid dashboard aggregations
   *
   * @params URL params of type {@link DashboardAggregations}
   * @returns An instance of {@link DashboardAggregations}
   */
  loadAggregations: createGet<DashboardAggregations, DashboardQueryDates>(
    "/v2/dashboard/aggregations/"
  ),

  /** Loads bids the requesting user has access to, sorted into their related bid status
   *
   * @params URL params of type {@link DashboardAggregations}
   * @returns An instance of {@link BidsByStatusData}
   */
  loadBidsByStatus: createGet<BidsByStatusData, DashboardQueryDates>(
    "/v2/dashboard/bids-by-status/"
  ),

  /** Loads bids with a decision result as "bid", vs those with "no_bid"
   *
   * @params URL params of type {@link DashboardAggregations}
   * @returns An instance of {@link BidNoBidData}
   */
  loadBidNoBid: createGet<BidNoBidData, DashboardQueryDates>(
    "/v2/dashboard/bid-no-bid/"
  ),

  /** Loads how many bids were registered on a day-by-day basis
   *
   * @params URL params of type {@link DashboardAggregations}
   * @returns An instance of {@link BidRegistrationsByTimeData}
   */
  loadBidRegistrationsByTime: createGet<
    BidRegistrationsByTimeData,
    DashboardQueryDates
  >("/v2/dashboard/bid-registrations-by-time/"),

  /** Loads how many users have been allocated to tasks within the given timeframe
   *
   * @params URL params of type {@link DashboardAggregations}
   * @returns An instance of {@link ResourceAllocationData}
   */
  loadResourceAllocation: createGet<
    ResourceAllocationData,
    DashboardQueryDates
  >("/v2/dashboard/task-completion/"),

  /** Loads the top 10 customers, ordered by the amount of bids they're assigned to
   *
   * @params URL params of type {@link DashboardAggregations}
   * @returns An instance of {@link Top10CustomersData}
   */
  loadTop10Customers: createGet<Top10CustomersData, DashboardQueryDates>(
    "/v2/dashboard/top-10-customers/"
  ),
};
