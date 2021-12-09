export interface ApiLink {
  rel: string;
  href: string;
}

export interface Customer {
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
  content: any[];
  links: ApiLink[];
}

export interface Training {
  date: Date;
  duration: number;
  activity: string;
  customer: Customer;
}
