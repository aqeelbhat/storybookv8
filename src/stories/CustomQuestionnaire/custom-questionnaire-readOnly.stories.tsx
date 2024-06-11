import React from "react";
import { StoryFn } from "@storybook/react";

import { FormDefinitionViewProps, FormDefinitionReadOnlyView } from "../../lib";
import { mockConfig } from "./mock copy";
import { mockConfig2 } from "./mock debug 2";
import { mockCsvFile } from "../mocks/file.mock";
import { draftDocumentList } from "./custom-questionnaire-new.stories";
import { mockDocumentTypeOptions } from "../MultiLevelSelect/mocks";
import { FormDefinitionReadOnlyProps } from "../../lib/CustomFormDefinition/View/FormDefinitionReadOnlyView";
import { questionnaire } from "./mock data";

const itemDiffs = [
  {
    listDiffs: {},
    fieldDiffs: {
      _p_Material_description__p_: {
        changed: true,
        original:
          "Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. ",
      },
    },
    empty: false,
  },
  {
    listDiffs: {},
    fieldDiffs: {
      _p_Material_length__p_: {
        changed: true,
        original: "94773",
      },
      _p_Material_description__p_: {
        changed: true,
        original:
          "Seeking comprehensive technology services to support various business needs, including software development, infrastructure management, cybersecurity, and IT consulting.",
      },
      _p_Conductivity__p_: {
        changed: true,
        original: "94773",
      },
    },
    empty: false,
  },
];

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Custom Form Definition/ReadOnly",
  component: FormDefinitionReadOnlyView,
};

export const TemplateForm = {
  args: {
    id: "id",
    formDefinition: mockConfig,
    isSingleColumnLayout: false,
    // formData: questionnaire.data.data,
    formData: {
      _p_Attachment__p_: {
        filename: "CallbackOutcome (1).csv",
        mediatype: "text/csv",
        size: 293,
        path: "attachment/2022/6/21/192287867161018368/CallbackOutcome (1).csv",
        reference: null,
        date: null,
        expiration: null,
        name: null,
        note: null,
        eid: null,
        asyncPutUrl: null,
        asyncGetUrl: null,
        issueDate: null,
        contentKind: "CustomerPrivate",
      },
      q4__p_Please_provide_the_item_det: {
        items: [
          {
            name: "Baspack",
            data: {
              _p_Conductivity__p_: "75648",
              _p_Material_description__p_:
                "This product is 100% gate garden and which is made india. In this gardening tools set 1 pc eac",
              _p_Material_length__p_: "75648",
              _p_Material_volume__p_: "12345",
              _p_Material_weight__p_: "AC3638",
              _p_Ventilation__p_: "12345",
            },
          },
          {
            name: "Mabas",
            data: {
              _p_Conductivity__p_: "75648",
              _p_Material_description__p_:
                "Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms.",
              _p_Material_length__p_: "75648",
              _p_Material_volume__p_: "12345",
              _p_Material_weight__p_: "AC3638",
              _p_Ventilation__p_: "12345",
            },
          },
          {
            name: "Baspack1",
            data: {
              _p_Conductivity__p_: "75648",
              _p_Material_description__p_:
                "This product is 100% gate garden and which is made india. In this gardening tools set 1 pc eac",
              _p_Material_length__p_: "75648",
              _p_Material_volume__p_: "12345",
              _p_Material_weight__p_: "AC3638",
              _p_Ventilation__p_: "12345",
            },
          },
          {
            name: "Mabas1",
            data: {
              _p_Conductivity__p_: "75648",
              _p_Material_description__p_:
                "Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms.",
              _p_Material_length__p_: "75648",
              _p_Material_volume__p_: "12345",
              _p_Material_weight__p_: "AC3638",
              _p_Ventilation__p_: "12345",
            },
          },
          {
            name: "Baspack3",
            data: {
              _p_Conductivity__p_: "75648",
              _p_Material_description__p_:
                "This product is 100% gate garden and which is made india. In this gardening tools set 1 pc eac",
              _p_Material_length__p_: "75648",
              _p_Material_volume__p_: "12345",
              _p_Material_weight__p_: "AC3638",
              _p_Ventilation__p_: "12345",
            },
          },
          {
            name: "Mabas3",
            data: {
              _p_Conductivity__p_: "75648",
              _p_Material_description__p_:
                "Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms.",
              _p_Material_length__p_: "75648",
              _p_Material_volume__p_: "12345",
              _p_Material_weight__p_: "AC3638",
              _p_Ventilation__p_: "12345",
            },
          },
          {
            name: "Baspack4",
            data: {
              _p_Conductivity__p_: "75648",
              _p_Material_description__p_:
                "This product is 100% gate garden and which is made india. In this gardening tools set 1 pc eac",
              _p_Material_length__p_: "75648",
              _p_Material_volume__p_: "12345",
              _p_Material_weight__p_: "AC3638",
              _p_Ventilation__p_: "12345",
            },
          },
          {
            name: "Mabas4",
            data: {
              _p_Conductivity__p_: "75648",
              _p_Material_description__p_:
                "Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms. Seeking expert technical assistance to optimize and troubleshoot digital marketing campaigns and platforms.",
              _p_Material_length__p_: "75648",
              _p_Material_volume__p_: "12345",
              _p_Material_weight__p_: "AC3638",
              _p_Ventilation__p_: "12345",
            },
          },
        ],
      },
    },
    isQuestionnaire: true,
    documentType: mockDocumentTypeOptions,
    draftDocuments: [],
    options: {
      moneyInTenantCurrency: {
        _p_Enter_Money__p_: {
          amount: 22717.17,
          currency: "USD",
        },
      },
    },
    events: {
      fetchExtensionCustomFormDefinition: () => Promise.resolve(mockConfig2),
    },
    locale: "de-CH",
    loadDocument: () => Promise.resolve(mockCsvFile),
    loadCustomerDocument: () => Promise.resolve(mockCsvFile),
    fetchExtensionCustomFormDefinition: () => Promise.resolve(mockConfig2),
    getItemDiffs: () => Promise.resolve(itemDiffs),
  },
};
