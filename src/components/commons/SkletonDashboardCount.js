import React from 'react';
import Skeleton from "react-loading-skeleton";

const SkletonDashboardCount=()=> {
    return (
        <div className="row">
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                <Skeleton height={95} count={1}  style={{width:"250px"}}/>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                <Skeleton height={95} count={1}  style={{width:"250px"}}/>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                <Skeleton height={95} count={1}  style={{width:"250px"}}/>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
                <Skeleton height={95} count={1}  style={{width:"250px"}}/>
            </div>
        </div>
    );
}

export default SkletonDashboardCount;