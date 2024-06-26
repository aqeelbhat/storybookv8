import React from "react";
import { StoryFn } from "@storybook/react";
import { SanctionListFormProps, SanctionListForm } from "./../../lib";

const mockSanctionLists = [
  {
    id: "plc",
    displayName: "Non-SDN Palestinian Legislative Council List",
    path: "plc",
    selected: false,
    selectable: true,
  },
  {
    id: "sdn",
    displayName: "Specially Designated Nationals and Blocked Persons List",
    path: "sdn",
    selected: false,
    selectable: true,
  },
  {
    id: "bis_dpl",
    displayName: "Bureau of Industry and Security: Denied Persons List",
    path: "bis_dpl",
    selected: false,
    selectable: true,
  },
];

export default {
  title: "ORO UI Toolkit/Form/Sanction List",
  component: SanctionListForm,
};

export const TemplateForm = {
  args: {
    formData: {
      sanctionRiskScores: [
        {
          serviceName: "lexisnexis",
          identifier: "Lukoil",
          score: 80,
          notes: ["Name: IOANNOU, Ioannis", "Exclusion List: sdn"],
          details: {
            errorMessage: "",
            entities: [
              {
                entityNumber: "17349",
                fullName: "Lukoil",
                entityType: "Entity",
                country: "RU",
                listType: "SDN",
                guid: "LN0000599906",
                score: "100",
                program: "UKRAINE-EO13662",
                source: "SDN",
                remarks:
                  "(UK Sanctions List Ref):RUS1072. Financial sanctions imposed in addition to an asset freeze: Dealing with transferable securities or money-market instruments. Loans and credit arrangements. Correspondent banking relationships etc. Trust services. Date trust services sanctions imposed: 21/03/2023. The prohibition on correspondent banking relationships etc. measure was imposed on 15/12/2023. (UK Statement of Reasons):GAZPROMBANK is a Russian bank. GAZPROMBANK is or has been involved in obtaining a benefit from or supporting the Government of Russia by, carrying on business in the financial services sector - a sector of strategic significance to the Government of Russia. (Phone number):+7 (495) 913-74-74 (Website):www.GAZPROMBANK.ru | Listed on: 24/03/2022 UK Sanctions List Date Designated: 24/03/2022 Last Updated: 15/12/2023",
                additionalAddress: [
                  {
                    address: "11 Sretenski boulevard",
                    city: "Moscow",
                    state: null,
                    postalCode: "101000",
                    country: "RU",
                    addrRemarks: null,
                  },
                ],
              },
              {
                entityNumber: "17349",
                fullName: "LUKOIL OAO",
                entityType: "Entity",
                country: "RU",
                listType: "SDN",
                guid: "LN0000599905",
                score: "100",
                program: "SDGT",
                source: "SDN",
                remarks:
                  "Legal Basis: 833/2014 (OJ L 229) | Reg Date: 2014-07-31 | Additional Information: Date of listing: 31.7.2014. Other Information: Restrictive measures applied to these entities include the freezing of funds and economic resources of certain natural and legal persons, entities and bodies and restrictions on certain investments, as a response to the illegal annexation of Crimea and Sevastopol. For complete information about the sanctions go to http://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2014.229.01.0001.01.ENG and https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02014D0512-20230226",
                additionalAddress: [
                  {
                    address: "11 Sretenski boulevard",
                    city: "Moscow",
                    state: null,
                    postalCode: "101000",
                    country: "RU",
                    addrRemarks: null,
                  },
                ],
              },
              {
                entityNumber: "17349",
                fullName: "LUKOIL OAE",
                entityType: "Entity",
                country: "RU",
                listType: "SDN",
                guid: "LN0000599905",
                score: "100",
                program: "SDGT",
                source: "SDN",
                remarks:
                  "Source: Australia,AU - Commonwealth Law || Offense: Added to the Australian Commonwealth Legislation Register. || Category: Sanction List | Subcategory: || Associations: | Executive (Sanction List:N/A): AKIMOV, Andrey Igorevich, 12751825 || Last updated: 2023-03-13",
                additionalAddress: [
                  {
                    address: "11 Sretenski boulevard",
                    city: "Moscow",
                    state: null,
                    postalCode: "101000",
                    country: "RU",
                    addrRemarks: null,
                  },
                ],
              },
              {
                entityNumber: "17349",
                fullName: "LUKOIL OAC",
                entityType: "Entity",
                country: "RU",
                listType: "SDN",
                guid: "LN0000599905",
                score: "100",
                program: "SDGT",
                source: "SDN",
                remarks:
                  "Source: Australia,AU-Department of Foreign Affairs and Trade || Offense: Added to the Australian Department of Foreign Affairs and Trade - Russia and Ukraine Financial Sanction List. || Category: Sanction List | Subcategory: || Associations: | Owner (Sanction List:N/A): AKIMOV, Andrey Igorevich, 12128294 | Key Member (Sanction List:N/A): SHAMALOV, Yuri Nikolayevich, 12268970 || Last updated: 2023-12-15 || Profile Notes: Reference: 6773, 6773a Name of Individual or Entity: Gazprombank Type: Entity Name Type: Primary Name Aka: Bank GPB Address: 16 Nametkina Street Building 1, Moscow 117420, Russia Additional Information: Website: www.gazprombank.ru Listing Information: Autonomous Sanctions (Designated Persons and Entities and Declared Persons—Russia and Ukraine) Amendment (No. 8) Instrument 2022 Committees: Autonomous (Russia and Ukraine) Control Date: March 18, 2022 || Source: Australia,AU-Department of Foreign Affairs and Trade || Offense: Added to the Australian Department of Foreign Affairs and Trade - Russia and Ukraine Financial Sanction List. || Category: Sanction List | Subcategory: || Associations: | Owner (Sanction List:N/A): AKIMOV, Andrey Igorevich, 12128294 | Key Member (Sanction List:N/A): SHAMALOV, Yuri Nikolayevich, 12268970 || Last updated: 2023-12-15 || Profile Notes: Reference: 6773, 6773a Name of Individual or Entity: Gazprombank Type: Entity Name Type: Primary Name Aka: Bank GPB Address: 16 Nametkina Street Building 1, Moscow 117420, Russia Additional Information: Website: www.gazprombank.ru Listing Information: Autonomous Sanctions (Designated Persons and Entities and Declared Persons—Russia and Ukraine) Amendment (No. 8) Instrument 2022 Committees: Autonomous (Russia and Ukraine) Control Date: March 18, 2022 || Source: Australia,AU-Department of Foreign Affairs and Trade || Offense: Added to the Australian Department of Foreign Affairs and Trade - Russia and Ukraine Financial Sanction List. || Category: Sanction List | Subcategory: || Associations: | Owner (Sanction List:N/A): AKIMOV, Andrey Igorevich, 12128294 | Key Member (Sanction List:N/A): SHAMALOV, Yuri Nikolayevich, 12268970 || Last updated: 2023-12-15 || Profile Notes: Reference: 6773, 6773a Name of Individual or Entity: Gazprombank Type: Entity Name Type: Primary Name Aka: Bank GPB Address: 16 Nametkina Street Building 1, Moscow 117420, Russia Additional Information: Website: www.gazprombank.ru Listing Information: Autonomous Sanctions (Designated Persons and Entities and Declared Persons—Russia and Ukraine) Amendment (No. 8) Instrument 2022 Committees: Autonomous (Russia and Ukraine) Control Date: March 18, 2022",
                additionalAddress: [
                  {
                    address: "11 Sretenski boulevard",
                    city: "Moscow",
                    state: null,
                    postalCode: "101000",
                    country: "RU",
                    addrRemarks: null,
                  },
                ],
              },
            ],
          },
          riskScore: "true",
          url: "https://www.orolabs.ai",
        },
        {
          serviceName: "lexisnexis",
          identifier: "Babu",
          score: 70,
          notes: ["Name: John", "Exclusion List: sdn"],
          details: {
            errorMessage: "",
            entities: [
              {
                entityNumber: "17349",
                fullName: "MOHIDDIN, Shaikh Shakil Babu",
                entityType: "Individual",
                country: "India",
                listType: "SDN",
                guid: "af687ef4-0c97-493c-b32e-fea9ee43ec55",
                score: "100",
                program: "SDNTK",
                additionalAddress: [
                  {
                    address:
                      "R. No. 11, 1st Floor Ruksans Manzil 78 Temkar Street, Nagpada",
                    city: "Mumbai",
                    state: null,
                    postalCode: "101000",
                    country: "India",
                    addrRemarks: null,
                  },
                ],
                additionalAlias: [
                  {
                    fullName: "SHAKEEL, Chota",
                    entType: "AKA",
                    remarks: null,
                  },
                  {
                    fullName: "MOHIDDIN, Shaikh Shakil Babu",
                    entType: "AKA",
                    remarks: null,
                  },
                ],
              },
            ],
          },
          riskScore: "true",
          url: "https://www.orolabs.ai",
        },
        {
          serviceName: "lexisnexis",
          identifier: "Putin",
          score: 70,
          notes: ["Name: John", "Exclusion List: sdn"],
          details: {
            errorMessage: "",
            entities: [
              {
                entityNumber: "17349",
                fullName: "PUTIN, Vladimir",
                entityType: "Individual",
                country: "Russia",
                listType: "SDN",
                guid: "af687ef4-0c97-493c-b32e-fea9ee43ec55",
                score: "100",
                program: "RUSSIA-EO14024",
                additionalAddress: [
                  {
                    address: "Kremlin",
                    city: "Mumbai",
                    state: null,
                    postalCode: "101000",
                    country: "India",
                    addrRemarks: null,
                  },
                ],
              },
              {
                entityNumber: "17349",
                fullName: "PUTIN, Vladimir Vladimirovich",
                entityType: "Individual",
                country: "Russia",
                listType: "SDN",
                guid: "af687ef4-0c97-493c-b32e-fea9ee43ec55",
                score: "100",
                program: "RUSSIA-EO14024",
                additionalAddress: [
                  {
                    address: "Kremlin",
                    city: "Moscow",
                    state: "",
                    postalCode: "",
                    country: "Russia",
                    addrRemarks: null,
                  },
                  {
                    address: "Bocharov Ruchey",
                    city: "Sochi",
                    state: "Moscow Region",
                    postalCode: "",
                    country: "Russia",
                    addrRemarks: null,
                  },
                ],
              },
            ],
          },
          riskScore: "true",
          url: "https://www.orolabs.ai",
        },
      ],
      selectedSupplier: {
        refId: "342789165511014632",
        id: "342221666479106111",
        legalEntityLogo: {
          unprocessed: true,
          avoidOverwrite: false,
          expiration: "0",
          attempt: "0",
          metadata: [],
          backgroundColor: null,
        },
        name: "Lukoil",
        countryCode: "",
        website: "",
        selected: false,
        msaInPlace: false,
        ndaInPlace: false,
        ndaAttached: false,
        msaAttached: false,
        email: "",
        phone: "",
        address: {
          line1: "",
          line2: "",
          line3: "",
          streetNumber: "",
          unitNumber: "",
          city: "",
          province: "",
          alpha2CountryCode: "",
          postal: "",
          language: "",
        },
        duns: "",
        originalActivationStatus: "newSupplier",
        activationStatus: "newSupplier",
        newSupplier: true,
        newSupplierMessage: "",
        contact: {
          fullName: "Azad Shaikh",
          email: "azad.shaikh@orolabs.ai",
          role: "Account Manager",
          phone: "",
          requireBackgroundCheck: false,
          primary: false,
          emailVerified: true,
          phoneVerified: false,
          emailVerification: {
            email: "azad.shaikh@orolabs.ai",
            verified: true,
            isFreeDomain: false,
            emailNotDeliverable: false,
            domainNotExist: false,
          },
        },
        vendorRecords: [],
        createNewVendor: false,
        newCountryEnable: false,
        potentialMatchIgnore: false,
        sanctionList: [
          {
            entityNumber: "0",
            fullName: "Lukoil, OAO",
            nameForProcessing: null,
            nameInAscii: null,
            entityType: "Business",
            country: "",
            listType: null,
            guid: "LN0000394253",
            score: 100,
            program: null,
            remarks:
              "(UK Sanctions List Ref):RUS1072. Financial sanctions imposed in addition to an asset freeze: Dealing with transferable securities or money-market instruments. Loans and credit arrangements. Correspondent banking relationships etc. Trust services. Date trust services sanctions imposed: 21/03/2023. The prohibition on correspondent banking relationships etc. measure was imposed on 15/12/2023. (UK Statement of Reasons):GAZPROMBANK is a Russian bank. GAZPROMBANK is or has been involved in obtaining a benefit from or supporting the Government of Russia by, carrying on business in the financial services sector - a sector of strategic significance to the Government of Russia. (Phone number):+7 (495) 913-74-74 (Website):www.GAZPROMBANK.ru | Listed on: 24/03/2022 UK Sanctions List Date Designated: 24/03/2022 Last Updated: 15/12/2023",
            sdnType: null,
            title: null,
            callSign: null,
            dob: null,
            passport: null,
            additionalAddress: null,
            additionalAlias: null,
          },
          {
            entityNumber: "1",
            fullName: "LUKOIL OAO",
            nameForProcessing: null,
            nameInAscii: null,
            entityType: "Business",
            country: "",
            listType: null,
            guid: "LN0000393971",
            score: 100,
            program: null,
            remarks:
              "Legal Basis: 833/2014 (OJ L 229) | Reg Date: 2014-07-31 | Additional Information: Date of listing: 31.7.2014. Other Information: Restrictive measures applied to these entities include the freezing of funds and economic resources of certain natural and legal persons, entities and bodies and restrictions on certain investments, as a response to the illegal annexation of Crimea and Sevastopol. For complete information about the sanctions go to http://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2014.229.01.0001.01.ENG and https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02014D0512-20230226",
            sdnType: null,
            title: null,
            callSign: null,
            dob: null,
            passport: null,
            additionalAddress: null,
            additionalAlias: null,
          },
          {
            entityNumber: "2",
            fullName: "Lukoil PJSC",
            nameForProcessing: null,
            nameInAscii: null,
            entityType: "Business",
            country: "",
            listType: null,
            guid: "LN0000621193",
            score: 99,
            program: null,
            remarks:
              "Source: Australia,AU - Commonwealth Law || Offense: Added to the Australian Commonwealth Legislation Register. || Category: Sanction List | Subcategory: || Associations: | Executive (Sanction List:N/A): AKIMOV, Andrey Igorevich, 12751825 || Last updated: 2023-03-13",
            sdnType: null,
            title: null,
            callSign: null,
            dob: null,
            passport: null,
            additionalAddress: null,
            additionalAlias: null,
          },
          {
            entityNumber: "3",
            fullName: "Lukoil PJ",
            nameForProcessing: null,
            nameInAscii: null,
            entityType: "Business",
            country: "",
            listType: null,
            guid: "LN0000621193",
            score: 99,
            program: null,
            remarks:
              "Source: Australia,AU-Department of Foreign Affairs and Trade || Offense: Added to the Australian Department of Foreign Affairs and Trade - Russia and Ukraine Financial Sanction List. || Category: Sanction List | Subcategory: || Associations: | Owner (Sanction List:N/A): AKIMOV, Andrey Igorevich, 12128294 | Key Member (Sanction List:N/A): SHAMALOV, Yuri Nikolayevich, 12268970 || Last updated: 2023-12-15 || Profile Notes: Reference: 6773, 6773a Name of Individual or Entity: Gazprombank Type: Entity Name Type: Primary Name Aka: Bank GPB Address: 16 Nametkina Street Building 1, Moscow 117420, Russia Additional Information: Website: www.gazprombank.ru Listing Information: Autonomous Sanctions (Designated Persons and Entities and Declared Persons—Russia and Ukraine) Amendment (No. 8) Instrument 2022 Committees: Autonomous (Russia and Ukraine) Control Date: March 18, 2022 || Source: Australia,AU-Department of Foreign Affairs and Trade || Offense: Added to the Australian Department of Foreign Affairs and Trade - Russia and Ukraine Financial Sanction List. || Category: Sanction List | Subcategory: || Associations: | Owner (Sanction List:N/A): AKIMOV, Andrey Igorevich, 12128294 | Key Member (Sanction List:N/A): SHAMALOV, Yuri Nikolayevich, 12268970 || Last updated: 2023-12-15 || Profile Notes: Reference: 6773, 6773a Name of Individual or Entity: Gazprombank Type: Entity Name Type: Primary Name Aka: Bank GPB Address: 16 Nametkina Street Building 1, Moscow 117420, Russia Additional Information: Website: www.gazprombank.ru Listing Information: Autonomous Sanctions (Designated Persons and Entities and Declared Persons—Russia and Ukraine) Amendment (No. 8) Instrument 2022 Committees: Autonomous (Russia and Ukraine) Control Date: March 18, 2022 || Source: Australia,AU-Department of Foreign Affairs and Trade || Offense: Added to the Australian Department of Foreign Affairs and Trade - Russia and Ukraine Financial Sanction List. || Category: Sanction List | Subcategory: || Associations: | Owner (Sanction List:N/A): AKIMOV, Andrey Igorevich, 12128294 | Key Member (Sanction List:N/A): SHAMALOV, Yuri Nikolayevich, 12268970 || Last updated: 2023-12-15 || Profile Notes: Reference: 6773, 6773a Name of Individual or Entity: Gazprombank Type: Entity Name Type: Primary Name Aka: Bank GPB Address: 16 Nametkina Street Building 1, Moscow 117420, Russia Additional Information: Website: www.gazprombank.ru Listing Information: Autonomous Sanctions (Designated Persons and Entities and Declared Persons—Russia and Ukraine) Amendment (No. 8) Instrument 2022 Committees: Autonomous (Russia and Ukraine) Control Date: March 18, 2022",
            sdnType: null,
            title: null,
            callSign: null,
            dob: null,
            passport: null,
            additionalAddress: null,
            additionalAlias: null,
          },
        ],
        shareHolders: [
          {
            firstName: "",
            lastName: "",
            fullName: "HASSAN, Dawood",
            email: "dcompany@test.com",
            title: "",
            role: "accounts_receivable",
            phone: "",
            address: {
              line1: "",
              line2: "",
              line3: "",
              streetNumber: "",
              unitNumber: "",
              city: "United Arab Emirates",
              province: "",
              alpha2CountryCode: "AE",
              postal: "",
              language: "",
            },
            note: "test",
            requireBackgroundCheck: true,
            sharePercentage: 20,
            imageUrl: "",
            primary: false,
            emailVerified: false,
            phoneVerified: false,
            sanctionList: [
              {
                entityNumber: "2",
                fullName: "Dawood IBRAHIM",
                nameForProcessing: null,
                nameInAscii: null,
                entityType: "Individual",
                country: "AE",
                listType: null,
                guid: "LN0000234006",
                score: 100,
                program: null,
                remarks: "Program: SDGT, SDNTK",
                sdnType: null,
                title: null,
                callSign: null,
                dob: "1955-12-XX",
                passport: "M-110522",
                additionalAddress: [
                  {
                    address: "White House, Al-Wassal Road",
                    city: "Dubai",
                    postalCode: null,
                    country: "AE",
                    addrRemarks: null,
                  },
                ],
                additionalAlias: [
                  {
                    fullName: "Dawood EBRAHIM",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Dawood HASSAN",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Dawood Sheik IBRAHIM",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Dawood Ibrahim KASKAR",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Dawood SABRI",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Amir SAHEB",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Iqbal SETH",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Shaikh Ismail Abdul REHMAN",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Abdul Hamid Abdul AZIZ",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Aziz DILIP",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Ibrahim Shaikh Mohd ANIS",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Shaikh Daud HASAN",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Anis IBRAHIM",
                    enType: null,
                    remarks: null,
                  },
                ],
              },
            ],
          },
          {
            firstName: "",
            lastName: "",
            fullName: "MOHIDDIN, Shaikh Shakil Babu",
            email: "babu@gmail.com",
            title: "",
            role: "infosec",
            phone: "",
            address: {
              line1: "",
              line2: "",
              line3: "",
              streetNumber: "",
              unitNumber: "",
              city: "India",
              province: "",
              alpha2CountryCode: "IN",
              postal: "",
              language: "",
            },
            note: "test",
            requireBackgroundCheck: true,
            sharePercentage: 10,
            imageUrl: "",
            primary: false,
            emailVerified: false,
            phoneVerified: false,
            sanctionList: [
              {
                entityNumber: "0",
                fullName: "Chhota SHAKEEL",
                nameForProcessing: null,
                nameInAscii: null,
                entityType: "Individual",
                country: "IN",
                listType: null,
                guid: "LN0000347675",
                score: 100,
                program: null,
                remarks: "Program: SDNTK",
                sdnType: null,
                title: null,
                callSign: null,
                dob: "1960",
                passport: null,
                additionalAddress: [
                  {
                    address: "R. No. 11",
                    city: "Mumbai",
                    postalCode: null,
                    country: "IN",
                    addrRemarks: null,
                  },
                ],
                additionalAlias: [
                  {
                    fullName: "Chota SHAKEEL",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Chhota SHAKIL",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Shaikh Shakil Babu MOHIDDIN",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Sheikh Shakeel AHMED",
                    enType: null,
                    remarks: null,
                  },
                ],
              },
            ],
          },
        ],
        boardOfDirectors: [
          {
            firstName: "",
            lastName: "",
            fullName: "HASSAN, Dawood",
            email: "dcompany@test.com",
            title: "",
            role: "accounts_receivable",
            phone: "",
            address: {
              line1: "",
              line2: "",
              line3: "",
              streetNumber: "",
              unitNumber: "",
              city: "United Arab Emirates",
              province: "",
              alpha2CountryCode: "AE",
              postal: "",
              language: "",
            },
            note: "test",
            requireBackgroundCheck: true,
            sharePercentage: 20,
            imageUrl: "",
            primary: false,
            emailVerified: false,
            phoneVerified: false,
            sanctionList: [
              {
                entityNumber: "2",
                fullName: "Dawood IBRAHIM",
                nameForProcessing: null,
                nameInAscii: null,
                entityType: "Individual",
                country: "AE",
                listType: null,
                guid: "LN0000234006",
                score: 100,
                program: null,
                remarks: "Program: SDGT, SDNTK",
                sdnType: null,
                title: null,
                callSign: null,
                dob: "1955-12-XX",
                passport: "M-110522",
                additionalAddress: [
                  {
                    address: "White House, Al-Wassal Road",
                    city: "Dubai",
                    postalCode: null,
                    country: "AE",
                    addrRemarks: null,
                  },
                ],
                additionalAlias: [
                  {
                    fullName: "Dawood EBRAHIM",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Dawood HASSAN",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Dawood Sheik IBRAHIM",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Dawood Ibrahim KASKAR",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Dawood SABRI",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Amir SAHEB",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Iqbal SETH",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Shaikh Ismail Abdul REHMAN",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Abdul Hamid Abdul AZIZ",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Aziz DILIP",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Ibrahim Shaikh Mohd ANIS",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Shaikh Daud HASAN",
                    enType: null,
                    remarks: null,
                  },
                  {
                    fullName: "Anis IBRAHIM",
                    enType: null,
                    remarks: null,
                  },
                ],
              },
            ],
          },
        ],
        individual: false,
      },
    },
    allSanctionLists: mockSanctionLists,
    isAdverseMedia: false, // true
  },
};
