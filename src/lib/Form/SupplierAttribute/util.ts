import { Option } from "../../Inputs"
import { TotalSpendRange } from "../../Types"

const mapSpendToDisplayName: {[spend: string]: string} = {
    lessThan50K: '< $ 50K USD',
    between50K_to_150K: '$ 50K - $ 150K USD',
    between150K_to_500K: '$ 150K - $ 500K USD',
    between500K_to_1M: '$ 500K - $ 1M USD',
    moreThan1M: '> $ 1M USD'
}
  
export function mapTotalSpendToOption (spend: string): Option {
    return {
        id: spend,
        displayName: mapSpendToDisplayName[spend],
        path: spend,
        selectable: true,
        selected: false
    }
}

export function buildTotalSpendOption (): Option[] {
  return Object.keys(TotalSpendRange).map(spend => mapTotalSpendToOption(spend))
}
