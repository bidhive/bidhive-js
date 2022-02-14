import { createGet } from "client";

/** Represents a Bidhive customer */
export interface Customer {
  /** The name of the customer */
  name: string;
  /** The short name of the customer */
  short_name?: string;
}

export const CustomerAPI = {
  /** Loads all customers registered under the requesting user's company
   *
   * @returns An array of {@link Customer}s
   */
  loadCustomers: createGet<Customer[]>("/v2/customer/"),
};
