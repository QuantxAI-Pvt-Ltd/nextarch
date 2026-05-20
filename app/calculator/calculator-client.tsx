"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PaywallPopup } from "@/components/PaywallPopup";

// Formula Components
import Windowcalculations from "./formulas/windowcalculations";
import Volumeofairheatgain from "./formulas/volumeofairheatgain";
import Voaqwqtforce from "./formulas/volumeofairqw+qtforces";
import Qfromach from "./formulas/qfromach";
import Byelement from "./formulas/byelement";
import SolarHeatGain from "./formulas/solarheatgain";

interface UsageData {
  trialActive: boolean;
  trialDaysLeft: number;
  plan: string | null;
  planActive: boolean;
  hasAccess: boolean;
}

function CalculatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "window-calculations";

  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const res = await fetch("/api/usage");
      if (res.status === 401) {
        // Not logged in — send to login
        router.push("/login");
        return;
      }
      if (res.ok) {
        const data: UsageData = await res.json();
        setUsageData(data);
      }
    }
    checkAccess();
  }, [router]);

  const renderCalculator = () => {
    switch (mode) {
      case "window-calculations":   return <Windowcalculations />;
      case "volume-heat-gain":      return <Volumeofairheatgain />;
      case "volume-forces":         return <Voaqwqtforce />;
      case "q-from-ach":            return <Qfromach />;
      case "by-element":            return <Byelement />;
      case "solar-heat-gain":       return <SolarHeatGain />;
      default:                      return <Windowcalculations />;
    }
  };

  const showHardPaywall = usageData && !usageData.hasAccess;
  const showWarningBanner =
    !bannerDismissed &&
    usageData?.trialActive &&
    !usageData?.plan &&
    usageData?.trialDaysLeft <= 2;

  return (
    <div className="animate-in fade-in duration-500" style={{ position: "relative" }}>
      {/* Warning banner (1–2 days left) */}
      {showWarningBanner && (
        <PaywallPopup
          trialDaysLeft={usageData!.trialDaysLeft}
          plan={usageData!.plan}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      {/* Calculator content — always rendered but blocked if paywalled */}
      {renderCalculator()}

      {/* Hard paywall overlay */}
      {showHardPaywall && (
        <PaywallPopup
          trialDaysLeft={0}
          plan={null}
        />
      )}
    </div>
  );
}

export default function CalculatorClient() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading calculator...</div>}>
      <CalculatorContent />
    </Suspense>
  );
}
