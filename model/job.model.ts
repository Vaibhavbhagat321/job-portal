import { Application } from "./application.model";

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  company_mail: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  application?: Application[];
}
