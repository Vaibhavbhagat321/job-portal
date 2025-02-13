"use client";

import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { logout } from "@/lib/redux/slice/userSlice";

const Aside = () => {
  const userType = useSelector<RootState>((state) => state.user.userType);

  const dispatch = useDispatch();

  function onLogout() {
    dispatch(logout());
  }

  return (
    <aside className="flex flex-col border-r shadow-sm h-full w-[22%] border p-2">
      <div className="h-2/5 w-full flex flex-col justify-center items-center">
        <Image src={"/logo.png"} alt="logo" width="100" height="100" />
        <h1 className="text-xl font-semibold mt-3 text-slate-800">
          Job Portal
        </h1>
      </div>
      <div className="h-3/5 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${userType}/jobs`}>Jobs</Link>
          </Button>
          {userType === "candidate" && (
            <Button variant="outline" asChild>
              <Link href={`/${userType}/jobs/applied`}>Applied Jobs</Link>
            </Button>
          )}
          {userType === "company" && (
            <Button variant="outline" asChild>
              <Link href={`/${userType}/jobs/new`}>Create New Job</Link>
            </Button>
          )}
        </div>
        <div>
          <Button className="w-full" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Aside;
