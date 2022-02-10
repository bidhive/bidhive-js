import { createGet } from "client";

export interface Customer {
  name: string;
  short_name?: string;
}

export class CustomerAPI {
  static loadCustomers = createGet<Customer[]>("/public/customer/");
}
