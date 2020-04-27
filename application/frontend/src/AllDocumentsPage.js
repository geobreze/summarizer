import React from "react";
import Header from "./Header";
import TextSummary from "./TextSummary";
import {API_URL} from "./App";
import CenterView from "./CenterView";
import Spinner from "react-bootstrap/Spinner";

export default class AllDocumentsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            documents: []
        };
    }

    componentDidMount() {
        this.setState({loading: true}, () =>
            fetch(API_URL + "/api/documents")
                .then(r => r.json())
                .then(r => this.setState({loading: false, documents: r['documents']}))
        );
    }

    render() {
        return (
            <div>
                <Header/>
                <CenterView>
                    <div className="mt-5 d-flex flex-column align-items-center justify-content-center">
                        <Spinner className="m-auto" hidden={!this.state.loading} animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        {
                            this.state.documents.map(function (document, index) {
                                return <TextSummary key={index}
                                                    showSource={true} keywords_tfidf={document.keywords_tfidf}
                                                    keywords_heuristic={document.keywords_heuristic}
                                                    sourceText={document.source} summary={document.summary}/>
                            })
                        }
                    </div>
                </CenterView>
            </div>
        );
    }
}