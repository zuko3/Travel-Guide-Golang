import React from 'react';
import { Segment } from 'semantic-ui-react';

export class MapView extends React.Component {
    componentDidMount() {
        const uluru = { lat: parseFloat(this.props.lat) || 12.9716, lng: parseFloat(this.props.lon) || 77.5946 };
        const map = new window.google.maps.Map(this.mapcontainer, { zoom: 10, center: uluru });
        new window.google.maps.Marker({ position: uluru, map: map });
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return (<Segment>
            <div ref={ref => this.mapcontainer = ref} id="map" style={{ height: '400px', width: "100%" }}></div>
        </Segment>)
    }
}