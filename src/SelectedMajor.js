import React from 'react';
import ClassValidator from './ClassValidator';

const SelectedMajor = ({ major, scheduledClasses }) => {
    return (
        <div className="selected-major">
            <h3>{major.name}</h3>
            {major.categories.map((category) => (
                <div key={category.name} className="major-category"
                    style={{
                        border: '1px solid black',
                        padding: '8px',
                        margin: '4px',
                        backgroundColor: ClassValidator.categorySatisfied(category, scheduledClasses) ? 'lightgreen': 'lightcoral',
                    }}
                >
                    <label>{category.name}</label>
                </div>
            ))}
        </div>
    );
};

export default SelectedMajor;