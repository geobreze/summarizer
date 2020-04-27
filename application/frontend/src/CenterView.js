import React from "react";
import {Container} from "react-bootstrap";
import {Row} from "react-bootstrap";
import {Col} from "react-bootstrap";

export default class CenterView extends React.Component {
    render() {
        return (
            <Container className="w-100 h-100">
                <Row className="w-100 h-100">
                    <Col />
                    <Col xs={10} md={10}>{this.props.children}</Col>
                    <Col />
                </Row>
            </Container>
        )
    }
}