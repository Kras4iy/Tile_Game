import React from 'react';

const Info = () => {
    const canvas = document.getElementById("game");

    const width = canvas?.clientWidth; //document.width is obsolete
    const height = canvas?.clientHeight;
    return (
        <>
            <span>{`width: ${width}`}</span>
            <br/>
            <span>{`height: ${height}`}</span>
        </>
    )
}

export default Info;
