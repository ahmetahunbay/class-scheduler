import React from 'react';
import MajorValidator from './MajorValidator';

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
                        backgroundColor: MajorValidator.categorySatisfied(category, scheduledClasses) ? 'lightgreen': 'lightcoral',
                    }}
                >
                    <label>{category.name}</label>
                    {!MajorValidator.categorySatisfied(category, scheduledClasses) &&
                        <label>{MajorValidator.stringifyCategoryRequirements(category, scheduledClasses)}</label>}
                </div>
            ))}
        </div>
    );
};

export default SelectedMajor;