import { useMemo } from "react";
import { graphql, useFragment } from "react-relay";
import { useSearchParams } from "react-router";
import { css } from "@emotion/react";

import { Flex, Text } from "@phoenix/components";
import { useExperimentColors } from "@phoenix/components/experiment";
import { SequenceNumberToken } from "@phoenix/components/experiment/SequenceNumberToken";

import type {
  ExperimentCompareSelectedExperiments_dataset$data,
  ExperimentCompareSelectedExperiments_dataset$key,
} from "./__generated__/ExperimentCompareSelectedExperiments_dataset.graphql";

type Experiment = NonNullable<
  ExperimentCompareSelectedExperiments_dataset$data["dataset"]["experiments"]
>["edges"][number]["experiment"];

export function ExperimentCompareSelectedExperiments({
  dataRef,
}: {
  dataRef: ExperimentCompareSelectedExperiments_dataset$key;
}) {
  const [searchParams] = useSearchParams();
  const [baseExperimentId = undefined, ...compareExperimentIds] =
    searchParams.getAll("experimentId");
  const { baseExperimentColor, getExperimentColor } = useExperimentColors();
  const data = useFragment<ExperimentCompareSelectedExperiments_dataset$key>(
    graphql`
      fragment ExperimentCompareSelectedExperiments_dataset on Query
      @argumentDefinitions(datasetId: { type: "ID!" }) {
        dataset: node(id: $datasetId) {
          ... on Dataset {
            experiments {
              edges {
                experiment: node {
                  id
                  sequenceNumber
                  name
                }
              }
            }
          }
        }
      }
    `,
    dataRef
  );
  const idToExperiment = useMemo(() => {
    const idToExperiment: Record<string, Experiment> = {};
    data.dataset.experiments?.edges.forEach((edge) => {
      idToExperiment[edge.experiment.id] = edge.experiment;
    });
    return idToExperiment;
  }, [data]);
  if (baseExperimentId == null) {
    return null;
  }
  const baseExperiment = idToExperiment[baseExperimentId];
  const compareExperiments = compareExperimentIds.map(
    (experimentId) => idToExperiment[experimentId]
  );
  return (
    <Flex direction="row" gap="size-200">
      {[baseExperiment, ...compareExperiments].map((experiment) => (
        <Flex direction="row" gap="size-100" key={experiment.id}>
          <SequenceNumberToken
            sequenceNumber={experiment.sequenceNumber}
            color={
              baseExperimentId === experiment.id
                ? baseExperimentColor
                : getExperimentColor(experiment.sequenceNumber)
            }
          />
          <Text
            css={css`
              white-space: nowrap;
              max-width: var(--ac-global-dimension-size-2000);
              overflow: hidden;
              text-overflow: ellipsis;
            `}
          >
            {experiment.name}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
