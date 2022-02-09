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

/**
 * Removed properties:
 * id,
 * business_lines,
 *
 */
export interface Bid {
  state: BidState;
  name: string;
  description: string;
  short_name: string;
  type: string;
  contract_type: string;
  contract_value: number;
  contract_value_type: string;
  contract_value_margin: number | null;
  contract_value_cost: number | null;
  contract_value_profit: number | null;
  reference: string;
  priority: number;

  issue_date?: string | null;
  start_date?: string | null;
  due_date?: string | null;
  expected_decision_date?: string | null;
  actual_decision_date: string | null;
  // Is this a historical bid?
  backdate: boolean;

  created_at: string;
  created_by: User;
  modified_at: string;

  decision_result: ("bid" | "no_bid") | null;
  decision_threshold: string | null;
  decision_result_value: number;

  customer: Customer;

  manager?: User;

  auto_number: number;

  /** The ID of the next milestone, or null if none exists */
  next_milestone_id: number | null;

  submitted_at: string | null;
  submitted_by: User | null;
}

export class BidAPI {
  static loadBids = createGet<PaginatedResponse<Bid>>("/public/bid/");
}
