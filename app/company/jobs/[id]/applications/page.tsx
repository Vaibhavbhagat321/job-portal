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
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const JobApplications = () => {
  const params = useParams();
  const [job, setJob] = useState<Job>();
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getJob() {
    setIsFetching(true);
    try {
      const res = await fetch(`/api/jobs/${params.id}?userType=company`);
      const data = await res.json();
      if (data.status === 200) setJob(data.job);
      else
        toast({
          title: "Failed",
          description: data.error.name,
        });
      setIsFetching(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Unknown Error Occured" });
    }
  }

  useEffect(() => {
    getJob();
  }, []);

  async function onApplicationStatusChange(id: string, status: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.status === 200) {
        getJob();
        toast({
          title: "Updated",
          description: data.message,
        });
      } else
        toast({
          title: "Failed",
          description: data.error.name,
        });
    } catch (err) {
      console.error(err);
      toast({ title: "Unknown Error Occured" });
    }
    setLoading(false);
  }

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
      <div className="text-lg font-medium mb-4">
        Applicants - {job?.application?.length}
      </div>
      <div className="flex flex-row flex-wrap gap-8">
        {job?.application?.length === 0 ? (
          <p>No Applicaitons Yet.</p>
        ) : (
          job?.application?.map((application) => (
            <Card className="w-64" key={application.id}>
              <CardHeader>
                <CardTitle>{application.name}</CardTitle>
                <CardDescription>{application.mail}</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <a
                    href={application.resume}
                    target="_blank"
                    className="text-sm text-blue-800 underline"
                  >
                    View Resume
                  </a>
                </div>
                <div className="text-sm capitalize">
                  Status: {application.status}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {application.status !== "pending" && (
                  <Button disabled>{application.status}</Button>
                )}
                {application.status === "pending" && (
                  <>
                    <Button
                      onClick={() =>
                        onApplicationStatusChange(application.id, "Accepted")
                      }
                      disabled={loading}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        onApplicationStatusChange(application.id, "Rejected")
                      }
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JobApplications;
