import React from "react";
import { Form, Dropdown, Input, TextArea, Button } from "formik-semantic-ui";
import { ErrorMessage, Field } from "formik";
import { Grid, Icon, Label, Header, Message, Item } from "semantic-ui-react";
import { LocationImageDropzone } from "../common";
import { connect } from "react-redux";
import { adminConfigSelector, history, updatePlaceSchema } from "../../helper";
import { envConstants } from "../../constants";
import { placeService } from "../../services";
import { LocationSearch, MapView } from "../common";
import { adminActions } from "../../actions";
import { bindActionCreators } from "redux";

function mapStateToProps(state) {
  return {
    fetchedTags: adminConfigSelector.getTags(state),
    isConfigLoading: adminConfigSelector.getAdminConfigLoading(state),
    isConfigError: adminConfigSelector.getAdminConfigError(state),
  };
}

function mapDispatchToProps(dispatch) {
  const { getAdminConfigs } = adminActions;
  return bindActionCreators({ getAdminConfigs }, dispatch);
}

export const ViewModifyPlace = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isEditMode: false,
        isUpdateError: false,
      };
    }

    componentDidMount() {
      if (this.props.fetchedTags.length === 0) {
        this.props.getAdminConfigs();
      }
    }

    _formatImageForDropdown = (images) => {
      return images.map((image, index) => ({
        key: index,
        text: image.imagename,
        value: image.filename,
        image: { avatar: true, src: `${envConstants.BASE_URL}/${image}` },
      }));
    };

    _goBack = () => history.goBack();

    _toggleEdit = () => {
      this.setState({
        isEditMode: !this.state.isEditMode,
        isUpdateError: false,
      });
    };

    _handleSubmit = (values, formikApi) => {
      const {
        location: {
          state: {
            place: { _id },
          },
        },
      } = this.props;
      const formData = new FormData();
      formData.append("_id", _id);
      Object.keys(values).forEach((key) => {
        if (key === "newimages") {
          values[key].forEach((file) => {
            formData.append("files", file);
          });
        } else if (key === "tags") {
          values[key].forEach((tag) => {
            formData.append("tags", tag);
          });
        } else if (key === "oldimages") {
          values[key].forEach((file) => {
            formData.append("oldimages", file);
          });
        } else {
          formData.append(key, values[key]);
        }
      });
      this.setState({ isUpdateError: false });
      placeService
        .updatePlace(formData)
        .then(() => {
          this.setState({ isUpdateError: false });
          history.push("/all-places");
        })
        .catch((err) => {
          this.setState({ isUpdateError: true });
          formikApi.setSubmitting(false);
        });
    };

    _renderPlaceEditForm = () => {
      const {
        location: {
          state: {
            place: {
              name = "",
              areas = "",
              lat = "",
              lon = "",
              tags = [],
              address = "",
              description = "",
              images = [],
            },
          },
        },
        fetchedTags,
        isConfigError,
        isConfigLoading,
      } = this.props;
      const imageDropDownList = this._formatImageForDropdown(images);
      return (
        <Grid columns={2} stackable>
          <Grid.Column>
            <Header as="h1">Edit Place Form </Header>
            <Form
              initialValues={{
                name,
                areas,
                lat,
                lon,
                tags,
                address,
                description,
                newimages: [],
                oldimages: [],
              }}
              validationSchema={updatePlaceSchema}
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
                    <Field name="areas" component={LocationSearch} />
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
                      placeholder: "choose tags",
                      loading: isConfigLoading,
                    }}
                    options={fetchedTags}
                  />
                  <div className="field">
                    <label>Upload new images (If any)</label>
                    <Field name="newimages" component={LocationImageDropzone} />
                    <ErrorMessage
                      name="newimages"
                      className="sui-error-message"
                      component="div"
                    />
                  </div>
                  <Dropdown
                    name="oldimages"
                    label={"Select old images to delete (If any)"}
                    inputProps={{
                      multiple: true,
                      placeholder: "Select old images to delete",
                    }}
                    options={imageDropDownList}
                  />
                  <TextArea
                    name="address"
                    label="Address"
                    inputProps={{ placeholder: "Enter address.." }}
                  />
                  <TextArea
                    name="description"
                    label="Description"
                    inputProps={{
                      placeholder: "Enter some description for place ...",
                    }}
                  />
                  <Button.Submit secondary>Submit</Button.Submit>
                  <Button secondary onClick={this._toggleEdit}>
                    <Icon name="cancel" />
                    Cancel edit
                  </Button>
                </React.Fragment>
              )}
            </Form>
          </Grid.Column>
        </Grid>
      );
    };

    _renderPlaceView() {
      const {
        location: {
          state: {
            place: {
              name = "",
              areas = "",
              lat = "0",
              lon = "0",
              tags = [],
              address = "",
              description = "",
              images = [],
            },
          },
        },
      } = this.props;
      return (
        <Item style={{ marginBottom: "3rem" }}>
          <Item.Content>
            <Button
              basic
              circular
              secondary
              icon="arrow left"
              onClick={this._goBack}
            />{" "}
            Go Back
            <Button basic floated="right" secondary onClick={this._toggleEdit}>
              <Icon name="edit" />
              Edit palce
            </Button>
            <Header as="h1">Place Details View</Header>
            <MapView lat={lat} lon={lon} />
            <Header as="h2">{name}</Header>
            <Item.Meta>
              <div style={{ marginTop: "5px" }}>
                <Icon name="map marker alternate" />
                &nbsp;{areas}
              </div>
              <div style={{ marginTop: "5px" }}>
                <Icon name="map marker alternate" />
                Lattitude:&nbsp;{lat},&nbsp;&nbsp;Longitude :&nbsp;{lon}
              </div>
              <div style={{ marginTop: "5px" }}>
                <Icon name="map marker alternate" />
                Additional address&nbsp;-&nbsp;{address}
              </div>
            </Item.Meta>
            <Item.Description style={{ marginTop: "5px" }}>
              {tags.map((tag, index) => (
                <Label key={index} style={{ margin: "2px" }}>
                  {tag}
                  <Icon name="close" />
                </Label>
              ))}
              <p style={{ marginTop: "5px" }}>{description}</p>
            </Item.Description>
            <Item.Extra style={{ marginTop: "0.5rem" }}>
              {images.map((image, index) => (
                <Item.Image
                  style={{ marginTop: "0.5rem", marginRight: "0.5rem" }}
                  size="large"
                  src={`${envConstants.BASE_URL}/${image}`}
                />
              ))}
            </Item.Extra>
          </Item.Content>
        </Item>
      );
    }

    _renderUpdate_Error = () => (
      <Message negative icon>
        <Icon name="remove circle" />
        <Message.Content>
          <Message.Header>Technical Error</Message.Header>
          Unable to update place details
        </Message.Content>
      </Message>
    );

    render() {
      const { isEditMode, isUpdateError } = this.state;
      return (
        <React.Fragment>
          {isUpdateError ? this._renderUpdate_Error() : null}
          {isEditMode ? this._renderPlaceEditForm() : this._renderPlaceView()}
        </React.Fragment>
      );
    }
  }
);
