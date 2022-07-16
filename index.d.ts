
type InputType = ArrayBuffer | Buffer;

type CallbackType = (data: Array<string>) => void;

export default function xlsx2csv(input: InputType, callback?: CallbackType) : void;

