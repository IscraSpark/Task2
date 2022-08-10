
export interface Svariant{
    value: string;
    id: number;
    
}

export interface RadioData{
    cardid: number;
    radio: Svariant;
}

export interface CheckBoxData{
    cardid: number;
    box: Svariant[];
}

export interface Open{
    cardid: number;
    value: string;
}

export interface Card{
    id: number;
    type: string;
    question: string;
    single: Svariant[];
    singleValue?: number | undefined;
    multiple: Svariant[];
    multipleValue?: number[] | undefined;
    open: boolean;
    openValue?: string | undefined;
    date: number;
    answered: boolean;
    answerDate?: number | undefined;
}