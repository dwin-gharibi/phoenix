import { startTransition, useCallback, useMemo, useState } from "react";
import { graphql, useFragment } from "react-relay";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import invariant from "tiny-invariant";
import { css } from "@emotion/react";

import { Switch } from "@arizeai/components";

import { Alert, Flex, Text, View } from "@phoenix/components";
import { useExperimentColors } from "@phoenix/components/experiment";
import {
  ExperimentCompareView,
  ExperimentCompareViewToggle,
  isExperimentCompareView,
} from "@phoenix/components/experiment/ExperimentCompareViewToggle";
import { SequenceNumberToken } from "@phoenix/components/experiment/SequenceNumberToken";
import { useFeatureFlag } from "@phoenix/contexts/FeatureFlagsContext";
import { experimentCompareLoader } from "@phoenix/pages/experiment/experimentCompareLoader";
import { assertUnreachable } from "@phoenix/typeUtils";

import type {
  ExperimentComparePage_selectedExperiments$data,
  ExperimentComparePage_selectedExperiments$key,
} from "./__generated__/ExperimentComparePage_selectedExperiments.graphql";
import { ExperimentCompareGridPage } from "./ExperimentCompareGridPage";
import { ExperimentCompareMetricsPage } from "./ExperimentCompareMetricsPage";
import { ExperimentMultiSelector } from "./ExperimentMultiSelector";

export function ExperimentComparePage() {
  const loaderData = useLoaderData<typeof experimentCompareLoader>();
  const showModeSelect = useFeatureFlag("experimentEnhancements");
  invariant(loaderData, "loaderData is required on ExperimentComparePage");
  // The text of most IO is too long so default to showing truncated text
  const [displayFullText, setDisplayFullText] = useState(false);
  const { datasetId } = useParams();
  invariant(datasetId != null, "datasetId is required");
  const [searchParams] = useSearchParams();
  const [baseExperimentId = undefined, ...compareExperimentIds] =
    searchParams.getAll("experimentId");
  const view = useMemo(() => {
    const view = searchParams.get("view");
    if (isExperimentCompareView(view)) {
      return view;
    }
    return "grid";
  }, [searchParams]);
  const navigate = useNavigate();

  const onViewChange = useCallback(
    (view: ExperimentCompareView) => {
      searchParams.set("view", view);
      navigate(`/datasets/${datasetId}/compare?${searchParams.toString()}`);
    },
    [datasetId, navigate, searchParams]
  );

  return (
    <main
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      `}
    >
      <View
        padding="size-200"
        borderBottomColor="dark"
        borderBottomWidth="thin"
        flex="none"
      >
        <Flex direction="row" justifyContent="space-between" alignItems="end">
          <ExperimentMultiSelector
            dataRef={loaderData}
            selectedBaseExperimentId={baseExperimentId}
            selectedCompareExperimentIds={compareExperimentIds}
            onChange={(newBaseExperimentId, newCompareExperimentIds) => {
              startTransition(() => {
                if (newBaseExperimentId == null) {
                  navigate(`/datasets/${datasetId}/compare`);
                } else {
                  searchParams.delete("experimentId");
                  [newBaseExperimentId, ...newCompareExperimentIds].forEach(
                    (experimentId) => {
                      searchParams.append("experimentId", experimentId);
                    }
                  );
                  navigate(
                    `/datasets/${datasetId}/compare?${searchParams.toString()}`
                  );
                }
              });
            }}
          />
          <div
            css={css`
              flex: 1;
              padding-left: var(--ac-global-dimension-size-200);
              padding-right: var(--ac-global-dimension-size-200);
              padding-bottom: var(--ac-global-dimension-size-100);
            `}
          >
            <SelectedExperiments dataRef={loaderData} />
          </div>
          <Flex direction="row" gap="size-275" alignItems="end">
            <View paddingBottom="size-75">
              <Switch
                onChange={(isSelected) => {
                  setDisplayFullText(isSelected);
                }}
                defaultSelected={false}
                labelPlacement="start"
              >
                Full Text
              </Switch>
            </View>
            {showModeSelect && (
              <ExperimentCompareViewToggle
                view={view}
                onViewChange={onViewChange}
              />
            )}
          </Flex>
        </Flex>
      </View>
      {baseExperimentId == null ? (
        <View padding="size-200">
          <Alert variant="info" title="No Base Experiment Selected">
            Please select a base experiment.
          </Alert>
        </View>
      ) : (
        <ExperimentComparePageContent
          view={view}
          displayFullText={displayFullText}
        />
      )}
    </main>
  );
}

type ExperimentComparePageContentProps = {
  view: ExperimentCompareView;
  displayFullText: boolean;
};

function ExperimentComparePageContent({
  view,
  displayFullText,
}: ExperimentComparePageContentProps) {
  if (view === "grid") {
    return <ExperimentCompareGridPage displayFullText={displayFullText} />;
  } else if (view === "metrics") {
    return <ExperimentCompareMetricsPage />;
  }
  assertUnreachable(view);
}

type Experiment = NonNullable<
  ExperimentComparePage_selectedExperiments$data["dataset"]["experiments"]
>["edges"][number]["experiment"];

function SelectedExperiments({
  dataRef,
}: {
  dataRef: ExperimentComparePage_selectedExperiments$key;
}) {
  const [searchParams] = useSearchParams();
  const [baseExperimentId = undefined, ...compareExperimentIds] =
    searchParams.getAll("experimentId");
  const { baseExperimentColor, getExperimentColor } = useExperimentColors();
  const data = useFragment<ExperimentComparePage_selectedExperiments$key>(
    graphql`
      fragment ExperimentComparePage_selectedExperiments on Query
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
  }, [data.dataset.experiments?.edges]);
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
          <Text>{experiment.name}</Text>
        </Flex>
      ))}
    </Flex>
  );
}
