
type InputType = ArrayBuffer | Blob | Buffer | string;

type CallbackType = (data: Array<string>) => void;

type SheetOptions = {
    max: number,
    collect: boolean,
}

type Options = {
    sheet: SheetOptions,
}

export default function xlsx2csv(input: InputType, callback?: CallbackType) : void;

