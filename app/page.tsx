"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SyntheticEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/redux/slice/userSlice";
import useCheckUserExists from "@/hooks/useCheckUserExists";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  useCheckUserExists();

  const [userType, setUserType] = useState<string>("");
  const [userMail, setUserMail] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  function onEnter(e: SyntheticEvent) {
    setLoading(true);
    e.preventDefault();
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(userMail)) {
      setErrMsg("Enter valid Email");
      setTimeout(() => {
        setErrMsg("");
      }, 3000);
      return;
    }
    dispatch(setUser({ userType, userMail }));

    const navigate =
      userType === "company" ? "/company/jobs" : "/candidate/jobs";
    setLoading(false);
    redirect(navigate);
  }

  return (
    <main className="flex justify-center items-center w-full h-full bg-slate-50 text-slate-950">
      {!userType && (
        <div className="flex flex-col justify-center items-center gap-6">
          <h1 className="text-4xl font-bold">Who are you ?</h1>
          <div className="flex flex-col gap-3 w-full">
            <Button className="w-full" onClick={() => setUserType("company")}>
              Company
            </Button>
            <Button onClick={() => setUserType("candidate")}>Candidate</Button>
          </div>
        </div>
      )}

      {userType && (
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold">Enter you mail...</h1>
          <form
            onSubmit={onEnter}
            className="flex flex-col justify-center items-center"
          >
            <div className="w-full mb-1">
              <Input
                className="border border-slate-700"
                type="email"
                value={userMail}
                onChange={(e) => setUserMail(e.target.value)}
                maxLength={50}
                required
              />
              <span className="text-xs text-red-600">&nbsp;{errMsg}</span>
            </div>
            <div className="flex gap-3 w-full">
              <Button
                className="w-full"
                type="button"
                onClick={() => setUserType("")}
                disabled={loading}
              >
                Back
              </Button>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Enter
              </Button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
