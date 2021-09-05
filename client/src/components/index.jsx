import React from 'react';
import { Route } from 'react-router-dom';

import Login from './login';
import Register from './register';


const Index = () => {
    return(
        <div className="container">
            <div className="row py-5 mt-4 align-items-center">
                <div className="col-md-5 pr-lg-5 mb-5 mb-md-0">
                    <p className="font-italic text-muted mb-0">Register and Login from here!</p>
                </div>
                <div className="col-md-7 col-lg-6 ml-auto">
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/home" component={Register}/>
                </div>
                
            </div>
        </div>
    )
};

export default Index
