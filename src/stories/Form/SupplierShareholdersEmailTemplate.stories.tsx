import React from "react";
import { StoryFn } from "@storybook/react";
import { ShareholderFormEmail } from "./../../lib";
import { ShareholderFormEmailProps } from "../../lib/Form/supplier-shareholders-form-email.component";
import { mockRoleOptions } from "../MultiLevelSelect/mocks";

export default {
  title: "ORO UI Toolkit/Form/Supplier Shareholders Email",
  component: ShareholderFormEmail,
};

export const TemplateForm = {
  args: {
    data: {
      normalizedVendorRefs: [
        {
          id: "342312366015954566",
          name: "Huawei",
          countryCode: "",
          legalEntityLogo: {
            metadata: [],
            backgroundColor: "",
          },
          contact: {
            address: {
              alpha2CountryCode: "",
              city: "",
              language: "",
              line1: "",
              line2: "",
              line3: "",
              postal: "",
              province: "",
              streetNumber: "",
              unitNumber: "",
            },
            email: "john@foo.com",
            firstName: "",
            id: "",
            lastName: "",
            phone: "",
            role: "Sales Lead",
            title: "",
            fullName: "John",
            imageUrl: "",
            emailVerified: false,
            phoneVerified: false,
            emailVerification: {
              domainNotExist: false,
              email: "john@foo.com",
              emailNotDeliverable: false,
              isFreeDomain: false,
              verificationFailureReason: "",
              verified: true,
            },
            sharePercentage: 10,
            note: "",
            requireBackgroundCheck: false,
          },
          activationStatus: "newSupplier",
          vendorRecords: [],
          isIndividual: false,
          shareHolders: [
            {
              address: {
                alpha2CountryCode: "IN",
                city: "India",
                language: "",
                line1: "",
                line2: "",
                line3: "",
                postal: "",
                province: "",
                streetNumber: "",
                unitNumber: "",
              },
              email: "john@foo.com",
              firstName: "",
              id: "",
              lastName: "",
              phone: "",
              role: "infosec",
              title: "",
              fullName: "Babu",
              imageUrl: "",
              emailVerified: false,
              phoneVerified: false,
              sharePercentage: 10,
              note: "test",
              requireBackgroundCheck: true,
            },
          ],
          sanctionList: [
            {
              entityNumber: "0",
              fullName: "Huawei Technologies Co., Ltd.",
              nameForProcessing: "",
              listType: "",
              country: "CN",
              entityType: "Business",
              score: 99,
              guid: "LN0000528349",
              program: "",
              remarks:
                "License requirement: \nFor all items subject to the EAR, see §§ 734.9(e)¹ and 744.11 of the EAR²\n\nLicense review policy: Presumption of denial.\n\nFederal Register citation: 84 FR 22964, 5/21/2019; 84 FR 43495, 8/21/19; 85 FR 29852, 5/19/20; 85 FR 51603, 8/20/20; 86 FR 71560, 12/17/21; 87 FR 8182, 2/14/22; 87 FR 21012, 4/11/22; 87 FR 55250, 9/9/22",
              sdnType: "",
              title: "",
              dob: "",
              passport: "",
              callSign: "",
              additionalAddress: [
                {
                  address: "Bantian Huawei Base, Longgang District",
                  city: "Shenzhen",
                  state: "",
                  postalCode: "518129",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "No. 1899 Xi Yuan Road, High-Tech West District",
                  city: "Chengdu",
                  state: "",
                  postalCode: "611731",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "Banxuegang Industrial",
                  city: "Shenzhen, Guangdong",
                  state: "",
                  postalCode: "518129",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "R&D Center, No. 2222, Golden Bridge Road, Pu Dong District",
                  city: "Shanghai",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "Q80–3–25R, 3rd Floor, No. 3, Shangdi Information Road, Haidian District",
                  city: "Beijing",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "Room 605, No. 21, Xinba, Xiachang District",
                  city: "Hangzhou",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "Building 1, No. 410, Jianghong Road, Changhe Street, Binjiang District",
                  city: "Hangzhou, Zhejiang",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "No. 410 Jianghong Road, Building 1",
                  city: "Hangzhou",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "No. 328 XINHU STREET, Building A3, Suzhou (Huawei R&D Center, Building A3, Creative Industrial Park, No. 328, Xinghu Street, Suzhou)",
                  city: "Suzhou, Jiangsu",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "Building R4, No. 2 City Avenue, Songshan Lake Science & Tech Industry Park",
                  city: "Dongguan",
                  state: "",
                  postalCode: "523808",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "No. 62, Second Ave., 5/F–6/F, TEDA, MSD–B2 Area, Tianjin Economic Technological Development Zone",
                  city: "Tianjin",
                  state: "",
                  postalCode: "300457",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "Huawei Base, Building 2, District B",
                  city: "Shenzhen",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "U1 Building, No. 1899 Xiyuan Avenue, West Gaoxin District",
                  city: "Chengdu City",
                  state: "",
                  postalCode: "611731",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "No. 1899, Xiyuan Ave., Hi-Tech Western District",
                  city: "Chengdu, Sichuan Province",
                  state: "",
                  postalCode: "610041",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "No. 410, Jianghong Rd., Building 4, Changhe St., Binjiang District",
                  city: "Hangzhou, Zhejiang Province",
                  state: "",
                  postalCode: "310007",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "No. 3, Xinxi Rd., Huawei Building, ShangDi Information Industrial Base, Haidian District",
                  city: "Beijing",
                  state: "",
                  postalCode: "100095",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "No. 18, Muhe Rd., Building 1–4, Haidian District",
                  city: "Beijing",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "Huawei Base, Bantian",
                  city: "Shenzhen",
                  state: "",
                  postalCode: "518129",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "National Development Bank Building (Zhicheng Building), No. 2, Gaoxin 1st Road, Xi'an High-tech Zone",
                  city: "Xi'an",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "Huawei Base, B1",
                  city: "Shenzhen",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "No. 188 Huoju Street, F10–11",
                  city: "Nanchang",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "No. 48 Daliang Street",
                  city: "Ningbo",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "R&D center, No. 2222, Golden Bridge Road, Pu Dong District",
                  city: "Shanghai",
                  state: "",
                  postalCode: "286305",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "Building 2, Area B, Putian Huawei Base, Longgang District",
                  city: "Shenzhen",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "Huawei Base, Building 2, District B",
                  city: "Shenzhen",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address:
                    "Huawei Production Center, Gangtou Village, Buji Town, Longgang District",
                  city: "Shenzhen",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "Huawei Base, Building 2, District B",
                  city: "Shenzhen",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "No. 360 Jiangshu Road, Building 5",
                  city: "Hangzhou, Zhejiang",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
                {
                  address: "Zone G, Huawei Base, Bantian, Longgang District",
                  city: "Shenzhen",
                  state: "",
                  postalCode: "",
                  country: "CN",
                  addrRemarks: "",
                },
              ],
              additionalAlias: [
                {
                  fullName: "Huawei Technologies Co., Ltd.",
                  entType: "",
                  remarks: "",
                },
                {
                  fullName: "Shenzhen Huawei Technologies",
                  entType: "",
                  remarks: "",
                },
                {
                  fullName:
                    "Beijing Huawei Longshine Information Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Beijing Huawei Longshine",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
                {
                  fullName:
                    "Hangzhou New Longshine Information Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Hangzhou Huawei Communication Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Hangzhou Huawei Enterprises",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Digital Technologies (Suzhou) Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Marine Networks Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Marine",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
                {
                  fullName: "Huawei Mobile Technology Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Tech. Investment Co.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Huawei Technology Co., Ltd. Chengdu Research Institute",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Terminal (Shenzhen) Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Nanchang Huawei Communication Technology",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Ningbo Huawei Computer & Net Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Shanghai Huawei Technologies Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Shenzhen Huawei Anjiexin Electricity Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Shenzhen Huawei Agisson Electric Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
                {
                  fullName: "Shenzhen Huawei New Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Shenzhen Huawei Technology Service",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Shenzhen Huawei Technologies Software",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Zhejiang Huawei Communications Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Huawei Technology Co., Ltd. Hangzhou Research Institute",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Huawei Technologies Co., Ltd. Beijing Research Institute",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Huawei Technologies Co., Ltd. Material Characterization Lab",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Huawei Technologies Co., Ltd. Xi'an Research Institute",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Technology",
                  entType: "",
                  remarks: "",
                },
                {
                  fullName: "HMN Technologies",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
                {
                  fullName: "Huahai Zhihui Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
                {
                  fullName: "HMN Tech",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
              ],
            },
            {
              entityNumber: "0",
              fullName: "Huawei Technologies Co., Ltd.",
              nameForProcessing: "",
              listType: "",
              country: "HK",
              entityType: "Business",
              score: 99,
              guid: "LN0000528349",
              program: "",
              remarks:
                "License requirement: \nFor all items subject to the EAR, see §§ 734.9(e)¹ and 744.11 of the EAR²\n\nLicense review policy: Presumption of denial.\n\nFederal Register citation: 84 FR 22964, 5/21/2019; 84 FR 43495, 8/21/19; 85 FR 29852, 5/19/20; 85 FR 51603, 8/20/20; 86 FR 71560, 12/17/21; 87 FR 8182, 2/14/22; 87 FR 21012, 4/11/22; 87 FR 55250, 9/9/22",
              sdnType: "",
              title: "",
              dob: "",
              passport: "",
              callSign: "",
              additionalAddress: [
                {
                  address: "",
                  city: "Tsim Sha Tsui, Kowloon",
                  state: "",
                  postalCode: "",
                  country: "HK",
                  addrRemarks: "",
                },
              ],
              additionalAlias: [
                {
                  fullName: "Huawei Technologies Co., Ltd.",
                  entType: "",
                  remarks: "",
                },
                {
                  fullName: "Shenzhen Huawei Technologies",
                  entType: "",
                  remarks: "",
                },
                {
                  fullName:
                    "Beijing Huawei Longshine Information Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Beijing Huawei Longshine",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
                {
                  fullName:
                    "Hangzhou New Longshine Information Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Hangzhou Huawei Communication Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Hangzhou Huawei Enterprises",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Digital Technologies (Suzhou) Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Marine Networks Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Marine",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
                {
                  fullName: "Huawei Mobile Technology Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Tech. Investment Co.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Huawei Technology Co., Ltd. Chengdu Research Institute",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Terminal (Shenzhen) Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Nanchang Huawei Communication Technology",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Ningbo Huawei Computer & Net Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Shanghai Huawei Technologies Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Shenzhen Huawei Anjiexin Electricity Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Shenzhen Huawei Agisson Electric Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
                {
                  fullName: "Shenzhen Huawei New Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Shenzhen Huawei Technology Service",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Shenzhen Huawei Technologies Software",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Zhejiang Huawei Communications Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Huawei Technology Co., Ltd. Hangzhou Research Institute",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Huawei Technologies Co., Ltd. Beijing Research Institute",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Huawei Technologies Co., Ltd. Material Characterization Lab",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName:
                    "Huawei Technologies Co., Ltd. Xi'an Research Institute",
                  entType: "",
                  remarks: "affiliated entity",
                },
                {
                  fullName: "Huawei Technology",
                  entType: "",
                  remarks: "",
                },
                {
                  fullName: "HMN Technologies",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
                {
                  fullName: "Huahai Zhihui Technology Co., Ltd.",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
                {
                  fullName: "HMN Tech",
                  entType: "",
                  remarks: "affiliated entity aka",
                },
              ],
            },
            {
              entityNumber: "1",
              fullName: "Huawei Technology",
              nameForProcessing: "",
              listType: "",
              country: "EG",
              entityType: "Business",
              score: 99,
              guid: "LN0000528162",
              program: "",
              remarks:
                "License requirement: \nFor all items subject to the EAR, see §§ 734.9(e)¹ and 744.11 of the EAR²\n\nLicense review policy: Presumption of denial.\n\nFederal Register citation: 84 FR 22964, 5/21/2019; 85 FR 29852, 5/19/20; 85 FR 36720, 6/18/20; 85 FR 51603, 8/20/20; 87 FR 55250, 9/9/22",
              sdnType: "",
              title: "",
              dob: "",
              passport: "",
              callSign: "",
              additionalAddress: [
                {
                  address: "",
                  city: "Cairo",
                  state: "",
                  postalCode: "",
                  country: "EG",
                  addrRemarks: "",
                },
              ],
              additionalAlias: [],
            },
            {
              entityNumber: "2",
              fullName: "Huawei International Co., Limited",
              nameForProcessing: "",
              listType: "",
              country: "",
              entityType: "Business",
              score: 98,
              guid: "LN0000528221",
              program: "",
              remarks:
                "License requirement: \nFor all items subject to the EAR, see §§ 734.9(e)¹ and 744.11 of the EAR²\n\nLicense review policy: Presumption of denial.\n\nFederal Register citation: 84 FR 22964, 5/21/2019; 85 FR 29852, 5/19/20; 85 FR 36720, 6/18/20; 85 FR 51603, 8/20/20; 85 FR 83769, 12/23/20; 87 FR 55250, 9/9/22",
              sdnType: "",
              title: "",
              dob: "",
              passport: "",
              callSign: "",
              additionalAddress: [],
              additionalAlias: [],
            },
          ],
        },
      ],
    },
    roleOption: mockRoleOptions,
  },
};
