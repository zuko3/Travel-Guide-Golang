import React, { Component } from 'react';
import { Icon, Header, List, Image } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import "./location-image-dropzone.css";


export class LocationImageDropzone extends Component {
    constructor(props) {
        super(props);
        this.state = { files: [] };
    }

    onDrop = (files) => {
        const { field: { name }, form: { setFieldValue } } = this.props;
        this.setState({ files: [...this.state.files, ...files] }, () => setFieldValue(name, this.state.files))
    }

    uploadedFiles = () => {
        const { files } = this.state;
        if (files.length > 0) {
            return (
                <List verticalAlign='middle'>
                    {files.map(file => (
                        <List.Item key={file.name}>
                            <List.Content>
                                <List.Description>
                                    <Image avatar src={URL.createObjectURL(file)} />
                                    {file.name} - {file.size} bytes
                                    &nbsp;<List.Item as='a'>Delete</List.Item>
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            )
        }
        return [];
    }

    render() {
        const files = this.uploadedFiles();
        return (
            <Dropzone onDrop={this.onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <React.Fragment>
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <Header icon textAlign="center" size="small" color="grey">
                                <Icon name="cloud upload" color="grey" />
                                <Header.Content>
                                    <React.Fragment>
                                        Drag Files Here
                                            <Header.Subheader>
                                            Or click to browse
                                            </Header.Subheader>
                                    </React.Fragment>
                                </Header.Content>
                            </Header>
                        </div>
                        {files}
                    </React.Fragment>
                )}
            </Dropzone>
        );
    }
}

