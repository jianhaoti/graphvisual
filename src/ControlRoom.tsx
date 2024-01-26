import React from "react";
interface ControlRoomProps {
    mode: string;
  }
  
const ControlRoom: React.FC<ControlRoomProps> = ({mode}) => {

    if (mode === "data"){

    }

    if (mode === "algo"){

    }

    return (
        <div className="container container-right">
        </div>
    );
};


export default ControlRoom;
