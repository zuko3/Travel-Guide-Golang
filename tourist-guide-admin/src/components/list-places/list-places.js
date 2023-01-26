import React from "react";
import {
  Message,
  Icon,
  Label,
  Button,
  Checkbox,
  Input,
  Item,
  Header,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { placeActions } from "../../actions";
import { history, placeSelector } from "../../helper";
import { envConstants } from "../../constants";
import { placeService } from "../../services";

function mapDispatchToProps(dispatch) {
  const { fetchPlaces } = placeActions;
  return bindActionCreators({ fetchPlaces }, dispatch);
}

function mapStateToProps(state) {
  return {
    isLoading: placeSelector.getPlaceLoading(state),
    isError: placeSelector.getPlaceError(state),
    places: placeSelector.getPlaces(state),
  };
}

export const ListPlaces = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedIds: [],
        headerSelected: false,
        isDeleteError: false,
        isDeleting: false,
      };
    }

    componentDidMount() {
      this.props.fetchPlaces();
    }

    _getLoader = () => {
      return (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            We are fetching that content for you.
          </Message.Content>
        </Message>
      );
    };

    _getError = (message) => {
      return (
        <Message negative icon>
          <Icon name="remove circle" />
          <Message.Content>
            <Message.Header>Technical Error</Message.Header>
            {message}
          </Message.Content>
        </Message>
      );
    };

    _headerCheckBoxClicked = () => {
      const { headerSelected } = this.state;
      if (headerSelected) {
        this.setState({
          selectedIds: [],
          headerSelected: false,
        });
      } else {
        const ids = this.props.places.map((place) => place._id);
        this.setState({
          selectedIds: ids,
          headerSelected: true,
        });
      }
    };

    _itemCheckBoxClick = (_id) => () => {
      const { selectedIds } = this.state;
      if (selectedIds.includes(_id)) {
        selectedIds.splice(selectedIds.indexOf(_id), 1);
        this.setState({
          selectedIds: selectedIds,
        });
      } else {
        this.setState({
          selectedIds: [...this.state.selectedIds, _id],
        });
      }
    };

    _onDeleteButtonClicked = () => {
      const { selectedIds } = this.state;
      this.setState({
        isDeleteError: false,
        isDeleting: true,
      });
      placeService
        .deletePlaces({ ids: selectedIds })
        .then(() => {
          this.props.fetchPlaces();
          this.setState({
            selectedIds: [],
            headerSelected: false,
            isDeleteError: false,
            isDeleting: false,
          });
        })
        .catch((err) => {
          this.setState({
            selectedIds: [],
            headerSelected: false,
            isDeleteError: true,
            isDeleting: false,
          });
        });
    };

    _isCheckBoxChecked = (_id) => {
      const { headerSelected, selectedIds } = this.state;
      return headerSelected || selectedIds.includes(_id);
    };

    _handleItemClick = (_id) => () => {
      const place = this.props.places.find((place) => place._id === _id);
      history.push({
        pathname: "/view-modify-place",
        state: { place },
      });
    };
    _renderNone = () => {
      return (
        <Message warning icon>
          <Icon name="exclamation triangle" />
          <Message.Content>
            <Message.Header>No Data</Message.Header>
            Sorry you dont have any data to view.
          </Message.Content>
        </Message>
      );
    };

    _renderListPlace = () => {
      const { places = [] } = this.props;
      const { headerSelected } = this.state;
      return (
        <React.Fragment>
          <Header>
            <Checkbox
              checked={headerSelected}
              onClick={this._headerCheckBoxClicked}
              label={<label>Select All</label>}
            />
          </Header>
          <Item.Group>
            {places.map((place) => (
              <Item>
                <Item.Image
                  size="small"
                  src={`${envConstants.BASE_URL}/${place.images[0]}`}
                />
                <Item.Content>
                  <Item.Header>
                    <Checkbox
                      onClick={this._itemCheckBoxClick(place._id)}
                      checked={this._isCheckBoxChecked(place._id)}
                      disabled={headerSelected}
                      label={<label>{place.name}</label>}
                    />
                  </Item.Header>
                  <Item.Meta>
                    <div>
                      <Icon name="map marker alternate" /> {place.areas}
                    </div>
                  </Item.Meta>
                  <Item.Description>
                    <p>{place.description.substr(0, 250) + "  ...."}</p>
                  </Item.Description>
                  <Item.Extra>
                    <Button
                      basic
                      secondary
                      floated="right"
                      onClick={this._handleItemClick(place._id)}
                    >
                      View Details
                      <Icon name="right chevron" />
                    </Button>
                    {place.tags.map((tag, index) => (
                      <Label key={index} style={{ margin: "2px" }}>
                        {tag}
                        <Icon name="close" />
                      </Label>
                    ))}
                  </Item.Extra>
                </Item.Content>
              </Item>
            ))}
          </Item.Group>
        </React.Fragment>
      );
    };

    render() {
      const { isLoading, isError, places } = this.props;
      const { isDeleting, isDeleteError, selectedIds } = this.state;
      const isDeletButtonDisabled = isDeleting || selectedIds.length === 0;
      return (
        <React.Fragment>
          {isDeleteError ? this._getError("Error while deleting place") : null}
          <Header as="h1">List Of Added Places</Header>
          <Input icon="search" placeholder="Search..." />
          <Button
            floated="right"
            disabled={isDeletButtonDisabled}
            loading={isDeleting}
            onClick={this._onDeleteButtonClicked}
            style={{ marginLeft: "10px" }}
            negative
          >
            Delete
          </Button>
          {isLoading ? this._getLoader() : null}
          {isError
            ? this._getError("Sorry error occured try after some time.")
            : null}
          {!isError && !isLoading
            ? places.length > 0
              ? this._renderListPlace()
              : this._renderNone()
            : null}
        </React.Fragment>
      );
    }
  }
);
