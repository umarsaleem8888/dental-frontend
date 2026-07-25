import { useReactToPrint } from "react-to-print";
import { RefObject } from "react";

const usePrint = (

    ref: RefObject<HTMLDivElement>

) => {

    return useReactToPrint({

        contentRef: ref,

        documentTitle: "Prescription",

        pageStyle: `

        @page{

            size:A4 portrait;

            margin:0;

        }

        @media print{

            body{

                -webkit-print-color-adjust:exact;

            }

        }

        `

    });

};

export default usePrint;