export interface PrintSettings {

    top:number;

    bottom:number;

    left:number;

    right:number;

    letterHead:boolean;

    watermark:boolean;

}

const initialState:PrintSettings={

    top:40,

    bottom:20,

    left:20,

    right:20,

    letterHead:false,

    watermark:true

}