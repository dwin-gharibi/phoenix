import { useCategoryChartColors } from "@phoenix/components/chart";

export function useExperimentColors() {
  const colors = useCategoryChartColors();
  const colorValues = Object.values(colors);
  const numColors = colorValues.length;

  function getExperimentColor(sequenceNumber: number) {
    const index = (sequenceNumber - 1) % numColors;
    return colorValues[index];
  }
  return { getExperimentColor };
}
