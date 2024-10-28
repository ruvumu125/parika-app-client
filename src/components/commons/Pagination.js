import React from 'react';
import PaginationItem from './PaginationItem';
import PrevNextPaginationItem from "./PrevNextPaginationItem";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const renderPaginationItems = () => {
        const items = [];
        // Previous button
        items.push(
            <PrevNextPaginationItem
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                iconClass="fa fa-angle-left"
            />
        );
        // Page numbers
        for (let i = 0; i < totalPages; i++) {
            items.push(
                <PaginationItem
                    key={i}
                    label={i + 1}
                    onClick={() => onPageChange(i)}
                    active={i === currentPage}
                />
            );
        }
        // Next button
        items.push(
            <PrevNextPaginationItem
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                iconClass="fa fa-angle-right"
            />
        );
        return items;
    };

    return (
        <nav aria-label="Pagination">
            <ul className="pagination">
                {renderPaginationItems()}
            </ul>
        </nav>
    );
};

export default Pagination;
