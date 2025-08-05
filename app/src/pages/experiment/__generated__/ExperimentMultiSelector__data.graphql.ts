/**
 * @generated SignedSource<<bd9084c16cb22f8e2100e9d0e64c9e1f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ExperimentMultiSelector__data$data = {
  readonly baseExperiment?: {
    readonly id?: string;
    readonly name?: string;
    readonly sequenceNumber?: number;
  };
  readonly dataset: {
    readonly experiments?: {
      readonly edges: ReadonlyArray<{
        readonly experiment: {
          readonly createdAt: string;
          readonly id: string;
          readonly name: string;
          readonly sequenceNumber: number;
        };
      }>;
    };
    readonly id: string;
    readonly name?: string;
  };
  readonly " $fragmentType": "ExperimentMultiSelector__data";
};
export type ExperimentMultiSelector__data$key = {
  readonly " $data"?: ExperimentMultiSelector__data$data;
  readonly " $fragmentSpreads": FragmentRefs<"ExperimentMultiSelector__data">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sequenceNumber",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "baseExperimentId"
    },
    {
      "kind": "RootArgument",
      "name": "datasetId"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "hasBaseExperiment"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ExperimentMultiSelector__data",
  "selections": [
    {
      "alias": "dataset",
      "args": [
        {
          "kind": "Variable",
          "name": "id",
          "variableName": "datasetId"
        }
      ],
      "concreteType": null,
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "InlineFragment",
          "selections": [
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "ExperimentConnection",
              "kind": "LinkedField",
              "name": "experiments",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "ExperimentEdge",
                  "kind": "LinkedField",
                  "name": "edges",
                  "plural": true,
                  "selections": [
                    {
                      "alias": "experiment",
                      "args": null,
                      "concreteType": "Experiment",
                      "kind": "LinkedField",
                      "name": "node",
                      "plural": false,
                      "selections": [
                        (v0/*: any*/),
                        (v1/*: any*/),
                        (v2/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "createdAt",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "type": "Dataset",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "condition": "hasBaseExperiment",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": "baseExperiment",
          "args": [
            {
              "kind": "Variable",
              "name": "id",
              "variableName": "baseExperimentId"
            }
          ],
          "concreteType": null,
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "kind": "InlineFragment",
              "selections": [
                (v0/*: any*/),
                (v2/*: any*/),
                (v1/*: any*/)
              ],
              "type": "Experiment",
              "abstractKey": null
            }
          ],
          "storageKey": null
        }
      ]
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "8ae94df379f9fa6a13c88d71507b709c";

export default node;
