
"use client";

import { useSession } from "next-auth/react";
import { SignIn } from "./components/sign-in";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>กำลังตรวจสอบสถานะ...</div>;
  }

  if (status === "authenticated") {
    return <div>กำลังไปหน้า Dashboard...</div>;
  }

  return <SignIn />;
}
