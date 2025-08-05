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

export type ExperimentCompareViewMode = "grid" | "metrics";

/**
 * TypeGuard for the experiment compare view mode
 */
export function isExperimentCompareViewMode(
  maybeViewMode: unknown
): maybeViewMode is ExperimentCompareViewMode {
  const experimentCompareViewModes: ExperimentCompareViewMode[] = [
    "grid",
    "metrics",
  ];
  return (
    typeof maybeViewMode === "string" &&
    experimentCompareViewModes.includes(
      maybeViewMode as ExperimentCompareViewMode
    )
  );
}

export function ExperimentCompareViewModeToggle({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ExperimentCompareViewMode;
  onViewModeChange: (newView: ExperimentCompareViewMode) => void;
}) {
  return (
    <ToggleButtonGroup
      css={css`
        flex-basis: fit-content;
      `}
      selectedKeys={[viewMode]}
      selectionMode="single"
      onSelectionChange={(selection) => {
        if (selection.size === 0) {
          return;
        }
        const selectedKey = selection.keys().next().value;
        if (isExperimentCompareViewMode(selectedKey)) {
          onViewModeChange(selectedKey);
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
