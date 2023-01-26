import React from "react";
import { Form, Dropdown, Input, Button } from 'formik-semantic-ui';
import { Grid } from 'semantic-ui-react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EditserSchema } from "../../helper";
import { adminActions, userAction } from "../../actions";
import { adminConfigSelector } from "../../helper";
import { adminService } from "../../services";

function mapDispatchToProps(dispatch) {
    const { getAdminConfigs } = adminActions;
    const { fetchUsers } = userAction
    return bindActionCreators({ getAdminConfigs, fetchUsers }, dispatch)
}

function mapStateToProps(state) {
    return ({
        tags: adminConfigSelector.getTags(state),
        isConfigLoading: adminConfigSelector.getAdminConfigLoading(state),
        isConfigError: adminConfigSelector.getAdminConfigError(state)
    })
}

export const EditUser = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null
        }
    }

    componentDidMount() {
        if (this.props.tags.length === 0) {
            this.props.getAdminConfigs();
        }
    }

    _handleSubmit = (values, formikApi) => {
        const userData = {
            id: this.props.user.id,
            ...values
        }
        this.setState({ error: null });
        adminService.updateUsers(userData).then(() => {
            this.props.fetchUsers();
            formikApi.setSubmitting(false);
            formikApi.resetForm();
        }).catch(err => {
            formikApi.setSubmitting(false);
            this.setState({ error: err.response ? err.response.data : 'Technical Error occured please try later' });
        })
    }

    render() {
        const { isConfigLoading, tags, isConfigError } = this.props;
        const { error } = this.state;
        return (
            <Grid columns={1} style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                <React.Fragment>
                    <Grid.Column>
                        {error && <p style={{ color: 'red' }}><b>{error.message}</b></p>}
                        <Form initialValues={{ name: this.props.user.name, password: '', tags: (this.props.user.tags || []), email: this.props.user.email }} validationSchema={EditserSchema} onSubmit={this._handleSubmit}>
                            {({ setFieldValue }) => (
                                <React.Fragment>
                                    <Form.Group widths='equal'>
                                        <Input fluid name="name" label='Name' inputProps={{ placeholder: 'name' }} />
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Input fluid name="password" label='Password (optional)' inputProps={{ placeholder: 'password', type: 'password' }} />
                                    </Form.Group>
                                    {isConfigError ? <span style={{ color: '#9f3a38' }}>Error in fetching tags</span> : null}
                                    <Dropdown name="tags" label={"Tags"} inputProps={{ multiple: true, loading: isConfigLoading, placeholder: 'choose tags/intrests' }} options={tags} />
                                    <Form.Group widths='equal'>
                                        <Input fluid name="email" label='Email' inputProps={{ placeholder: 'email' }} />
                                    </Form.Group>
                                    <Button.Submit secondary>Submit</Button.Submit>
                                    <Button basic secondary onClick={() => this.props.cancel()}>Cancel Edit</Button>
                                </React.Fragment>
                            )}
                        </Form>
                    </Grid.Column>

                </React.Fragment>
            </Grid>
        )
    }
})