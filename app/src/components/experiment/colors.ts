import { useCategoryChartColors } from "@phoenix/components/chart";

export function useExperimentColors() {
  const colors = useCategoryChartColors();
  const colorValues = Object.values(colors);
  const numColors = colorValues.length;

  function getExperimentColor(comparisonIndex: number) {
    const index = comparisonIndex % numColors;
    return colorValues[index];
  }

  return {
    getExperimentColor,
    baseExperimentColor: "var(--ac-global-color-grey-700)",
  };
}
