import React from 'react';
import { Input, Icon } from 'semantic-ui-react';

//TO DO: No needed when api key is premium
const Lattitude_Longitude_array = [
    ['-31.747000', '115.803001'],
    ['-32.071999', '115.995003'],
    ['-32.105999', '115.782997'],
    ['-32.016998', '115.933998'],
    ['-31.886999', '115.906998'],
    ['-32.153057', '116.014999'],
    ['-32.280998', '115.726997'],
    ['-20.736000', '116.846001'],
    ['-32.528889', '115.723053'],
    ['-30.748890', '121.465836'],
    ['-31.745001', '115.766113'],
    ['-32.056946', '115.743889'],
    ['-33.647778', '115.345833'],
    ['-33.333332', '115.633331'],
    ['-35.022778', '117.881386'],
    ['-35.282001', '149.128998'],
    ['-26.650000', '153.066666'],
    ['-28.016666', '153.399994'],
    ['-37.840935', '144.946457']
];

export class LocationSearch extends React.Component {
    componentDidMount() {
        const { form: { initialValues: { areas } } } = this.props;
        this.locationinput.value = areas;
        this.autosuggestion = new window.google.maps.places.Autocomplete(this.locationinput);
        this.autosuggestion.addListener('place_changed', () => {
            let place = this.autosuggestion.getPlace();
            if (place.name) {
                //TO DO: Add custome code to get the Lattitude and longitude when api key is premium
                const [lat, lon] = Lattitude_Longitude_array[Math.floor(Math.random() * Lattitude_Longitude_array.length)];
                this._set_Lat_Lon(place, lat, lon);
            }
        });
    }

    shouldComponentUpdate() {
        return false;
    }

    _set_Lat_Lon = (place, lat, lon) => {
        const { field: { name }, form: { setFieldValue } } = this.props;
        setFieldValue(name, place.name);
        setFieldValue("lat", lat);
        setFieldValue("lon", lon);
    }

    render() {
        return (
            <React.Fragment>
                <Input icon placeholder='search'>
                    <input ref={ref => this.locationinput = ref} />
                    <Icon name='search' />
                </Input>
            </React.Fragment>
        )
    }

}