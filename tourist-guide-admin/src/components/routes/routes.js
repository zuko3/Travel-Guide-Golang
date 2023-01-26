import React from "react";
import { Route, Redirect } from 'react-router-dom';
import Home from "../home";
import Login from "../login";
import AddPlaces from "../add-places";
import ListPlaces from "../list-places";
import ViewModifyPlace from "../view-modify-place";
import Tags from "../tags";
import AddUsers from "../add-user";
import AllUsers from "../all-users";
import EditAdmin from "../admin-profile";
import { authSelectors } from "../../helper";
import { connect } from "react-redux";


const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
    return (
        <Route path={path} {...rest} render={props => {
            return loggedIn ? <Comp {...props} /> : <Redirect to="/" />;
        }} />
    );
};

function mapDispatchToProps(dispatch) {
    return {}
}

function mapStateToProps(state) {
    return ({ isLoggedIn: authSelectors.getIsLogedIn(state) })
}

export const Routes = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
    render() {
        const { isLoggedIn } = this.props;
        return (
            <React.Fragment>
                <Route path="/" exact component={Login} />
                <ProtectedRoute path="/home" loggedIn={isLoggedIn} component={Home} />
                <ProtectedRoute path="/add-user" loggedIn={isLoggedIn} component={AddUsers} />
                <ProtectedRoute path="/all-users" loggedIn={isLoggedIn} component={AllUsers} />
                <ProtectedRoute path="/add-places" loggedIn={isLoggedIn} component={AddPlaces} />
                <ProtectedRoute path="/all-places" loggedIn={isLoggedIn} component={ListPlaces} />
                <ProtectedRoute path="/edit-profile" loggedIn={isLoggedIn} component={EditAdmin} />
                <ProtectedRoute path="/view-modify-place" loggedIn={isLoggedIn} component={ViewModifyPlace} />
                <ProtectedRoute path="/tags" loggedIn={isLoggedIn} component={Tags} />
            </React.Fragment>
        )
    }
})