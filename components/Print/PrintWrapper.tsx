import React from "react";

interface Props {

    children: React.ReactNode;

    top?: number;

    bottom?: number;

    left?: number;

    right?: number;

}

const PrintWrapper: React.FC<Props> = ({

    children,

    top = 400,

    bottom = 20,

    left = 0,

    right = 20,

}) => {

    return (

        <div

            style={{

                paddingTop: top,

                paddingBottom: bottom,

                paddingLeft: left,

                paddingRight: right,

            }}

        >

            {children}

        </div>

    );

};

export default PrintWrapper;