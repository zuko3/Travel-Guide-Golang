import React from "react";
import { Grid, Icon, Header, List, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { adminActions } from "../../actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { adminConfigSelector, history } from "../../helper";

function mapStateToProps(state) {
    return ({
        tags: adminConfigSelector.getTags(state)
    })
}

function mapDispatchToProps(dispatch) {
    const { getAdminConfigs, adminLogout } = adminActions;
    return bindActionCreators({ getAdminConfigs, adminLogout }, dispatch)
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
    componentDidMount() {
        if (this.props.tags.length === 0) {
            this.props.getAdminConfigs();
        }
    }

    _handleLogout = () => {
        this.props.adminLogout();
        history.replace({ pathname: '/' });
    }

    render() {
        return (
            <Grid centered verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column style={{ maxWidth: 800 }}>
                        <Header as='h2'>
                            <Image circular src='https://react.semantic-ui.com/images/avatar/large/patrick.png' />
                            <Header.Content>
                                Welcome, Admin
                                <Header.Subheader>Manage your preferences</Header.Subheader>
                            </Header.Content>
                        </Header>
                        <List divided horizontal>
                            <List.Item><Link to="/edit-profile">Edit profile</Link></List.Item>
                            <List.Item><Link onClick={this._handleLogout}>Logout</Link></List.Item>
                        </List>

                        <List as="ol">
                            <List.Item as='li' value="-" style={{ marginTop: '0.5rem' }}>
                                <b>Manage Users</b>
                                <List.List as="ol">
                                    <List.Item as='li'><Link to="/add-user">Add user</Link></List.Item>
                                    <List.Item as='li'><Link to="/all-users">View all users</Link></List.Item>
                                </List.List>
                            </List.Item>

                            <List.Item as='li' value="-" style={{ marginTop: '0.5rem' }}>
                                <b>Manage Places</b>
                                <List.List as='ol'>
                                    <List.Item as='li'><Link to="/add-places">Add place</Link></List.Item>
                                    <List.Item as='li'><Link to="/all-places">View all places</Link></List.Item>
                                </List.List>
                            </List.Item>

                            <List.Item as='li' value="-" style={{ marginTop: '0.5rem' }}>
                                <b>Manage Tags</b>
                                <List.List as='ol'>
                                    <List.Item as='li'><Link to="/tags">Add or remove tags</Link></List.Item>
                                </List.List>
                            </List.Item>
                        </List>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
});