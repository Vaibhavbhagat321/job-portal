"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { RootState } from "@/lib/redux/store";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";

const JobApply = () => {
  const { id } = useParams();
  const [formData, setformData] = useState({
    name: "",
    resume: "",
  });
  const [loading, setLoading] = useState(false);
  const mail = useSelector<RootState>((state) => state.user.userMail);

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, id, mail }),
      });
      const data = await res.json();
      if (data.status === 201) {
        toast({
          title: "Applied!",
          description: data.message,
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
        title: "Unknown Error Occured!",
      });
    }
    setLoading(false);
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Apply : {id}</h2>
      <Card>
        <CardContent className="pt-4">
          <form onSubmit={onSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">
                  Full Name{" "}
                  <span className="text-slate-400">
                    ({formData.name.length}/30)
                  </span>
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Full Name"
                  value={formData.name}
                  onChange={onInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="resume">
                  Resume Link{" "}
                  <span className="text-slate-400">
                    ({formData.name.length}/300)
                  </span>
                </Label>
                <Input
                  type="text"
                  id="resume"
                  name="resume"
                  placeholder="Enter Your Resume Link"
                  value={formData.resume}
                  onChange={onInputChange}
                  required
                />
              </div>
              <div className="flex flex-row space-x-1.5">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="animate-spin"></Loader2>}
                  Apply
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApply;
