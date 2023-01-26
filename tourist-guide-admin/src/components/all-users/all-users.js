import React, { useState } from "react";
import { Button } from 'formik-semantic-ui';
import { Grid, Loader, Message, Icon, Item } from 'semantic-ui-react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { userAction } from "../../actions";
import { userSelector } from "../../helper";
import { EditUser } from "../add-user";
import { adminService } from "../../services";


function RenderEachUser({ user, fetchUser }) {
    const [toggleEdit, setToggleEdit] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [isDeleteError, setIsDeleteError] = useState(false);
    const userProps = { user };

    function deleteUser(id) {
        setIsDeleteLoading(true);
        setIsDeleteError(false);
        adminService.deleteUsers({ id }).then(() => {
            setIsDeleteLoading(false);
            setIsDeleteError(false);
            fetchUser();
        }).catch(err => {
            setIsDeleteLoading(false);
            setIsDeleteError(true);
        });
    }

    return (
        <Item style={{ marginTop: '2rem' }}>
            {toggleEdit ? (
                <React.Fragment>
                    <div>
                        <h3>Edit User Detail Form</h3>
                        <EditUser {...userProps} cancel={() => setToggleEdit(!toggleEdit)} />
                    </div>
                </React.Fragment>
            ) : (
                    <React.Fragment>
                        <Item.Image size="tiny" src="https://react.semantic-ui.com/images/avatar/large/justen.jpg" />
                        <Item.Content style={{ margin: 'auto' }}>
                            <Item.Header>{(user.name || "No name").toUpperCase()}</Item.Header>
                            <Item.Meta>{user.email}&nbsp;|&nbsp;{'+1 0000000000'}</Item.Meta>
                            <div style={{ marginTop: '1rem' }}>
                                <Button disabled={isDeleteLoading} loading={isDeleteLoading} negative onClick={() => deleteUser(user.id)}> Delete</Button>
                                <Button basic secondary onClick={() => setToggleEdit(!toggleEdit)} >
                                    <Icon name='edit' />Edit
                                </Button>
                            </div>
                            {isDeleteError && <div style={{ color: 'red', marginTop: '3px' }}>Error in deleting try again</div>}
                        </Item.Content>
                    </React.Fragment>
                )}
        </Item>
    )
}

function mapDispatchToProps(dispatch) {
    const { fetchUsers } = userAction
    return bindActionCreators({ fetchUsers }, dispatch)
}

function mapStateToProps(state) {
    return ({
        users: userSelector.getUsers(state),
        isUsersLoading: userSelector.getUserFetchLoading(state),
        isUsersFetchError: userSelector.getUserFetchError(state)
    })
}

export const AllUser = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddUserForm: true,
            error: null
        }
    }

    componentDidMount() {
        if (this.props.users.length === 0) {
            this.props.fetchUsers();
        }
    }

    _renderUsers = () => {
        return (
            <Item.Group>
                {this.props.users.map((user, index) => <RenderEachUser fetchUser={this.props.fetchUsers} user={user} key={index} />)}
            </Item.Group>
        )
    }

    render() {
        const { isUsersLoading, isUsersFetchError } = this.props;
        return (
            <Grid columns={2} stackable>
                <Grid.Column>
                    {isUsersLoading
                        ? <Loader active inline />
                        : (
                            isUsersFetchError
                                ?
                                (
                                    <Message negative icon>
                                        <Icon name='remove circle' />
                                        <Message.Content>
                                            <Message.Header>Technical Error</Message.Header>
                                            {'Error in loading user try again'}
                                        </Message.Content>
                                    </Message>
                                )
                                : this._renderUsers()
                        )
                    }
                </Grid.Column>
            </Grid>
        )
    }
})