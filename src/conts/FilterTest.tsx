import React from 'react'

const FilterTest: React.FC = () => {
    const name = 'hobby';
    const value = '독서';
    const checked = 'false';
    const selectedHobbies = ['독서', '운동', '음악'];
    const result = {
        [name]: checked
            ? value
            : selectedHobbies.filter(h => h !== value)
    };
    console.log(result);
    return (
        <div>
            Test
        </div>
    )
}

export default FilterTest