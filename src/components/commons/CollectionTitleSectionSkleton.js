import React from 'react';
import Skeleton from "react-loading-skeleton";

function CollectionTitleSectionSkleton(props) {
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
        </>
    );
}

export default CollectionTitleSectionSkleton;