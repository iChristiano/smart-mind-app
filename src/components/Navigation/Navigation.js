import React from 'react';

const Navigation = (props) => {
    
        if(props.isSignedIn){
            return(
                <nav style={{display:'flex', justifyContent:'flex-end'}}>
                    <p 
                        className='f3 link dim black underline pa3 pointer'
                        onClick={() => props.onRouteChange('signedout')}>
                        {'Sign Out'}
                    </p>
                </nav>);
        } else {
            return(
                <nav style={{display:'flex', justifyContent:'flex-end'}}>
                    <p 
                        className='f3 link dim black underline pa3 pointer'
                        onClick={() => props.onRouteChange('signin')}>
                        {'Signin'}
                    </p>
                    <p 
                        className='f3 link dim black underline pa3 pointer'
                        onClick={() => props.onRouteChange('register')}>
                        {'Register'}
                    </p>
                </nav>);
        }
}

export default Navigation;