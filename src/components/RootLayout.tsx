"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useTreasureHuntStore from "@/hooks/useTreasureHuntStore";

import { Toaster } from "sonner";
import GridContainer from "@/components/GridContainer/GridContainer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // const router = useRouter();
  // const hasHydrated = useTreasureHuntStore.persist?.hasHydrated();
  // const currentQuestionStage = useTreasureHuntStore((state) => state.currentQuestionStage);
  // const teamId = useTreasureHuntStore((state) => state.teamId);

  // useEffect(() => {
  //   if (!hasHydrated) return;

  //   console.log("Hydrated. Running route checks...");
  //   if ((currentQuestionStage < 0 || currentQuestionStage > 0)) {
  //     router.replace(`/${teamId}/question/q${currentQuestionStage}`);
  //   }
  // }, [hasHydrated, currentQuestionStage, teamId, router]);

  return (
    <html lang="en">
      <body>
        <GridContainer>{children}</GridContainer>
        <Toaster position="top-right" richColors duration={1200} />
      </body>
    </html>
  );
}
