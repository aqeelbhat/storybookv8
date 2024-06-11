import { useMediaQuery } from "react-responsive";
import { MAX_WIDTH_FOR_MOBILE_VIEW } from "../util";

export const useMediaQueryHook = () => {
    // right now we are using only media query for mobile/web view, we can added more later in the same hook for other usecase.
    const isSmallScreen = useMediaQuery({ query: `(max-width: ${MAX_WIDTH_FOR_MOBILE_VIEW})` })
    const isBigScreen = useMediaQuery({ query: `(min-width: ${MAX_WIDTH_FOR_MOBILE_VIEW})` })
    return {
        isSmallScreen,
        isBigScreen
    }
}