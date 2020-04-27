import React from "react";
import {Button, Form} from "react-bootstrap";
import FormControl from "react-bootstrap/FormControl";

export default class InputForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDisabled: true,
            file: undefined,
            isFileDisabled: false,
            isTextDisabled: false,
            error: "",
            inputText: "",
            keywordsNum: 3,
            keySentencesNum: 2
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.submitCallback(this.state.inputText, this.state.file, this.state.keywordsNum, this.state.keySentencesNum);
    }

    handleChange(event) {
        const inputText = event.target.name === "input_text" ? event.target.value : this.state.inputText;
        const file = event.target.name === "file" ? event.target.files[0] : this.state.file;
        if (file !== undefined && !file.name.endsWith(".txt")) {
            this.setState({error: "File should have .txt extension"});
            event.preventDefault();
            return;
        }
        this.setState({
            inputText: inputText,
            file: file,
            isDisabled: (inputText === "") ^ (file !== undefined),
            isFileDisabled: inputText !== "",
            isTextDisabled: file !== undefined,
            error: "",
            keywordsNum: event.target.name === "keywords" ? event.target.value : this.state.keywordsNum,
            keySentencesNum: event.target.name === "keysentences" ? event.target.value : this.state.keySentencesNum
        });
    }

    render() {
        return (
            <Form hidden={this.props.hidden} onSubmit={this.handleSubmit}>
                <Form.Group controlId="article_input">
                    <Form.Label as="h3" className="mb-3">Input article here</Form.Label>
                    <FormControl name="input_text" as="textarea" value={this.state.inputText}
                                 onChange={this.handleChange} disabled={this.state.isTextDisabled}/>
                </Form.Group>
                <Form.Group controlId="article_upload">
                    <Form.Label as="h3" className="mb-3">Or upload file</Form.Label>
                    <Form.File disabled={this.state.isFileDisabled} name="file" onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group controlId="keywords_num">
                    <Form.Label as="h3" className="mb-3">Enter number of keywords</Form.Label>
                    <Form.Control name="keywords" onChange={this.handleChange} type="range" custom min="1" max="10"
                                  value={this.state.keywordsNum}/>
                    <p>
                        Selected value: {this.state.keywordsNum}
                    </p>
                </Form.Group>
                <Form.Group controlId="key_sentences_num">
                    <Form.Label as="h3" className="mb-3">Enter number of key sentences</Form.Label>
                    <Form.Control name="keysentences" onChange={this.handleChange} type="range" custom min="1"
                                  max="10" value={this.state.keySentencesNum}/>
                    <p>
                        Selected value: {this.state.keySentencesNum}
                    </p>
                </Form.Group>
                <div hidden={this.state.error === ""} className="alert alert-danger">
                    {this.state.error}
                </div>
                <Button className="mt-3" variant={this.state.isDisabled ? "danger" : "primary"} type="submit"
                        disabled={this.state.isDisabled}>
                    Submit
                </Button>
            </Form>
        );
    }
}