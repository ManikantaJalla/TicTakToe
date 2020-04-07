import React from 'react';
import { Switch, Route } from 'react-router-dom';

import MainMenu from '../containers/MainMenu';
import Game from '../containers/Game';

const Container = () => {
    return (
        <Switch>
            <Route exact path='/'
                   render={ () => <MainMenu /> } />
            <Route exact path='/game'
                   render={ () => <Game /> } />
        </Switch>
    )
};

export default Container;