import React from "react";
import { StoryFn } from "@storybook/react";

import {
  marketingProject,
  supplierUpdate,
  onboarding,
  softwarePurchase,
  draftEngagement,
  EBIT,
  ENABLER,
  PROCUREMENT_INTAKE,
} from "../mocks/engagements";

import { ApplicationMode, EngagementMobileRibbon, RibbonView } from "../../lib";
import { EngagementRibbonProps } from "../../lib/SupplierProfileEngagementListing/engagement-listing.component";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/EngagementMobileRibbon/EngagementMobileRibbon",
  component: EngagementMobileRibbon,
};

export const MarketingTemplate = {
  args: {
    engagement: marketingProject,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.supplierProfile,
    isEngagementCreationInProgress: false,
  },
};

export const SupplierTemplate = {
  args: {
    engagement: supplierUpdate,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.supplierProfile,
    isEngagementCreationInProgress: false,
  },
};

export const OnboardingTemplate = {
  args: {
    engagement: onboarding,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.supplierProfile,
    isEngagementCreationInProgress: false,
  },
};

export const SoftwarePurchaseTemplate = {
  args: {
    engagement: softwarePurchase,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.supplierProfile,
    isEngagementCreationInProgress: false,
  },
};

export const DraftEngagementTemplate = {
  args: {
    engagement: draftEngagement,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.supplierProfile,
    isEngagementCreationInProgress: false,
  },
};

export const EbitTemplate = {
  args: {
    engagement: EBIT,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.supplierProfile,
    isEngagementCreationInProgress: false,
  },
};

export const EnablerTemplate = {
  args: {
    engagement: ENABLER,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.supplierProfile,
    isEngagementCreationInProgress: false,
  },
};

export const ProcurementIntakeTemplate = {
  args: {
    engagement: PROCUREMENT_INTAKE,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.supplierProfile,
    isEngagementCreationInProgress: false,
  },
};
