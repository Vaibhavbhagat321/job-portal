"use client";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { Job } from "@/model/job.model";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job>();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    async function getJob() {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();

        setJob(data.job);
      } catch (err) {
        console.error(err);
        toast({ title: "Unknown Error Occured" });
      }
      setIsFetching(false);
    }

    getJob();
  }, [id]);

  if (isFetching) return <Loader />;

  return (
    <div className="w-full">
      <div className="mb-4">
        <p className="text-base font-medium">{job?.company}</p>
        <h2 className="text-xl font-bold">{job?.title}</h2>
        <p className="text-slate-400">{job?.location}</p>
      </div>
      <div className="mb-4 text-slate-900">
        <p className="mb-4">{job?.description}</p>
        {job?.createdAt && (
          <p className="text-sm text-slate-900 mb-1">
            Posted on - {new Date(job?.createdAt).toLocaleDateString()}{" "}
            {new Date(job?.createdAt).toLocaleTimeString()}
          </p>
        )}

        {job?.updatedAt && (
          <p className="text-sm text-slate-900">
            Last Updated on - {new Date(job?.updatedAt).toLocaleDateString()}{" "}
            {new Date(job?.updatedAt).toLocaleTimeString()}
          </p>
        )}
      </div>
      <div>
        <Button onClick={() => redirect(`/candidate/apply/${id}`)}>
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default JobDetails;
