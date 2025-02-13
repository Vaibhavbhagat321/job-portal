import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useCheckUserExists() {
  const user = useSelector<RootState>((state) => state.user.userMail);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) router.push("/");
    else setLoading(false);
  }, [user, router]);

  return loading;
}
