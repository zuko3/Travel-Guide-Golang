import React from 'react'
import { Container, Image, Menu, Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import "./Header.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { adminActions } from "../../actions";
import { authSelectors, history } from "../../helper";


function mapDispatchToProps(dispatch) {
    const { adminLogout } = adminActions;
    return bindActionCreators({ adminLogout }, dispatch)
}

function mapStateToProps(state) {
    return ({ isLoggedIn: authSelectors.getIsLogedIn(state) })
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
    _handleLogout = () => {
        this.props.adminLogout();
        history.replace({ pathname: '/' });
    }

    _gotoHome = () => {
        history.push({ pathname: '/home' });
    }

    render() {
        return (
            <Menu fixed='top' inverted className="navigation-menu">
                <Container>
                    <Menu.Item header style={{ cursor: 'pointer' }} onClick={this._gotoHome}>
                        <Image size='mini' src='https://react.semantic-ui.com/logo.png' style={{ marginRight: '1.5em' }} />
                        TouristGuide  Admin
                    </Menu.Item>
                    {this.props.isLoggedIn && (
                        <React.Fragment>
                            <Menu.Item>
                                <Link to="/home">Home</Link>
                            </Menu.Item>
                            <Dropdown pointing text='Users' className='item'>
                                <Dropdown.Menu>
                                    <Dropdown.Item><Link to="/add-user" style={{ color: 'black' }}>Add users</Link></Dropdown.Item>
                                    <Dropdown.Item><Link to="/all-users" style={{ color: 'black' }}>View users</Link></Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown pointing text='Places' className='item'>
                                <Dropdown.Menu>
                                    <Dropdown.Item><Link to="/add-places" style={{ color: 'black' }}>Add places</Link></Dropdown.Item>
                                    <Dropdown.Item><Link to="/all-places" style={{ color: 'black' }}>View places</Link></Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Menu.Item>
                                <Link to="/tags">Tags</Link>
                            </Menu.Item>
                            <Dropdown pointing text='Account' className='item'>
                                <Dropdown.Menu>
                                    <Dropdown.Item><Link to="/edit-profile" style={{ color: 'black' }}>Edit profile</Link></Dropdown.Item>
                                    <Dropdown.Item onClick={this._handleLogout}> Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </React.Fragment>
                    )}

                </Container>
            </Menu >

        )
    }
})

