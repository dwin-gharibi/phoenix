import { useEffect, useMemo, useRef, useState } from "react";
import { graphql, useFragment } from "react-relay";
import { useSearchParams } from "react-router";
import { css } from "@emotion/react";

import {
  Flex,
  RichTooltip,
  Text,
  TooltipTrigger,
  TriggerWrap,
} from "@phoenix/components";
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
  const { getExperimentColor } = useExperimentColors();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(compareExperimentIds.length);

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

  const compareExperiments = useMemo(() => {
    return compareExperimentIds.map(
      (experimentId) => idToExperiment[experimentId]
    );
  }, [compareExperimentIds, idToExperiment]);

  // Calculate how many items can fit
  useEffect(() => {
    const calculateVisibleCount = () => {
      if (!containerRef.current || compareExperiments.length === 0) {
        setVisibleCount(compareExperiments.length);
        return;
      }

      const containerWidth = containerRef.current.offsetWidth;
      const minItemWidth = 96; // Minimum width per item
      const gap = 16; // --ac-global-dimension-size-200 is typically 16px
      const moreButtonWidth = 60; // Approximate width for "n more" button

      // Calculate max items that can fit
      const availableWidthForItems = containerWidth - moreButtonWidth - gap;
      const maxVisibleItems = Math.floor(
        availableWidthForItems / (minItemWidth + gap)
      );

      // Show all items if they fit, otherwise show what fits + "more" button
      const canShowAll =
        compareExperiments.length * (minItemWidth + gap) <= containerWidth;
      setVisibleCount(
        canShowAll ? compareExperiments.length : Math.max(1, maxVisibleItems)
      );
    };

    calculateVisibleCount();

    const resizeObserver = new ResizeObserver(calculateVisibleCount);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [compareExperiments.length]);

  if (baseExperimentId == null) {
    return null;
  }

  const visibleExperiments = compareExperiments.slice(0, visibleCount);
  const hiddenExperiments = compareExperiments.slice(visibleCount);
  const hasHiddenExperiments = hiddenExperiments.length > 0;
  const renderExperimentItem = (experiment: Experiment, index: number) => (
    <Flex
      direction="row"
      gap="size-100"
      alignItems="center"
      key={experiment.id}
      css={css`
        flex: 0 1 auto;
        min-width: 96px;
        overflow: hidden;
      `}
    >
      <span
        css={css`
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: ${getExperimentColor(index)};
          display: inline-block;
          flex-shrink: 0;
        `}
      />
      <SequenceNumberToken sequenceNumber={experiment.sequenceNumber} />
      <Text
        css={css`
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
        `}
        title={experiment.name}
      >
        {experiment.name}
      </Text>
    </Flex>
  );

  return (
    <div
      ref={containerRef}
      css={css`
        display: flex;
        gap: var(--ac-global-dimension-size-200);
        overflow: hidden;
        width: 100%;
      `}
    >
      {visibleExperiments.map((experiment, index) =>
        renderExperimentItem(experiment, index)
      )}
      {hasHiddenExperiments && (
        <TooltipTrigger delay={500}>
          <TriggerWrap>
            <Text
              css={css`
                color: var(--ac-global-text-color-900);
                font-size: var(--ac-global-dimension-font-size-75);
                white-space: nowrap;
                cursor: pointer;
                padding: var(--ac-global-dimension-size-50)
                  var(--ac-global-dimension-size-100);
                border-radius: var(--ac-global-rounding-medium);
              `}
            >
              +{hiddenExperiments.length} more
            </Text>
          </TriggerWrap>
          <RichTooltip>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: var(--ac-global-dimension-size-100);
                max-width: 300px;
              `}
            >
              {compareExperiments.map((experiment, index) => (
                <Flex
                  key={experiment.id}
                  direction="row"
                  gap="size-100"
                  alignItems="center"
                >
                  <span
                    css={css`
                      width: 8px;
                      height: 8px;
                      border-radius: 50%;
                      background-color: ${getExperimentColor(index)};
                      display: inline-block;
                      flex-shrink: 0;
                    `}
                  />
                  <SequenceNumberToken
                    sequenceNumber={experiment.sequenceNumber}
                  />
                  <Text>{experiment.name}</Text>
                </Flex>
              ))}
            </div>
          </RichTooltip>
        </TooltipTrigger>
      )}
    </div>
  );
}
