import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  OrbeonFormRunner,
  OrbeonFormRunnerProps,
} from "./../../lib/OrbeonFormRunner";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Orbeon Form Runner",
  component: OrbeonFormRunner,
};

export const Default = {
  args: {
    resourcePath: "/buyer/eform",
    baselineJsUrl:
      "http://localhost:3000/form/authInit/initRequest?uri=/buyer/eform/xforms-server/baseline.js?updates=fr&Authorization=eyJraWQiOiJra1cxOTNFZWd5MGRWMHI4WWxjWVZLQ2lVNENETkEzNDQycU5BV00rR2FZPSIsImFsZyI6IlJTMjU2In0.eyJjdXN0b206aWRwIjoidXMtd2VzdC0yOjcxZWQ1NjE2LTU0MjMtNDE0Yy1hYmQ1LTBjMWM0YjJkODcwZSIsInN1YiI6IjQ0NjNmNmYxLWI5N2EtNDMxZC1hNDI3LTQxYTQzYjFkODY2YiIsImN1c3RvbTp0aWVyIjoic2ltcGxlIiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfaUt1b0U0MzdTIiwiY29nbml0bzp1c2VybmFtZSI6ImpvaG5AZm9vLmNvbSIsImN1c3RvbTp0ZW5hbnRfaWQiOiJmb28iLCJnaXZlbl9uYW1lIjoiSm9obiIsImF1ZCI6IjNpamVzbmRiNWk3ZjFnazdsdXNxbGZ0Mzg4IiwiZXZlbnRfaWQiOiI5NTljN2U5Yy1kODBiLTQ1NGEtYTEzYy03ZDRhZGZmOTRiZDYiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYyMjQ2NDUyNCwiZXhwIjoxNjIyNDY4MTI0LCJjdXN0b206dXNlcl90eXBlIjoiVGVuYW50IiwiaWF0IjoxNjIyNDY0NTI0LCJmYW1pbHlfbmFtZSI6IkRvZSIsImVtYWlsIjoiam9obkBmb28uY29tIn0.FDpt0ImtDSsSR5IDyKYNRBBzoCHMnFkj94-ZrM0_VTxAK_k7GpJoZk8KQIr6ErR65utRAWt7C6_v46E7eGaPyIRocw9bIxgHPKtsSyvirBI0nfEt6G631z5DAA7zHKCUTWElCADnZYMf5ZNqEdTYLxpEKuSl_Ial0p5hm-ki7kIjQ_9KjF581Fthi7Hk8q5z5MxI4-fY_3xfP9GRRDiuv-ZHChKOhYLTLiYjZPotmF5nJgcfNlVKDBcTdXXsyb96S0IzReBtXZR6dmXYG-AFUiZY0NZJ5rVTjsykskrci8rpWpon4ICewV65l1CqS3krliC4HUwCQTbTZuDt32lJqg",
    tenantId: "foo",
    formId: "rohit-form-04",
    mode: "new",
  },
};
