## Ask ORO AI (supported by Chat GPT)

### Inputs
- Query [mandatory]
- proposal [Optional]

### Components
- **Proposal Extracted details** (if contractExtractionDetails), with continue button.
  -- On continue may ask an additional question to find better intent. Use case - only if main query has next question.
- **marketplace catalog** (if productName), with continue button. *only for below intents*
  ```sh
    GPTV2Intent.createContract,
    GPTV2Intent.createPO,
    GPTV2Intent.findSupplier,
    GPTV2Intent.unknown + product name
    ```
- **Additional Questions** (max 3) for better intent.
- **Category** among recommended List or choose manually
- **choose supplier** among recommended list / Search supplier / new Supplier
- **Blocked Supplier** with fallback channel (use segementationDetails)
  -- *Depend on segementationDetails received in formdata*
- **Nudge Supplier** about nudging the supplier among recommended list
  -- *if selected supplier is not part of recommended list*
- **Amount**
  -- *Amount may override from proposal(first preference) or query*
- **Compliance Form**
 -- *Only if to be shown based on api response..*
 - **Buying Channels**
  -- *will show fallback channel if there is no buying channel found*
 - **Coming Soon**
 -- *Only if*
    ```sh
    Intent is empty OR (GPTIntent === 'Unknown' AND !productName)
    ```
### Rules
- **Category / Supplier /Amount / Compliance Form**
 -- *visible only for below intents*
  ```sh
    GPTV2Intent.requestStatus,
      GPTV2Intent.contractStatus,
      GPTV2Intent.invoiceStatus,
      GPTV2Intent.supplierStatus,
      GPTV2Intent.poStatus,
      GPTV2Intent.extendContract,
      GPTV2Intent.renewContract,
      GPTV2Intent.cancelContract,
      GPTV2Intent.amendPO
    ```
- **Category/ Supplier/ Amount / Compliance Forms**
 --works in a chain. If category is not be shown, others too not be shown



