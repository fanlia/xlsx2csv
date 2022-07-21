
type InputType = ArrayBuffer | Blob | NodeBuffer;

type CallbackType = (data: Array<string>) => void;

type SheetOptions = {
    max: number,
}

type Options = {
    sheet: SheetOptions,
}

export default function xlsx2csv(input: InputType, callback?: CallbackType) : void;

