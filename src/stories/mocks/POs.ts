export const mockPos = ({
  "poNumber": "ORDA4192",
  "id": "325601482560307547",
  "requestorName": "John Doe",
  "requestorUsername": "john@foo.com",
  "companyEntityRef": {
    "id": "HH",
    "name": "Honeycomb Holdings Inc.",
    "erpId": "3",
    "refId": null
  },
  "departmentRef": {name: "Customer Success"},
  "accountRef": {
    "id": "5122",
    "name": "Miscellaneous Expense",
    "erpId": "83",
    "refId": null
  },
  "paymentTermsRef": null,
  "memo": null,
  "activityName": null,
  "currencyCode": "USD",
  "cost": 11,
  "start": "2023-06-24T05:06:34.545783246Z",
  "end": "2024-07-24T05:06:34.545783246Z",
  "engagementRefs": [
    {
      "id": "325594717986816347",
      "name": null,
      "erpId": null,
      "refId": "A4192"
    }
  ],
  "created": "2023-06-24T05:06:34.545783246Z",
  "itemList": null,
  "normalizedVendorRef": {
    "id": "89113807414099968",
    "vendorRecordId": null,
    "name": "Apple",
    "countryCode": "US",
    "legalEntityId": "88868992675233957",
    "legalEntityLogo": {
      "metadata": [
        {
          "path": "oro/images/small/88868992675233957.png",
          "height": 100,
          "width": 100,
          "__typename": "ImageMetadata"
        },
        {
          "path": "oro/images/large/88868992675233957.png",
          "height": 200,
          "width": 200,
          "__typename": "ImageMetadata"
        }
      ],
      "__typename": "Image"
    },
    "selectedVendorRecord": {
      "id": "91277523404455936",
      "vendorId": "01234",
      "enabled": false,
      "paymentTerm": {
        "id": "",
        "name": "",
        "erpId": "",
        "refId": "",
      },
      "__typename": "VendorRef"
    },
    "contact": {
      "fullName": "nitesh Jadhav",
      "firstName": null,
      "lastName": null,
      "email": "nitesh@orolabs.ai",
      "phone": "",
      "role": "Account Manager",
      "note": null,
      "imageUrl": null,
      "__typename": "Contact"
    },
    "activationStatus": "active",
    "isIndividual": false,
    "__typename": "NormalizedVendorRef"
  },
  "contractType": null,
  "contract": null,
  "noteObjects": [
    {
      "id": "85bda098-a0ae-4f38-aafb-b740629630bf",
      "owner": {
        "tenantId": "foo",
        "userName": "customeradmin+foo@orolabs.ai",
        "firstName": null,
        "lastName": null,
        "name": "Oro Admin",
        "department": null,
        "__typename": "UserId"
      },
      "taskStatus": null,
      "comment": "can you see this?",
      "documents": null,
      "created": "2023-06-27T16:57:16.395348168Z",
      "updated": "2023-06-27T16:57:16.395347864Z",
      "__typename": "Note"
    }
  ],
  "status": null,
  "erpCreatedDate": null,
  "erpUpdatedDate": null,
  "expenseItemList": {
    "items": [
      {
        "name": null,
        "description": null,
        "categories": [
          {
            "id": "tax",
            "name": "Tax",
            "erpId": null,
            "refId": null,
          }
        ],
        "departments": [],
        "type": "service",
        "materialId": null,
        "quantity": null,
        "unitForQuantity": null,
        "lineNumber": null,
        "priceMoney": null,
        "supplierPartId": null,
        "manufacturerPartId": null,
        "accountCodeIdRef": null,
        "url": null,
        "erpItemId": null,
        "startDate": null,
        "endDate": null,
        "tax": {
          "amountObject": null,
          "items": [
            {
              "taxCode": {
                "id": "vat",
                "name": "VAT",
                "erpId": null,
                "refId": null,
              },
              "percentage": 18,
              "taxableAmountObject": {
                "currency": "EUR",
                "amount": 1000
              },
              "amountObject": {
                "currency": "EUR",
                "amount": 180
              },
              "__typename": "TaxItem"
            }
          ],
          "__typename": "Tax"
        },
        "accumulator": null,
        "itemIds": null,
        "lineOfBusiness": null,
        "trackCode": null,
        "location": null,
        "projectCode": null,
        "expenseCategory": null,
        "dataJson": null,
        "__typename": "Item"
      }
    ],
    "__typename": "ItemList"
  },
  "__typename": "PurchaseOrder"
})
