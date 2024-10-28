import React from 'react';

const PrevNextPaginationItem = ({onClick,disabled,iconClass}) => {

    return (
        <li
            className={`paginate_button page-item ${disabled ? 'disabled' : ''}`}>
            <a
                onClick={onClick}
                aria-controls="DataTables_Table_0"
                aria-disabled="true" role="link"
                data-dt-idx="previous"
                tabIndex="-1"
                className="page-link">
                <i className={iconClass}></i>
            </a>
        </li>
    );

}

export default PrevNextPaginationItem;