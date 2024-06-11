import React from "react";
import { Check, MoreHorizontal, X } from "react-feather";
import { OroButton } from "../../lib";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Atoms/button",
  component: OroButton,
};

export const PrimaryButtonSmall = {
  args: {
    label: "Approve",
    type: "primary",
    size: "small",
  },
};

export const PrimaryButton = {
  args: {
    label: "Approve",
    type: "primary",
  },
};

export const PrimaryButtonWithIcon = {
  args: {
    label: "Approve",
    type: "primary",
    icon: <Check size={20} color="#ffffff" />,
  },
};

export const SecondaryButton = {
  args: {
    label: "Secondary",
    type: "secondary",
  },
};

export const AlertButton = {
  args: {
    label: "Alert",
    type: "alert",
  },
};

export const AlertButtonWithIcon = {
  args: {
    label: "Alert",
    type: "alert",
    icon: <X size={20} color="#ffffff" />,
  },
};

export const LinkButton = {
  args: {
    label: "Link",
    type: "link",
  },
};

export const DefaultButton = {
  args: {
    label: "Default",
    type: "default",
  },
};

export const DefaultButtonWithIconOnly = {
  args: {
    type: "default",
    icon: <MoreHorizontal size={20} color="#262626" />,
  },
};
