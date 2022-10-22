
type InputType = ArrayBuffer | Blob | Buffer | string;

type CellType = string | number | boolean;

type RowType = Array<CellType>;

type CallbackType = (data: RowType) => void;

type SheetOptions = {
    max: number,
    collect: boolean,
}

type Options = {
    sheet: SheetOptions,
}

export default function xlsx2csv(input: InputType, callback?: CallbackType) : Array<RowType> ;

