import type { User } from "./user";
import type { Customer } from "./customer";
import { createGet } from "../client";
import { PaginatedResponse } from "./pagination";

export enum BidState {
  Registered = 10,
  InProgress = 15,
  Submitted = 20,
  Shortlisted = 25,
  Won = 30,
  Lost = 40,
  Withdrawn = 50,
  Declined = 55,
  NoFurtherAction = 60,
  NoBid = 70,
}

export enum BidPriority {
  None = 0,
  Low = 10,
  Medium = 20,
  High = 30,
}

/**
 * Removed properties:
 * id,
 * business_lines,
 *
 */
/** Represents a Bidhive bid */
export interface Bid {
  /** The bid's state. A number representation of the bid's state. See {@link BidState}. */
  state: BidState;
  /** The name of the bid */
  name: string;
  /** The description of the bid */
  description: string;
  /** The short name of the bid */
  short_name: string;
  /** A three-letter representation of the bid's type */
  type: string;
  /** The bid's contract type. One of the following:
   * - "" (blank)
   * - "Panel"
   * - "Preferred Supplier"
   * - "Project"
   * - "Single Supplier"
   * - "Framework"
   * - "Consortia"
   * - "Joint Venture"
   * - "Dynamic Purchasing System"
   */
  contract_type: string;
  /** The contract value of the bid */
  contract_value: number;
  /** The bid's contract type. Either "estimated" or "known" */
  contract_value_type: string;
  /** The bid's contract value margin */
  contract_value_margin: number | null;
  /** The bid's contract value cost */
  contract_value_cost: number | null;
  /** The bid's contract value profit */
  contract_value_profit: number | null;
  /** The bid's reference string */
  reference: string;
  /** The priority of a bid. Described in {@link BidPriority}. */
  priority: BidPriority;

  /** The issue date of a bid, in ISO date format */
  issue_date?: string | null;
  /** The start date of a bid, in ISO date format */
  start_date?: string | null;
  /** The due date of a bid, in ISO date format */
  due_date?: string | null;
  /** The expected decision date of a bid, in ISO date format */
  expected_decision_date?: string | null;
  /** The actual decision date of a bid, in ISO date format */
  actual_decision_date: string | null;
  /** If a bid was backdated */
  backdate: boolean;

  /** The date a bid was created, in ISO date format */
  created_at: string;
  /** Who created the bid */
  created_by: User;
  /** The date a bid was last edited, in ISO date format */
  modified_at: string;

  /** The bid-no-bid decision result of a bid. Either "bid", "no_bid" or null if no decision has been made */
  decision_result: ("bid" | "no_bid") | null;
  /** The threshold of a bid's decision. A number */
  decision_threshold: number | null;
  /** The combined score of a bid's bid-no-bid questionnaires. A float field between 0 and 100 */
  decision_result_value: number;

  /** This bid's customer */
  customer: Customer;

  /** This bid's team manager, if one exists */
  manager?: User;

  /** The auto number of a bid */
  auto_number: number;

  /** The ID of the next milestone, or null if none exists */
  next_milestone_id: number | null;

  /** When this bid was submitted, if it has been */
  submitted_at: string | null;
  /** Who marked this bid as submitted */
  submitted_by: User | null;
}

export const BidAPI = {
  /** Loads all bids from the requesting user's company, which the user has permission to see
   *
   * @returns An array of {@link Bid}s
   */
  loadBids: createGet<PaginatedResponse<Bid>>("/public/bid/"),
};
