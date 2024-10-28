import React from 'react';
import Skeleton from "react-loading-skeleton";

function ListSkletonTable(props) {
    return (
        <>
            <table className="table">
                <Skeleton height={40} count={10}  />
            </table>
            <div style={{marginTop:20}}>
                <div className="pagination-deuxio"></div>
                <div className="pagination-trio">
                    <Skeleton height={38} count={1}  />
                </div>
            </div>
        </>

    );
}

export default ListSkletonTable;