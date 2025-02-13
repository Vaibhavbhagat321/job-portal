import { Job } from "./job.model";

export interface Application {
  id: string;
  jobId: string;
  appliedAt: string;
  mail: string;
  name: string;
  resume: string;
  status: string;
  job?: Job;
}
