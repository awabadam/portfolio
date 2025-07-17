"use client";

import { useEffect } from "react";
import { GA4_TRACKING_ID, initGA4 } from "@/lib/ga4";

export default function GoogleAnalytics() {
  useEffect(() => {
    // Initialize GA4
    initGA4();
  }, []);

  return null;
}
