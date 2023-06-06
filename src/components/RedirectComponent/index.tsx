import React from "react";

const Redirect = ({ Url } : {Url: string})=> {
    window.location.replace(Url);
    return(
        <></>
    )
}

export default Redirect;