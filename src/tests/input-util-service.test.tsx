
import '../stories/pollyfills'
import '@testing-library/react'
import { getCurrencySeparators, getValueFromAmount } from '../lib/Inputs/utils.service'
import { getSessionLocale, setSessionLocale } from '../lib'

describe('getCurrencySeparators', function () {
    test('should show correct value in default locale', () => {
        const currencySymbols = getCurrencySeparators('en-US')
        expect(currencySymbols?.decimalSymbol).toBe(".")
        expect(currencySymbols?.thousandsSeparatorSymbol).toBe(",")
    })

    test('should show correct value in Swiss locale', () => {
        const currencySymbols = getCurrencySeparators('de-CH')
        expect(currencySymbols?.decimalSymbol).toBe(".")
        expect(currencySymbols?.thousandsSeparatorSymbol).toBe("’")
    })
})

describe('getValueFromAmount', function () {
    const amount = 123456543.786
    const result = "123456543.786"
    const localeTesting = ['en', 'fr', 'de' , 'ja', 'it', 'pt', 'ru', 'tr', 'zh', 'es']
    test('should show correct value in all locale', () => {
        const defaultlocale = getSessionLocale()
        localeTesting.map((locale)=>{
            setSessionLocale(locale)
            expect(getValueFromAmount(amount.toLocaleString(locale))).toBe(result)
            setSessionLocale(defaultlocale)
        })
    })
})
