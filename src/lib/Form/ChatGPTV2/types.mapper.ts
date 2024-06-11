import { ContractExtractionResponse } from './';

export function mapContractExtractionResponse (data: any): ContractExtractionResponse | null {
    if (!data) {
        return null
    }
    const response: ContractExtractionResponse = {
        fileid: data?.fileid || '',
        auto_renewal: data.auto_renewal,
        cancellation: data.cancellation,
        agreement_type: data?.agreement_type || '',
        auto_renewal_max: data?.auto_renewal_max || '',
        auto_renewal_notify: data?.auto_renewal_notify || '',
        auto_renewal_period: data?.auto_renewal_period || '',
        commercial: data?.commercial || '',
        duration_term: data?.duration_term || '',
        duration_type: data?.duration_type || '',
        expiry_date: data?.expiry_date || '',
        government: data?.government || '',
        incoterm: data?.incoterm || '',
        incoterm_location: data?.incoterm_location || '',
        sca: data?.sca || '',
        signer: data?.signer || '',
        summary_paragraph: data?.summary_paragraph || '',
        summary_sentence: data?.summary_sentence || '',
        top: data?.top || '',
        currency: data?.currency || '',
        end_date: data?.end_date || '',
        payment: data?.payment || '',
        start_date: data?.start_date || '',
        supplier: data?.supplier || '',
        value: data.value
    };

    return response;
}
