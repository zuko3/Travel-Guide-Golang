import React from "react";
import { Container } from 'semantic-ui-react';
import Header from "./components/header";
import { Routes } from "./components/routes";
import { Router } from 'react-router-dom';
import { history } from "./helper";

export function App(props) {
    return (
        <Router history={history}>
            <Header />
            <Container style={{ marginTop: '7em' }}>
                <Routes />
            </Container>
        </Router>
    );
}