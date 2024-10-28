import React from 'react';

const PaginationItem = ({ label, onClick, active}) => {
    return (
        <li className={`paginate_button page-item ${active ? 'active' : ''}`}>
            <a
                onClick={onClick}
                aria-controls="DataTables_Table_0"
                role="link" aria-current="page"
                data-dt-idx="0" tabIndex="0"
                className="page-link">
                {label}
            </a>

        </li>
    );
};

export default PaginationItem;
