import {Button, Form} from "react-bootstrap";
import React from "react";

export default class TextSummary extends React.Component {
    render() {
        return (
            <Form className="mt-2 mb-2 w-100" hidden={this.props.hidden} onSubmit={(e) => e.preventDefault()}>
                <Form.Group>
                    <Form.Label as="h3" className="mb-3">Keywords by heuristic algorithm</Form.Label>
                    <div>
                        {
                            this.props.keywords_heuristic.map(function (name, index) {
                                return <span key={index}
                                             className="mr-1 badge text-white badge-success p-2">{name}</span>
                            })
                        }
                    </div>
                </Form.Group>
                <Form.Group>
                    <Form.Label as="h3" className="mb-3">Keywords by TF*IDF algorithm</Form.Label>
                    <div>
                        {
                            this.props.keywords_tfidf.map(function (name, index) {
                                return <span key={index}
                                             className="mr-1 badge text-white badge-success p-2">{name}</span>
                            })
                        }
                    </div>
                </Form.Group>
                <Form.Group>
                    <Form.Label as="h3" className="mb-3">Summary</Form.Label>
                    <p className="text-body bg-light p-2">
                        {this.props.summary}
                    </p>
                </Form.Group>
                <Form.Group hidden={!this.props.showSource}>
                    <Form.Label as="h3" className="mb-3">Source text</Form.Label>
                    <p className="text-body bg-light p-2">
                        {this.props.sourceText}
                    </p>
                </Form.Group>
                <Button hidden={!this.props.showBack} onClick={this.props.backCallback}>Try with other text</Button>
            </Form>
        );
    }
}