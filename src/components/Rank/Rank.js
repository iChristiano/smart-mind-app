import React from 'react';

const Rank = (props) => {
    return(
        <div>
            <div className='b white f3'>
                {`${props.name}, your current entry count is...`}
            </div>
            <div className='b i white f1'>
                {props.entries}
            </div>
        </div>
    );
}

export default Rank;