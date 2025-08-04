import { Label, ToggleButton, ToggleButtonGroup } from "@phoenix/components";
import { fieldBaseCSS } from "@phoenix/components/field/styles";

export type ExperimentCompareView = "grid" | "metrics";

/**
 * TypeGuard for the experiment compare view
 */
export function isExperimentCompareView(
  maybeView: unknown
): maybeView is ExperimentCompareView {
  const experimentCompareViews: ExperimentCompareView[] = ["grid", "metrics"];
  return (
    typeof maybeView === "string" &&
    experimentCompareViews.includes(maybeView as ExperimentCompareView)
  );
}

export function ExperimentCompareViewToggle({
  view,
  onViewChange,
}: {
  view: ExperimentCompareView;
  onViewChange: (newView: ExperimentCompareView) => void;
}) {
  return (
    <div css={fieldBaseCSS}>
      <Label>view</Label>
      <ToggleButtonGroup
        aria-label="Toggle between grid and metrics view"
        selectionMode="single"
        selectedKeys={[view]}
        onSelectionChange={(selection) => {
          if (selection.size === 0) {
            return;
          }
          const selectedKey = selection.keys().next().value;
          if (isExperimentCompareView(selectedKey)) {
            onViewChange(selectedKey);
          } else {
            throw new Error(`Unknown experiment compare view: ${selectedKey}`);
          }
        }}
      >
        <ToggleButton aria-label="grid view" id="grid">
          Grid
        </ToggleButton>
        <ToggleButton aria-label="metrics view" id="metrics">
          Metrics
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
