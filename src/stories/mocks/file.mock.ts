export const mockCsvFile = `code,name,active,description,parent,image_url,default,order,erp_id,tags,externalId,type
6010,Advertising,true,,,,false,,65,,60000,_expense
6015,"Amortization Expense",true,,,,false,,66,,,_expense
6020,"Automobile Expense",true,,,,false,,67,,,_expense
6022,"Gas & Oil",true,,6020,,false,,68,,,_expense
6024,Repairs,true,,6020,,false,,69,,,_expense
6030,"Bad Debt Expense",true,,,,false,,70,,,_expense
6040,"Bank Service Charges",true,,,,false,,71,,,_expense
6050,Contributions,true,,,,false,,72,,,_expense
6060,"Depreciation Expense",true,,,,false,,73,,,_expense
6070,"Dues & Subscriptions",true,,,,false,,74,,,_expense
6080,"Equipment Rental",true,,,,false,,75,,,_expense
6090,"Freight & Delivery",true,,,,false,,76,,,_expense
6100,"Insurance Expense",true,,,,false,,77,,,_expense
6102,Liability,true,,6100,,false,,78,,,_expense
6104,"Workers' compensation",true,,6100,,false,,79,,,_expense
6106,Disability,true,,6100,,false,,80,,,_expense
6110,"Interest Expense",true,,,,false,,81,,,_expense
6120,"Meals & Entertainment",true,,,,false,,82,,,_expense
6130,"Miscellaneous Expense",true,,,,false,,83,,,_expense
6150,"Office Expense",true,,,,false,,84,,,_expense
6160,"Outside Services",true,,,,false,,85,,57000,_expense
6170,"Postage & Delivery",true,,,,false,,86,,,_expense
6180,"Professional Fees",true,,,,false,,87,,,_expense
6200,"Rent Expense",true,,,,false,,88,,,_expense
6220,"Repairs & Maintenance",true,,,,false,,89,,,_expense
6230,"Supplies Expense",true,,,,false,,90,,,_expense
6500,"Payroll Expenses",true,,,,false,,91,,,_expense
6250,"Taxes & Licenses-Other",true,,,,false,,92,,,_expense
6252,Business,true,,6250,,false,,93,,,_expense
6254,Property,true,,6250,,false,,94,,,_expense
6256,"Vehicle Registration",false,,6250,,false,,95,,,_expense
6260,"Telephone Expense",true,,,,false,,96,,,_expense
6262,"Regular Service",true,,6260,,false,,97,,,_expense
6264,Pager,false,,6260,,false,,98,,,_expense
6266,Cellular,true,,6260,,false,,99,,,_expense
6268,"Online Fees",true,,6260,,false,,100,,,_expense
6300,Utilities,true,,,,false,,101,,,_expense
6400,"Salaries & Wages Expense",true,,,,false,,113,,,_expense
6085,"Furniture & Fixtures Expense",true,,,,false,,126,,,_expense
6182,Accounting,true,,6180,,false,,127,,,_expense
6184,Legal,true,,6180,,false,,128,,"Royal Bank CDN",_expense
6017,"Duty Expense",true,,,,false,,137,,"Petty Cash",_expense
6018,"Freight Expense",true,,,,false,,138,,"Prepaid Expenses",_expense
6600,"Manufacturing Expenses",true,,,,false,,178,,,_expense
6610,Labor,true,,6600,,false,,179,,,_expense
6620,"Labor Burden",true,,6600,,false,,180,,,_expense
6630,Machine,true,,6600,,false,,181,,,_expense
6640,"Machine Burden",true,,6600,,false,,182,,,_expense`

export const mockMasterDataOptions = [{ "id": "_Account__Any__6182", "displayName": "Accounting", "path": "6180-6182", "customData": { "erpId": "127", "code": "6182" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6010", "displayName": "Advertising", "path": "6010", "customData": { "erpId": "65", "code": "6010" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6252", "displayName": "Business", "path": "6250-6252", "customData": { "erpId": "93", "code": "6252" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6050", "displayName": "Contributions", "path": "6050", "customData": { "erpId": "72", "code": "6050" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6070", "displayName": "Dues & Subscriptions", "path": "6070", "customData": { "erpId": "74", "code": "6070" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6080", "displayName": "Equipment Rental", "path": "6080", "customData": { "erpId": "75", "code": "6080" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6090", "displayName": "Freight & Delivery", "path": "6090", "customData": { "erpId": "76", "code": "6090" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6085", "displayName": "Furniture & Fixtures Expense", "path": "6085", "customData": { "erpId": "126", "code": "6085" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6100", "displayName": "Insurance Expense", "path": "6100", "customData": { "erpId": "77", "code": "6100" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6110", "displayName": "Interest Expense", "path": "6110", "customData": { "erpId": "81", "code": "6110" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6610", "displayName": "Labor", "path": "6600-6610", "customData": { "erpId": "179", "code": "6610" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6184", "displayName": "Legal", "path": "6180-6184", "customData": { "erpId": "128", "code": "6184" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6630", "displayName": "Machine", "path": "6600-6630", "customData": { "erpId": "181", "code": "6630" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6600", "displayName": "Manufacturing Expenses", "path": "6600", "customData": { "erpId": "178", "code": "6600" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6130", "displayName": "Miscellaneous Expense", "path": "6130", "customData": { "erpId": "83", "code": "6130" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6268", "displayName": "Online Fees", "path": "6260-6268", "customData": { "erpId": "100", "code": "6268" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6160", "displayName": "Outside Services", "path": "6160", "customData": { "erpId": "85", "code": "6160" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6180", "displayName": "Professional Fees", "path": "6180", "customData": { "erpId": "87", "code": "6180" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6254", "displayName": "Property", "path": "6250-6254", "customData": { "erpId": "94", "code": "6254" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6262", "displayName": "Regular Service", "path": "6260-6262", "customData": { "erpId": "97", "code": "6262" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6024", "displayName": "Repairs", "path": "6020-6024", "customData": { "erpId": "69", "code": "6024" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6220", "displayName": "Repairs & Maintenance", "path": "6220", "customData": { "erpId": "89", "code": "6220" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6230", "displayName": "Supplies Expense", "path": "6230", "customData": { "erpId": "90", "code": "6230" }, "icon": "", "selected": false, "selectable": true }, { "id": "_Account__Any__6250", "displayName": "Taxes & Licenses-Other", "path": "6250", "customData": { "erpId": "92", "code": "6250" }, "icon": "", "selected": false, "selectable": true }]

export const mockAddress = {
    "alpha2CountryCode": 'IN',
    "city": 'pune',
    "line1": 'abc',
    "line2": 'xyz',
    "line3": 'pqr',
    "postal": '445215',
    "province": 'str',
    "streetNumber": '14',
    "unitNumber": '200'
  }