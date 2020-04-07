import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Container from '../components/Container';
import '../styles/App.css';

const App = (props) => {
    return (
      <div className={props.theme === 'light' ? 'light_theme' : 'dark_theme'}> 
        <Container/>
      </div>
    );
};

const mapStateToProps = (state) => ({
    theme: state.settings.theme
});

export default withRouter(connect(mapStateToProps)(App));