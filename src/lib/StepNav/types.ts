import { RequestStep } from "../Types";

export interface StepNavProps {
  steps: RequestStep[];
  activeStepIndex: number;
  stepTitlesLocalization?: { [step: string]: string }
  onStepSelect: (param: number) => void;
}
