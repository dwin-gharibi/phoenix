import { css } from "@emotion/react";

import {
  Icon,
  Icons,
  Text,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  TooltipTrigger,
  View,
} from "@phoenix/components";

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
    <ToggleButtonGroup
      css={css`
        flex-basis: fit-content;
      `}
      selectedKeys={[view]}
      selectionMode="single"
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
      size="M"
    >
      <TooltipTrigger delay={100}>
        <ToggleButton id="grid" leadingVisual={<Icon svg={<Icons.Grid />} />} />
        <Tooltip offset={10}>
          <View
            padding="size-100"
            backgroundColor="light"
            borderColor="dark"
            borderWidth="thin"
            borderRadius="small"
          >
            <Text>View experiment runs in a grid</Text>
          </View>
        </Tooltip>
      </TooltipTrigger>
      <TooltipTrigger delay={100}>
        <ToggleButton
          id="metrics"
          leadingVisual={<Icon svg={<Icons.ListOutline />} />}
        />
        <Tooltip offset={10}>
          <View
            padding="size-100"
            backgroundColor="light"
            borderColor="dark"
            borderWidth="thin"
            borderRadius="small"
          >
            <Text>View experiment metrics</Text>
          </View>
        </Tooltip>
      </TooltipTrigger>
    </ToggleButtonGroup>
  );
}
