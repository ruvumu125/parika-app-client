import React from 'react';
import Skeleton from "react-loading-skeleton";

const ListSkletonModal =()=> {
    return (
        <>

            <div className="table-responsive">
                <Skeleton height={40} count={1}  />
            </div>
        </>
    );
}

export default ListSkletonModal;