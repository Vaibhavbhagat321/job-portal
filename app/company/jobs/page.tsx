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
import { userState } from "@/lib/redux/slice/userSlice";
import { RootState } from "@/lib/redux/store";
import { Job } from "@/model/job.model";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const user = useSelector<RootState, userState>((state) => state.user);

  useEffect(() => {
    async function fetchJobs() {
      setIsFetching(true);
      const res = await fetch(
        `/api/jobs?userType=${user.userType}&userMail=${user.userMail}`
      );
      const data = await res.json();

      if (data.status === 200) setJobs(data.jobs);
      setIsFetching(false);
    }

    fetchJobs();
  }, [user.userMail, user.userType]);

  function onEdit(id: string) {
    redirect(`/company/jobs/new?edit=${id}`);
  }

  async function onDelete(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== data.job.id));

      if (data.status === 200) {
        toast({
          title: data.message,
          description: data.job.title,
        });
      } else {
        toast({
          title: "Failed",
          description: data.error.name,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Unkown Error occured",
      });
    }
    setLoading(false);
  }

  if (isFetching) return <Loader />;

  if (jobs.length === 0)
    return <p className="w-full text-slate-400">No Jobs Posted Yet!</p>;

  return jobs.map((job) => (
    <Card key={job.id} className="mb-4 relative w-full">
      <CardHeader>
        <CardTitle
          className=" cursor-pointer"
          onClick={() => redirect(`/company/jobs/${job.id}/applications`)}
        >
          {job.title}
        </CardTitle>
        <CardDescription>{job.location}</CardDescription>
        <CardContent className="p-0 line-clamp-2">
          {job.description}
        </CardContent>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit(job.id)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(job.id)}
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin"></Loader2>}
          Delete
        </Button>
      </CardFooter>
    </Card>
  ));
};

export default Jobs;
