import React from "react";
import { Form, Dropdown, Input, Button } from "formik-semantic-ui";
import { Grid, Message, Icon, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addUserSchema } from "../../helper";
import { adminActions, userAction } from "../../actions";
import { adminConfigSelector } from "../../helper";
import { adminService } from "../../services";

function mapDispatchToProps(dispatch) {
  const { getAdminConfigs } = adminActions;
  const { fetchUsers } = userAction;
  return bindActionCreators({ getAdminConfigs, fetchUsers }, dispatch);
}

function mapStateToProps(state) {
  return {
    tags: adminConfigSelector.getTags(state),
    isConfigLoading: adminConfigSelector.getAdminConfigLoading(state),
    isConfigError: adminConfigSelector.getAdminConfigError(state),
  };
}

export const AddUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showAddUserForm: true,
        error: null,
      };
    }

    componentDidMount() {
      if (this.props.tags.length === 0) {
        this.props.getAdminConfigs();
      }
    }

    _handleSubmit = (values, formikApi) => {
      this.setState({ error: null });
      adminService
        .addUser(values)
        .then(() => {
          this.props.fetchUsers();
          formikApi.setSubmitting(false);
          formikApi.resetForm();
          this._toggleForm();
        })
        .catch((err) => {
          formikApi.setSubmitting(false);
          this.setState({ error: err.response.data });
        });
    };

    _toggleForm = () => {
      this.setState({
        showAddUserForm: !this.state.showAddUserForm,
      });
    };

    render() {
      const { isConfigLoading, tags, isConfigError } = this.props;
      const { showAddUserForm, error } = this.state;
      return (
        <Grid columns={2} stackable>
          {showAddUserForm ? (
            <React.Fragment>
              <Grid.Column>
                <Header as="h1">Add User Details</Header>
                {error && (
                  <Message
                    error
                    header="Technical Error"
                    content={error.message}
                  />
                )}
                <Form
                  initialValues={{
                    name: "",
                    password: "",
                    tags: [],
                    email: "",
                  }}
                  validationSchema={addUserSchema}
                  onSubmit={this._handleSubmit}
                >
                  {({ setFieldValue }) => (
                    <React.Fragment>
                      <Form.Group widths="equal">
                        <Input
                          fluid
                          name="name"
                          label="Name"
                          inputProps={{ placeholder: "name" }}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        <Input
                          fluid
                          name="password"
                          label="Password"
                          inputProps={{
                            placeholder: "password",
                            type: "password",
                          }}
                        />
                      </Form.Group>
                      {isConfigError ? (
                        <span style={{ color: "#9f3a38" }}>
                          Error in fetching tags
                        </span>
                      ) : null}
                      <Dropdown
                        name="tags"
                        label={"Tags"}
                        inputProps={{
                          multiple: true,
                          loading: isConfigLoading,
                          placeholder: "choose tags/intrests",
                        }}
                        options={tags}
                      />
                      <Form.Group widths="equal">
                        <Input
                          fluid
                          name="email"
                          label="Email"
                          inputProps={{ placeholder: "email" }}
                        />
                      </Form.Group>
                      <Button.Submit secondary>Add user</Button.Submit>
                    </React.Fragment>
                  )}
                </Form>
              </Grid.Column>
            </React.Fragment>
          ) : (
            <Grid.Column>
              <Message success icon>
                <Icon name="check circle outline notched" />
                <Message.Content>
                  <Message.Header>User added</Message.Header>
                  You have successfully added a user.
                </Message.Content>
              </Message>
              <Button secondary onClick={this._toggleForm}>
                Add more user
              </Button>
            </Grid.Column>
          )}
        </Grid>
      );
    }
  }
);
