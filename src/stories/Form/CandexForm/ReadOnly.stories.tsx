import React from "react";
import { StoryFn } from "@storybook/react";
import {
  PaymentProviderConfirmationReadOnly,
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
  component: PaymentProviderConfirmationReadOnly,
};

getI18NInstance(true);

export const ReadOnly = {
  args: {
    formData: {
      buyerChannelDetails: {
        ref: { id: "", name: "Candex" },
        description:
          "Candex is your fintech master vendor to engage, track, and pay for any good or service - fast!",
        imageUrl:
          "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.553209589.1715126400&semt=sph",
      },
      originalAmount: {
        amount: 100,
        currency: "EUR",
      },
      chargeToSupplier: {
        amount: 3,
        currency: "EUR",
      },
      totalAmount: {
        amount: 103,
        currency: "EUR",
      },
      items: [
        {
          type: "service",
          categories: [
            {
              id: "Marketing",
              name: "Marketing",
            },
          ],
          description: "Blah blah blah",
          quantity: "300000",
          totalPrice: {
            amount: 103,
            currency: "EUR",
          },
        },
      ],
    },
    partnerName: "Finium",
    partnerEmail: "frank.hebbar@finium.ch",
    defaultCurrency: DEFAULT_CURRENCY,
    currencyOptions: mockCurrencyOptions,
    categoryOptions: mockCategory,
  },
};
