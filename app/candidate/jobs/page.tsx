"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { Job } from "@/model/job.model";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    async function getJobs() {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/jobs`);
        const data = await res.json();

        setJobs(data.jobs);
      } catch (err) {
        console.error(err);
        toast({
          title: "Unknown error occured",
        });
      }
      setIsFetching(false);
    }

    getJobs();
  }, []);

  if (isFetching) return <Loader />;

  if (jobs.length === 0)
    return <p className="w-full text-slate-400">No Jobs Posted Yet!</p>;

  return jobs.map((job) => (
    <Card key={job.id} className="mb-4 relative w-full">
      <CardHeader>
        <p className="text-slate-600 text-xs font-medium">{job.company}</p>
        <CardTitle
          className=" cursor-pointer"
          onClick={() => redirect(`/candidate/jobs/${job.id}`)}
        >
          {job.title}
        </CardTitle>
        <CardDescription>{job.location}</CardDescription>
        <CardContent className="p-0 line-clamp-2 text-slate-900">
          {job.description}
        </CardContent>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button asChild>
          <Link href={`/candidate/apply/${job.id}`}>Apply</Link>
        </Button>
      </CardFooter>
    </Card>
  ));
};

export default JobList;
