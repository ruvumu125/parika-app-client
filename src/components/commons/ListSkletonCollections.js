import React from 'react';
import Skeleton from "react-loading-skeleton";

function ListSkletonCollections(props) {

    return (
        <>

            <div className="table-top" style={{display: "block"}}>
                <div className="row">
                    <div className="col-lg-3" style={{paddingTop: 5}}>
                        <Skeleton height={38} count={1}  />
                    </div>
                    <div className="col-lg-8" style={{paddingTop: 5}}>
                        <Skeleton height={38} count={1} />
                    </div>
                    <div className="col-lg-1" style={{paddingTop: 5}}>
                        <Skeleton height={38} count={1} style={{width:"40px"}}  />
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <Skeleton height={40} count={10}  />
            </div>

            <div className="pagination-premio">
                <div className="pagination-deuxio"></div>
                <div className="pagination-trio">
                    <Skeleton height={38} count={1}  />
                </div>
            </div>
        </>

    );
}

export default ListSkletonCollections;