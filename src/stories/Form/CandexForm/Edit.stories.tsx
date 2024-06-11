import React from "react";
import { StoryFn } from "@storybook/react";
import {
  PaymentProviderConfirmationForm,
  PaymentProviderConfirmationProps,
  getI18NInstance,
} from "../../../lib";
import { DEFAULT_CURRENCY } from "../../../lib/util";
import {
  mockCategory,
  mockCurrencyOptions,
} from "../../MultiLevelSelect/mocks";

export default {
  title: "ORO UI Toolkit/Form/Candex Form",
  component: PaymentProviderConfirmationForm,
};

getI18NInstance(true);

export const Edit = {
  args: {
    formData: {
      buyerChannelDetails: {
        ref: { id: "", name: "Candex" },
        description:
          "Candex is your fintech master vendor to engage, track, and pay for any good or service - fast!",
        imageUrl:
          "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.553209589.1715126400&semt=sph",
      },
      // items: [{
      //   totalPrice: {
      //     amount: 103,
      //     currency: 'EUR'
      //   }
      // }]
    },
    partnerName: "Finium",
    partnerEmail: "frank.hebbar@finium.ch",
    defaultCurrency: DEFAULT_CURRENCY,
    currencyOptions: mockCurrencyOptions,
    categoryOptions: mockCategory,
  },
};
