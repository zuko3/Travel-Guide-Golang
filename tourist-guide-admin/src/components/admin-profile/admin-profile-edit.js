import React from "react";
import { Form, Input, Button } from 'formik-semantic-ui';
import { Grid, Icon, Header } from 'semantic-ui-react';
import { authSelectors, EditAdminSchema } from "../../helper";
import { adminService } from "../../services";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { adminActions } from "../../actions";

function mapDispatchToProps(dispatch) {
    const { adminProfileUpdateSuccess } = adminActions;
    return bindActionCreators({ adminProfileUpdateSuccess }, dispatch)
}

function mapStateToProps(state) {
    return ({
        adminInfo: authSelectors.getAdminInfo(state)
    })
}

export const EditAdmin = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isSuccess: false
        }
    }

    _handleSubmit = (values, formikApi) => {
        if (values.name === "" && values.email === "" && values.password === "") {
            formikApi.setSubmitting(false);
        } else {
            const adminInfoValues = { ...values, id: this.props.adminInfo.id }
            this.setState({ isError: false, isSuccess: false })
            adminService.editAdmin(adminInfoValues).then((res) => {
                const { data: { adminInfo } } = res;
                formikApi.setSubmitting(false);
                this.setState({ isError: false, isSuccess: true });
                this.props.adminProfileUpdateSuccess(adminInfo);
            }).catch(err => {
                formikApi.setSubmitting(false);
                this.setState({ isError: true, isSuccess: false })
            })
        }
    }

    render() {
        const { isError, isSuccess } = this.state;
        const { name, email } = this.props.adminInfo;
        return (
            <Grid columns={2} stackable>
                <React.Fragment>
                    <Grid.Column>
                        <Header as='h1'>Admin Profile Edit</Header>
                        <p>
                            <Icon name="info circle" />At least one field must be provided.
                        </p>
                        {isError && <p style={{ color: 'red' }}><Icon name="times circle outline" />Unable to udate admin profile.</p>}
                        {isSuccess && <p style={{ color: 'green' }}> <Icon name="check circle outline" />Admin profile successfully updated.</p>}
                        <Form initialValues={{ name: name, password: '', email: email }} validationSchema={EditAdminSchema} onSubmit={this._handleSubmit}>
                            {({ setFieldValue }) => (
                                <React.Fragment>
                                    <Form.Group widths='equal'>
                                        <Input fluid name="name" label='Name' inputProps={{ placeholder: 'name' }} />
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Input fluid name="password" label='Password' inputProps={{ placeholder: 'password', type: 'password' }} />
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Input fluid name="email" label='Email' inputProps={{ placeholder: 'email' }} />
                                    </Form.Group>
                                    <Button.Submit secondary>Update profile</Button.Submit>
                                </React.Fragment>
                            )}
                        </Form>
                    </Grid.Column>
                </React.Fragment>
            </Grid>
        )
    }
})

