"use client";

import React, { ReactNode } from "react";
import Aside from "@/components/ui/aside";
import useCheckUserExists from "@/hooks/useCheckUserExists";
import Loader from "@/components/ui/loader";

const Candidatelayout = ({ children }: { children: ReactNode }) => {
  const loading = useCheckUserExists();

  if (loading) return <Loader />;

  return (
    <main className="flex flex-row h-full w-full">
      <Aside />
      <section className="h-full w-[78%] p-10 flex flex-col justify-start items-center overflow-y-scroll">
        {children}
      </section>
    </main>
  );
};

export default Candidatelayout;
