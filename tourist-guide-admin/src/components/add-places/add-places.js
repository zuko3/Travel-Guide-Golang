import React from "react";
import { Form, Dropdown, Input, TextArea, Button } from "formik-semantic-ui";
import { ErrorMessage, Field } from "formik";
import { Grid, Message, Icon, Header } from "semantic-ui-react";
import { LocationImageDropzone } from "../common";
import { connect } from "react-redux";
import { adminConfigSelector, addPlaceSelector } from "../../helper";
import { adminActions, placeActions } from "../../actions";
import { bindActionCreators } from "redux";
import { addPlacesSchema } from "../../helper";
import { placeService } from "../../services";
import { LocationSearch } from "../common";

function mapDispatchToProps(dispatch) {
  const { getAdminConfigs } = adminActions;
  const {
    addPlaceRequest,
    addPlaceSuccess,
    addPlaceFailure,
    addPlaceRest,
    fetchPlaces,
  } = placeActions;
  return bindActionCreators(
    {
      getAdminConfigs,
      addPlaceRequest,
      addPlaceSuccess,
      addPlaceFailure,
      addPlaceRest,
      fetchPlaces,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    tags: adminConfigSelector.getTags(state),
    isConfigLoading: adminConfigSelector.getAdminConfigLoading(state),
    isAddPlaceError: addPlaceSelector.getAddPlaceError(state),
    isConfigError: adminConfigSelector.getAdminConfigError(state),
  };
}

export const AddPlaces = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { showAddPlaceForm: true };
    }
    componentDidMount() {
      if (this.props.tags.length === 0) {
        this.props.getAdminConfigs();
      }
    }

    componentWillUnmount() {
      this.props.addPlaceRest();
    }

    _handleSubmit = (values, formikApi) => {
      const {
        addPlaceRequest,
        addPlaceSuccess,
        addPlaceFailure,
        fetchPlaces,
      } = this.props;
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "images") {
          values[key].forEach((file) => {
            formData.append("files", file);
          });
        } else if (key === "tags") {
          values[key].forEach((tag) => {
            formData.append("tags", tag);
          });
        } else {
          formData.append(key, values[key]);
        }
      });
      addPlaceRequest();
      placeService
        .addPlace(formData)
        .then(() => {
          addPlaceSuccess();
          fetchPlaces();
          formikApi.setSubmitting(false);
          formikApi.resetForm();
          this._toggleForm();
        })
        .catch((err) => {
          addPlaceFailure();
          formikApi.setSubmitting(false);
        });
    };

    _toggleForm = () => {
      this.setState({
        showAddPlaceForm: !this.state.showAddPlaceForm,
      });
    };

    render() {
      const {
        isConfigLoading,
        tags,
        isAddPlaceError,
        isConfigError,
      } = this.props;
      return (
        <Grid columns={2} stackable>
          {this.state.showAddPlaceForm ? (
            <React.Fragment>
              <Grid.Column>
                <Header as="h1">Add Place Form </Header>
                {isAddPlaceError && (
                  <Message
                    error
                    header="Technical error"
                    list={["Please try after some time"]}
                  />
                )}
                <Form
                  initialValues={{
                    name: "",
                    areas: "",
                    lat: "",
                    lon: "",
                    tags: [],
                    address: "",
                    description: "",
                    images: [],
                  }}
                  validationSchema={addPlacesSchema}
                  onSubmit={this._handleSubmit}
                >
                  {({ setFieldValue }) => (
                    <React.Fragment>
                      <Form.Group widths="equal">
                        <Input
                          fluid
                          name="name"
                          label="Place name"
                          inputProps={{ placeholder: "name" }}
                        />
                      </Form.Group>
                      <div className="field">
                        <label>Area</label>
                        <Input
                          fluid
                          name="areas"
                          label="Area name"
                          inputProps={{ placeholder: "areas" }}
                        />
                        <ErrorMessage
                          name="areas"
                          className="sui-error-message"
                          component="div"
                        />
                      </div>
                      <Form.Group widths="equal">
                        <Input
                          fluid
                          name="lat"
                          label="Lattitude"
                          inputProps={{ placeholder: "Lattitude" }}
                        />
                        <Input
                          fluid
                          name="lon"
                          label="Longitude"
                          inputProps={{ placeholder: "Longitude" }}
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
                          placeholder: "choose tags",
                        }}
                        options={tags}
                      />
                      <div className="field">
                        <label>Upload images</label>
                        <Field
                          name="images"
                          component={LocationImageDropzone}
                        />
                        <ErrorMessage
                          name="images"
                          className="sui-error-message"
                          component="div"
                        />
                      </div>
                      <TextArea
                        name="address"
                        label="Additional address details"
                        inputProps={{
                          placeholder: "Enter additional address details ...",
                        }}
                      />
                      <TextArea
                        name="description"
                        label="Description"
                        inputProps={{
                          placeholder: "Enter some description for place ...",
                        }}
                      />
                      <Button.Submit secondary>Submit</Button.Submit>
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
                  <Message.Header>Place added</Message.Header>
                  You have successfully added a place.
                </Message.Content>
              </Message>
              <Button secondary onClick={this._toggleForm}>
                Add more places
              </Button>
            </Grid.Column>
          )}
        </Grid>
      );
    }
  }
);
