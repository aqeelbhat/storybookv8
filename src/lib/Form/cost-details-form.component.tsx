import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "react-feather";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

import {
  CostDetail,
  CostDetailsFormProps,
  CostDetailsItemProps,
  CostFormData,
} from "./types";
import { DateControlNew, OroButton } from "../controls";
import { areCostDetailsValid } from "./util";
import { Money } from "../Types/common";
import moment from "moment";

import styles from "./cost-details-form.styles.module.scss";
import AlertCircle from "../Inputs/assets/alert-circle.svg";

export function CostDetailsItem(props: CostDetailsItemProps) {
  const [costDetailsItem, setCostDetailsItem] = useState<CostDetail | null>();
  const [costDetailsError, setCostDetailsError] = useState<string | null>(null);
  const [costAmountError, setCostAmountError] = useState<string | null>(null);
  const [costDateError, setCostDateError] = useState<string | null>(null);
  const [costDetails, setCostDetails] = useState<string>("");
  const [costAmount, setCostAmount] = useState<Money>({
    amount: 0,
    currency: "EUR",
  });
  const [costDate, setCostDate] = useState<Date | null>(null);
  const [costDateTouched, setCostDateTouched] = useState<boolean>(false);

  useEffect(() => {
    if (props.costDetail) {
      setCostDetailsItem(props.costDetail);
    }
    if (props.costDetail.costDetails) {
      setCostDetails(props.costDetail.costDetails);
    }
    if (props.costDetail.moneyAmount) {
      setCostAmount(props.costDetail.moneyAmount);
    }
    if (props.costDetail.costDate) {
      setCostDate(new Date(props.costDetail.costDate));
    }
  }, [props.costDetail]);

  function validateCostDetails() {
    setCostDetailsError(
      !(costDetailsItem && costDetailsItem.costDetails) && !costDetails
        ? "Cost details is required"
        : null,
    );
    setCostAmountError(!costAmount.amount ? "Cost amount is required" : null);
    setCostDateError(
      String(costDate) === "Invalid Date" ? "Cost date is required" : null,
    );
  }

  useEffect(() => {
    if (props.forceValidate) {
      validateCostDetails();
    }
  }, [props.forceValidate]);

  useEffect(() => {
    if (costDateTouched && !costDate) {
      setCostDateError("Cost date is required");
    }
  }, [costDateTouched, costDate]);

  function handleValidation(fieldName: string, newValue: string) {
    if (!newValue) {
      switch (fieldName) {
        case "costDetails":
          (!costDetailsItem || !costDetailsItem.costDetails) &&
            setCostDetailsError("Cost deatils is required");
          break;
        case "costAmount":
          setCostAmountError("Cost amount is required");
          break;
      }
    } else {
      switch (fieldName) {
        case "costDetails":
          setCostDetailsError(null);
          break;
        case "costAmount":
          setCostAmountError(null);
          break;
      }
    }
  }

  function getCostDetailsData(): CostDetail {
    return {
      costDetails: props.costDetail.costDetails,
      moneyAmount: props.costDetail.moneyAmount,
      costDate: props.costDetail.costDate,
    };
  }

  function getCostDataWithUpdatedValue(
    fieldName: string,
    newValue: string | number,
  ): CostDetail {
    const costData = JSON.parse(
      JSON.stringify(getCostDetailsData()),
    ) as CostDetail;

    switch (fieldName) {
      case "costDetails":
        costData.costDetails = newValue as string;
        break;
      case "costAmount":
        costData.moneyAmount.amount = newValue as number;
        costData.moneyAmount.currency = "EUR";
        break;
      case "costDate":
        costData.costDate = newValue as string;
    }

    return costData;
  }

  function handleChange(fieldName: string, newValue: string | number) {
    if (props.onChange) {
      props.onChange(getCostDataWithUpdatedValue(fieldName, newValue));
    }
  }

  function handleCostDetailsChange(event: any) {
    setCostDetails(event.target.value);
    handleValidation("costDetails", event.target.value);
    handleChange("costDetails", event.target.value);
  }

  function handleCostAmountChage(event: any) {
    setCostAmount({ amount: event.target.value, currency: "EUR" });
    handleValidation("costAmount", event.target.value);
    handleChange("costAmount", event.target.value);
  }

  // function handleCostDateChange (date: any) {
  //   setCostDateTouched(true)
  //   setCostDateError(null)
  //   setCostDate(date)
  // }
  function handleCostDateChange(date: string) {
    setCostDateTouched(true);
    setCostDateError(null);
    const _dateInternal = date ? moment(date).format("YYYY-MM-DD") : "";
    handleChange("costDate", String(_dateInternal || costDate));
  }

  // function onDateAccept (_date?: Date) {
  //   const _dateInternal = _date ? moment(_date).format('YYYY-MM-DD') : ''
  //   handleChange('costDate', String(_dateInternal || costDate))
  // }

  // function onDateKeyPress (e) {
  //   if (e.key === 'Enter' || e.key === 'NumpadEnter') {
  //     e.target.blur()
  //     onDateAccept()
  //   }
  // }

  return (
    <>
      <div className={styles.costDetailsRows}>
        <div className={styles.costDetailsRowsRow}>
          <input
            type="text"
            placeholder="Cost details"
            value={costDetails}
            onChange={handleCostDetailsChange}
            onBlur={handleCostDetailsChange}
          />
          <div className={styles.costDetailsRowsRowCurrency}>
            <span>€</span>
            <input
              type="number"
              placeholder="0"
              value={costAmount.amount === 0 ? "" : costAmount.amount}
              onChange={handleCostAmountChage}
              onBlur={handleCostAmountChage}
            />
          </div>
          <div className={styles.costDetailsRowsRowDate}>
            <DateControlNew
              id={""}
              type={"month"}
              hideBorder={true}
              value={costDate}
              config={{}}
              onChange={handleCostDateChange}
            />
          </div>
        </div>
        <span className={styles.costDetailsRowsTrash} onClick={props.onDelete}>
          <Trash2 color="#bfbfbf" />
        </span>
      </div>
      {(costDetailsError || costAmountError || costDateError) && (
        <div className={styles.error}>
          <img src={AlertCircle} />{" "}
          {costDetailsError || costAmountError || costDateError}
        </div>
      )}
    </>
  );
}

export function CostDetailsForm(props: CostDetailsFormProps) {
  const [costDetailsList, setCostDetailsList] = useState<Array<CostDetail>>([
    {
      costDetails: "",
      moneyAmount: { amount: 0, currency: "EUR" },
      costDate: "",
    },
  ]);
  const [forceValidate, setForceValidate] = useState<boolean>(false);

  useEffect(() => {
    if (props.formData.costs && props.formData.costs.length > 0) {
      setCostDetailsList(props.formData.costs);
    }
  }, [props.formData.costs]);

  function getFormData(): CostFormData {
    return {
      costs: costDetailsList,
    };
  }

  function fetchData(skipValidation?: boolean): CostFormData | null {
    if (skipValidation) {
      return getFormData();
    } else if (costDetailsList.length > 0) {
      return getFormData();
    } else {
      return null;
    }
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData);
    }
  }, [costDetailsList]);

  function handleAddCostDetails() {
    const costDetailsListCopy = [
      ...costDetailsList,
      {
        costDetails: "",
        moneyAmount: { amount: 0, currency: "EUR" },
        costDate: "",
      },
    ];
    setCostDetailsList(costDetailsListCopy);
    handleChange(costDetailsListCopy);
  }

  function deleteCostDetailsItem(index: number) {
    const costDetailsListCopy = [...costDetailsList];
    costDetailsListCopy.splice(index, 1);
    setCostDetailsList(costDetailsListCopy);
    handleChange(costDetailsListCopy);
  }

  function handleChange(data: CostDetail[]) {
    if (props.onChange) {
      props.onChange(data);
    }
  }

  function handleCostDetailChange(index: number, data: CostDetail) {
    const costDetailsListCopy = [...costDetailsList];
    costDetailsListCopy[index] = data;
    setCostDetailsList(costDetailsListCopy);
    handleChange(costDetailsListCopy);
  }

  function handleFormCancel() {
    if (props.onCancel) {
      props.onCancel();
    }
  }

  function isFormInvalid(): string {
    let invalidFieldId = "";
    let isInvalid = false;

    if (
      !costDetailsList ||
      costDetailsList.length < 1 ||
      !areCostDetailsValid(costDetailsList)
    ) {
      invalidFieldId = "cost-details-field";
      isInvalid = true;
    }

    return isInvalid ? invalidFieldId : "";
  }

  function triggerValidations(invalidFieldId: string) {
    setForceValidate(true);
    setTimeout(() => {
      setForceValidate(false);
    }, 1000);

    const input = document.getElementById(invalidFieldId);
    if (input?.scrollIntoView) {
      input?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }

  function handleFormSubmit() {
    const invalidFieldId = isFormInvalid();
    if (invalidFieldId) {
      triggerValidations(invalidFieldId);
    } else if (props.onSubmit) {
      props.onSubmit({ costs: costDetailsList });
    }
  }

  return (
    <div className={styles.costDetails}>
      {!props.skipTitle && (
        <label className={styles.costDetailsFormLabel}>Costs</label>
      )}

      <div id="cost-details-field">
        {costDetailsList.map((costDetail, i) => {
          return (
            <CostDetailsItem
              key={i}
              costDetail={costDetail}
              forceValidate={forceValidate}
              onDelete={() => deleteCostDetailsItem(i)}
              onChange={(data) => handleCostDetailChange(i, data)}
            />
          );
        })}
      </div>
      <div className={styles.costDetailsBtn} onClick={handleAddCostDetails}>
        <span>
          <Plus size={10} color="#ABABAB" />
        </span>
        <p>Add more</p>
      </div>

      {(props.submitLabel || props.cancelLabel) && (
        <div className={styles.costDetailsCont}>
          <div className={styles.costDetailsContButtons}>
            {props.cancelLabel && (
              <OroButton
                label={props.cancelLabel}
                type="secondary"
                fontWeight="semibold"
                onClick={handleFormCancel}
              />
            )}
            {props.submitLabel && (
              <OroButton
                label={props.submitLabel}
                type="primary"
                fontWeight="semibold"
                radiusCurvature="medium"
                onClick={handleFormSubmit}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
