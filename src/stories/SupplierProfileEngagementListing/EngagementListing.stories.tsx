import React from "react";
import { StoryFn } from "@storybook/react";
import {
  ApplicationMode,
  RibbonView,
  SupplierEngagementListing,
} from "../../lib";
import { EngagementListingProps } from "../../lib/SupplierProfileEngagementListing/engagement-listing.component";
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

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/SupplierDetails/EngagementListing",
  component: SupplierEngagementListing,
};

export const ProcessMarketingProject = {
  args: {
    data: marketingProject,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.engagementList,
    isEngagementCreationInProgress: false,
  },
};

export const ProcessSupplierUpdate = {
  args: {
    data: supplierUpdate,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.supplierProfile,
    isEngagementCreationInProgress: false,
  },
};

export const ProcessOnboarding = {
  args: {
    data: onboarding,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.engagementList,
    isEngagementCreationInProgress: false,
  },
};

export const ProcessSoftwarePurchase = {
  args: {
    data: softwarePurchase,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.engagementDetails,
    isEngagementCreationInProgress: false,
  },
};

export const ProcessDraft = {
  args: {
    data: draftEngagement,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.engagementList,
    isEngagementCreationInProgress: false,
  },
};

export const ProcurmentIntake = {
  args: {
    data: PROCUREMENT_INTAKE,
    currentApp: ApplicationMode.runner,
    currentView: RibbonView.engagementList,
    isEngagementCreationInProgress: false,
  },
};

export const EBITProcess = {
  args: {
    data: EBIT,
    currentApp: ApplicationMode.supplier,
    currentView: RibbonView.supplierProfile,
    isEngagementCreationInProgress: false,
  },
};

export const ENABLERProcess = {
  args: {
    data: ENABLER,
    currentApp: ApplicationMode.supplier,
    currentView: RibbonView.supplierProfile,
    isEngagementCreationInProgress: false,
  },
};
