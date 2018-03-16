import React from 'react';
import {
  StyleSheet,
  Text,
  VrButton,
} from 'react-vr';

export default class ZoomButton extends React.Component {
  constructor(props) {
    super(props);
    this.styles = StyleSheet.create({
      button: {
        height: 0.4,
        margin: 0.05,
        backgroundColor: 'red',
      },
      text: {
        fontSize: 0.3,
        textAlign: 'center',
      },
    });
  }

  render() {
    return (
      <VrButton style={this.styles.button}
        onClick={() => this.props.zoom()}
        >
        <Text style={this.styles.text}>
          {this.props.text}
        </Text>
      </VrButton>
    );
  }
}