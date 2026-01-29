
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function IndexRedirect() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      router.replace("/login");
    }
  }, [mounted, router]);

  return null;
}
