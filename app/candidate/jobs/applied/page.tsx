"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { toast } from "@/hooks/use-toast";
import { RootState } from "@/lib/redux/store";
import { Application } from "@/model/application.model";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AppliedJobs = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);

  const userMail = useSelector<RootState>((state) => state.user.userMail);

  useEffect(() => {
    async function fetchApplications() {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/applications?userMail=${userMail}`);

        const data = await res.json();

        if (data.status === 200) {
          setApplications(data.applications);
        } else {
          toast({
            title: data.message,
          });
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Unkown Error occured",
        });
      }
      setIsFetching(false);
    }
    fetchApplications();
  }, [userMail]);

  function getColor(status: string) {
    if (status === "pending") return "bg-orange-600";
    if (status === "Accepted") return "bg-green-600";
    if (status === "Rejected") return "bg-red-600";
  }

  if (isFetching) return <Loader />;

  return (
    <div className="flex flex-row w-full flex-wrap gap-6">
      {applications.map((application) => (
        <Card key={application.id} className="mb-4 relative w-64">
          <CardHeader className="p-4">
            <p className="text-slate-600 text-xs font-medium">
              {application.job?.company}
            </p>
            <CardTitle>{application.job?.title}</CardTitle>
          </CardHeader>
          <CardFooter>
            <div
              className={`h-2 w-2 ${getColor(
                application.status
              )} text-sm mr-2 capitalize rounded-full`}
            ></div>
            {application.status}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AppliedJobs;
