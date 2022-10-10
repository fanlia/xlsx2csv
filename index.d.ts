
type InputType = ArrayBuffer | Blob | Buffer | string;

type CellType = string | number | boolean;

type CallbackType = (data: Array<CellType> | Array<Array<CellType>> ) => void;

type SheetOptions = {
    max: number,
    collect: boolean,
}

type Options = {
    sheet: SheetOptions,
}

export default function xlsx2csv(input: InputType, callback?: CallbackType) : void;

