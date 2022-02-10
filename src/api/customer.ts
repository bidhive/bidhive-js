import { createGet } from "client";

/** Represents a Bidhive customer */
export interface Customer {
  /** The name of the customer */
  name: string;
  /** The short name of the customer */
  short_name?: string;
}

export const CustomerAPI = {
  /** Loads all customers registered under the requesting user's company */
  loadCustomers: createGet<Customer[]>("/public/customer/"),
};
