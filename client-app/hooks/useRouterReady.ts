import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useRouterReady() {
  const router = useRouter();
  const [view, setView] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setView(true);
    }
  }, [router]);

  return view;
}
