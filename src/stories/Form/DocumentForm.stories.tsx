import React from "react";
import { StoryFn } from "@storybook/react";

import { DocumentForm, DocumentFormProps, DocumentFormData } from "./../../lib";
import {
  mockOptionsDefault,
  mockOptionsRegion,
} from "./../MultiLevelSelect/mocks";

const formData: DocumentFormData = {
  type: null,
  name: "",
  startDate: "",
  endDate: "",
  attachment: null,
  owner: {
    id: "id1",
    path: "option1",
    displayName: "Option 1",
    customData: {
      user: {
        tenantId: "foo",
        userName: "john@foo.com",
        givenName: "John",
        familyName: "Doe",
        userType: "Tenant",
        email: "john@foo.com",
        picture:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAApBJREFUaEPtl1tIFFEcxr/ZVttFW2SrxaUtQVtvtaaFDSVW0mWTejD0KYIiQgoyiqA3ieihgsIu9FDUUyJFD5F02W5IpSVRG5GUVrgF5lrqtMle3Nmd3ZgprIUgODOHnY0zbzPw/5/v+37/cw7DHetsTuI/eDhmRGcUGRGdAQEjwohQSoCNFqVgidsyIsTRUSpkRCgFS9yWESGOjlIhI0IpWOK2mhApsS8Bx3EpIgKhUeTlzE75NhERMPzNB0D7n1JNjKx1bUbFvBpMMxiRSEp4M/QMg1/7UFfeiBlmq2JGCH3BdKMJ2UYz4pIIITgCz6t2jAf9xBT+LNTEiNywiW9BoW0hhoT36Og5rqxRaHOhid8NMR7Bydt7f63LYUVZA/j5biSTCVztPY1PY/2qzWhmpL5yK1xzl2PA78X15+cUYTaLA9tWtiIaC+OUZ1+K2EUFtXBXbFHG7PyDVgTCo6rMpM2IrHpH3SFYc/Px5N1NdA90Zq6RDVXbscDBwx/w4dLjo5lrZJmzHrWlDYiIQZy5sz9zjWyq3gVnfqVyJLd3ZzCRnWuOwGK2oveDB4/eXtMXEa+vC/f7Lv/z1FpV3oilReswGQvh7N0DkBLx9BmxmGeiefVhvPz4ELmmPJTYF+PK07ape0HeyPKGjklRtN3aA1NWDsrmVKPYXoWCWaWK+AtdB/E9PKbKhFys6vjNNprQ4j4xdaP3D7/ADe9FRVRN8UbwzvUwGrKUd/nGN3AGxCQRoegEPguDuPe6A2J8UrUJ1UZ+KuDgsBZhPDiinD7pelQRSZfov63LjOiJhkZ7RB+W2Gjpg8NvFYwII0IpATZalIIlbsuIEEdHqZARoRQscVtGhDg6SoWMCKVgidv+ADGJdYI2XnkYAAAAAElFTkSuQmCC",
      },
    },
    selectable: true,
  },
  notes: "",
};

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Form/Document Form",
  component: DocumentForm,
};

export const TemplateForm = {
  args: {
    documentTypeOptions: mockOptionsDefault,
    ownerOptions: mockOptionsRegion,
    formData,
    submitLabel: "Submit",
  },
};
