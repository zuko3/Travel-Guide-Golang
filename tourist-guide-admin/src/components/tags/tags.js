import React from "react";
import { Button, Form, Input } from "formik-semantic-ui";
import {
  Icon,
  Label,
  Search,
  Grid,
  Header,
  Segment,
  Message,
  Divider,
} from "semantic-ui-react";
import { adminActions } from "../../actions";
import { bindActionCreators } from "redux";
import { adminConfigSelector } from "../../helper";
import { connect } from "react-redux";
import { Loader } from "semantic-ui-react";
import { placeService } from "../../services";

function mapDispatchToProps(dispatch) {
  const { getAdminConfigs } = adminActions;
  return bindActionCreators({ getAdminConfigs }, dispatch);
}

function mapStateToProps(state) {
  return {
    tags: adminConfigSelector.getTags(state),
    isConfigError: adminConfigSelector.getAdminConfigError(state),
    isConfigLoading: adminConfigSelector.getAdminConfigLoading(state),
  };
}
export const Tags = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isTagSubmitError: false,
      };
    }
    componentDidMount() {
      if (this.props.tags.length === 0) {
        this.props.getAdminConfigs();
      }
    }

    _addTag = (values, formikApi) => {
      const tag = values.tags;
      this.setState({ isTagSubmitError: false });
      placeService
        .addTags({ tag })
        .then(() => {
          formikApi.setSubmitting(false);
          formikApi.resetForm();
          this.props.getAdminConfigs();
        })
        .catch((err) => {
          formikApi.setSubmitting(false);
          this.setState({ isTagSubmitError: true });
        });
    };
    _renderAddTagFrom = () => {
      return (
        <Form
          ignoreLoading
          initialValues={{ tags: "" }}
          size="smaller"
          onSubmit={this._addTag}
        >
          {({ isSubmitting }) => (
            <React.Fragment>
              <Input
                inputProps={{
                  placeholder: "beach, hills, clubs etc ...",
                  icon: "tag",
                  disabled: isSubmitting,
                  iconPosition: "left",
                }}
                name="tags"
                label="Tags"
                type="text"
              />
              <Button.Submit
                disabled={isSubmitting}
                loading={isSubmitting}
                secondary
              >
                Submit
              </Button.Submit>
            </React.Fragment>
          )}
        </Form>
      );
    };

    _renderTags = () => {
      const { tags } = this.props;
      return (
        <Label.Group color="blue">
          {tags.map((tag) => (
            <Label as="a">
              {tag.text}
              <Icon name="close" />
            </Label>
          ))}
        </Label.Group>
      );
    };

    _renderSubmitError = (msg) => (
      <Message negative icon>
        <Icon name="remove circle" />
        <Message.Content>
          <Message.Header>Technical Error</Message.Header>
          {msg}
        </Message.Content>
      </Message>
    );

    render() {
      const { isConfigLoading, isConfigError } = this.props;
      return (
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={6}>
              <Header as="h1">Add Tags Form</Header>
              {this.state.isTagSubmitError
                ? this._renderSubmitError("Error in submitting tags")
                : null}
              {this._renderAddTagFrom()}
            </Grid.Column>
          </Grid.Row>
          <Grid.Column width={10}>
            <Header as="h2">Available Tags</Header>
            {isConfigLoading ? (
              <Loader active inline />
            ) : isConfigError ? (
              this._renderSubmitError("Error in Fetching tags")
            ) : (
              <React.Fragment> {this._renderTags()} </React.Fragment>
            )}
          </Grid.Column>
        </Grid>
      );
    }
  }
);
