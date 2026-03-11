import { useEffect } from "react";
import { upgradeCTAVariants } from "../data/upgrade-cta-variants";
import { trackUpgradeCTAShown, trackUpgradeCTAClicked } from "../lib/analytics";

interface Props {
  onUpgradeClick: () => void;
}

// Hardcoded to variant 1 for now — PostHog feature flag will select variant in future.
const ACTIVE_VARIANT = upgradeCTAVariants[0];

export function UpgradeCTA({ onUpgradeClick }: Props) {
  useEffect(() => {
    trackUpgradeCTAShown(ACTIVE_VARIANT.id);
  }, []);

  function handleClick() {
    trackUpgradeCTAClicked(ACTIVE_VARIANT.id);
    onUpgradeClick();
  }

  return (
    <div className="print:hidden bg-white border border-zinc-200 rounded-2xl px-6 py-6 space-y-4">
      <div>
        <p className="text-base font-semibold text-zinc-900">{ACTIVE_VARIANT.headline}</p>
        <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{ACTIVE_VARIANT.body}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleClick}
          className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
        >
          {ACTIVE_VARIANT.cta}
        </button>
        <a
          href="/pricing"
          className="px-5 py-2.5 border border-zinc-200 text-zinc-600 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors text-center"
          onClick={(e) => { e.preventDefault(); handleClick(); }}
        >
          See plans →
        </a>
      </div>
    </div>
  );
}
