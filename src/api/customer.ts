export interface Customer {
  name: string;
  short_name?: string;
  logo_url?: string;
  last_bid_won: number | null;
  last_bid_submitted: number | null;
}
