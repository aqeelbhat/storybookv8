import React, { useState } from "react";
import { Meta } from "@storybook/react";
import { OroButton } from "../../../lib";
import OroAnimator from "../../../lib/controls/OroAnimator";

export default {
  title: "ORO UI Toolkit/Molecules/ORO Animator",
  component: OroAnimator,
} as Meta<typeof OroAnimator>;

function Usage(props) {
  const [showMeWithDelay, setShowMe] = useState(false);
  const [showMeWithoutDelay, setShowMeWithoutDelay] = useState(false);
  return (
    <>
      <div>
        <h1>Show/Hide with Delay</h1>
        <OroAnimator show={!showMeWithDelay} withDelay>
          <div>Hey there, I am visible and other guy is visible.</div>
        </OroAnimator>
        <OroAnimator show={showMeWithDelay} withDelay>
          <div>Hello, that guy is hidden now and I am here to serve you!</div>
        </OroAnimator>
        <OroButton
          label="Click here "
          onClick={() => {
            setShowMe((value) => !value);
          }}
        />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <h1>Show/Hide without delay</h1>
        <OroAnimator show={!showMeWithoutDelay}>
          <div>Hey there, I am visible and other guy is visible.</div>
        </OroAnimator>
        <OroAnimator show={showMeWithoutDelay}>
          <div>Hello, that guy is hidden now and I am here to serve you!</div>
        </OroAnimator>
        <OroButton
          label="Click here "
          onClick={() => {
            setShowMeWithoutDelay((value) => !value);
          }}
        />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>Use StoryBook controls</h1>
      <OroAnimator {...props}>
        <div>Hey there, I am visible and other guy is visible.</div>
      </OroAnimator>
      <OroAnimator {...props} show={!props.show}>
        <div>Hey there, I am visible and other guy is visible.</div>
      </OroAnimator>
    </>
  );
}
export const Show_hide_Animator = {
  render: (args) => <Usage {...args} />,
};
