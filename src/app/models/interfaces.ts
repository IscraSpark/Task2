
export interface IVariant{
    value: string;
    id: number;
    
}

export interface IRadioData{
    cardid: number;
    radio: IVariant;
}

export interface ICheckBoxData{
    cardid: number;
    box: IVariant[];
}

export interface IOpen{
    cardid: number;
    value: string;
}

export interface ICard{
    id: number;
    type: string;
    question: string;
    single: IVariant[];
    singleValue?: number | undefined;
    multiple: IVariant[];
    multipleValue?: number[] | undefined;
    open: boolean;
    openValue?: string | undefined;
    date: number;
    answered: boolean;
    answerDate?: number | undefined;
}

export interface IValid{
    valid: boolean,
    card: ICard
}