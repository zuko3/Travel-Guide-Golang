import React from 'react';
import { Grid, Header, Message } from 'semantic-ui-react';
import { Button, Form, Input } from 'formik-semantic-ui';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { history, loginSchema, authSelectors } from "../../helper";
import { adminService } from "../../services";
import { adminActions, placeActions } from "../../actions";
import "./Login.css";



function mapDispatchToProps(dispatch) {
    const { loginSuccess, loginRequest, loginFailure, getAdminConfigs } = adminActions;
    const { fetchPlaces } = placeActions;
    return bindActionCreators({ loginSuccess, loginRequest, loginFailure, getAdminConfigs, fetchPlaces }, dispatch)
}

function mapStateToProps(state) {
    return ({ isAuthError: authSelectors.getAuthError(state) })
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {

    _handleSubmit = (values, formikApi) => {
        const { loginSuccess, loginRequest, loginFailure, getAdminConfigs, fetchPlaces } = this.props;
        loginRequest();
        adminService.Login(values).then(function ({ data }) {
            formikApi.setSubmitting(false);
            loginSuccess(data);
            getAdminConfigs();
            fetchPlaces();
            history.push("/home");
        }).catch(function (error) {
            const { response: { data } } = error;
            formikApi.setSubmitting(false);
            loginFailure(data);
        });
    }

    render() {
        const { isAuthError = false } = this.props;
        return (
            <Grid className="login" centered style={{ height: '70vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    {isAuthError && <Message
                        error
                        header='There was some errors with your submission'
                        list={['Email provided is incorrect', 'password provided is incorrect']}
                    />}
                    <Header className="header" as='h1'>Admin login</Header>
                    <Form ignoreLoading initialValues={{
                        email: '',
                        password: ''
                    }} validationSchema={loginSchema} onSubmit={this._handleSubmit} size='large'>
                        {({ isSubmitting }) => (<React.Fragment>
                            <Input inputProps={{ placeholder: 'E-mail address', icon: 'envelope', disabled: isSubmitting, iconPosition: 'left' }} name="email" label='Email Address' type="email" />
                            <Input inputProps={{ placeholder: 'Password', icon: 'lock', disabled: isSubmitting, iconPosition: 'left', type: 'password' }} name="password" label='Password' type='password' />
                            <Form.Checkbox label='I agree to the Terms and Conditions' />
                            <Button.Submit disabled={isSubmitting} loading={isSubmitting} secondary fluid size='large'>Login</Button.Submit>
                        </React.Fragment>)}
                    </Form>
                </Grid.Column>
            </Grid >
        )
    }
})