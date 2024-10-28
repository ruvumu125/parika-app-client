import React from 'react';

const CompanySelector = ({ companies, selectedCompany, onChange }) => {

    const handleSelectCompanyChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <select
            className="form-select"
            value={selectedCompany} onChange={handleSelectCompanyChange}>
            <option value="">---Sélectionner une entreprise---</option>
            {companies.map((company) => (
                <option key={company.id} value={company.value}>{company.label}</option>
            ))}
        </select>
    );

}

export default CompanySelector;