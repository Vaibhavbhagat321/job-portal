"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/lib/redux/store";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CompanyNewJob = () => {
  const [formData, setFormData] = useState({
    job_title: "",
    job_description: "",
    company_name: "",
    job_location: "",
  });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const userMail = useSelector<RootState>((state) => state.user.userMail);
  const { toast } = useToast();

  const searchParams = useSearchParams();

  const editId = searchParams.get("edit");

  useEffect(() => {
    if (editId) {
      async function getJob() {
        setIsFetching(true);
        const res = await fetch(`/api/jobs/${editId}`);
        const job = await res.json();
        setFormData({
          job_title: job.job.title,
          job_description: job.job.description,
          company_name: job.job.company,
          job_location: job.job.location,
        });
        setIsFetching(false);
      }

      getJob();
    } else {
      setFormData({
        job_title: "",
        job_description: "",
        company_name: "",
        job_location: "",
      });
    }
  }, [editId]);

  function onReset() {
    setFormData({
      job_title: "",
      job_description: "",
      company_name: "",
      job_location: "",
    });
  }

  function onInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let res;

      if (editId) {
        res = await fetch(`/api/jobs/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch(`/api/jobs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, company_mail: userMail }),
        });
      }
      const data = await res.json();

      if (data.status === 201 || data.status === 200) {
        toast({
          title: data.message,
          description: data.job.title,
        });
        onReset();
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

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Create New Job</h2>
      <Card>
        <CardContent className="pt-4">
          <form onSubmit={onFormSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="job_title">
                  Job Title{" "}
                  <span className="text-slate-400">
                    ({formData.job_title.length}/50)
                  </span>
                </Label>
                <Input
                  type="text"
                  id="job_title"
                  name="job_title"
                  placeholder="Enter Job Title"
                  value={formData.job_title}
                  onChange={onInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="job_description">
                  Job Description{" "}
                  <span className="text-slate-400">
                    ({formData.job_description.length}/500)
                  </span>
                </Label>
                <Textarea
                  id="job_description"
                  name="job_description"
                  placeholder="Enter Job Description"
                  className="resize-none"
                  value={formData.job_description}
                  onChange={onInputChange}
                  rows={4}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="company_name">
                  Company Name{" "}
                  <span className="text-slate-400">
                    ({formData.company_name.length}/30)
                  </span>
                </Label>
                <Input
                  type="text"
                  id="company_name"
                  name="company_name"
                  placeholder="Enter Company Name"
                  value={formData.company_name}
                  onChange={onInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="job_location">
                  Job Location{" "}
                  <span className="text-slate-400">
                    ({formData.job_location.length}/30)
                  </span>
                </Label>
                <Input
                  type="text"
                  id="job_location"
                  name="job_location"
                  placeholder="Enter Job Location"
                  value={formData.job_location}
                  onChange={onInputChange}
                  required
                />
              </div>
              <div className="flex flex-row space-x-1.5">
                <Button
                  onClick={onReset}
                  type="reset"
                  variant={`outline`}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />}
                  {editId ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyNewJob;
