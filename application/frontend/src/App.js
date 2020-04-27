import React from 'react';
import CenterView from "./CenterView";
import InputForm from "./InputForm";
import Spinner from "react-bootstrap/Spinner";
import TextSummary from "./TextSummary";
import Header from "./Header";
import env from "@beam-australia/react-env";

export const API_URL = "http://" + env("API_IP");

export class App extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            inputForm: true,
            sourceText: "",
            loading: false,
            keywords_heuristic: [],
            keywords_tfidf: [],
            summary: "",
            showSummary: false,
            error: ""
        };
        this.state = this.defaultState;
    }

    requestPageRankSummary(text, file, keywordsNum, keySentencesNum) {
        const data = new FormData();
        if (file === undefined) {
            file = new File([text], text.split(' ')[0] + '.txt');
        }
        data.append('file', file);
        this.setState({loading: true, inputForm: false, error: ""}, () => {
            fetch(API_URL + "/api/summary?keywords=" + keywordsNum + "&sentences=" + keySentencesNum, {
                method: 'POST',
                body: data
            })
                .then(r => r.json())
                .then(r => this.setState({
                    loading: false,
                    keywords_heuristic: r['keywords_heuristic'],
                    keywords_tfidf: r['keywords_tfidf'],
                    summary: r['summary'],
                    sourceText: r['source'],
                    inputForm: false,
                    showSummary: true
                })).catch(r => this.setState({
                inputForm: true,
                sourceText: "",
                loading: false,
                keywords_heuristic: [],
                keywords_tfidf: [],
                summary: "",
                showSummary: false,
                error: "An unexpected error occurred. Try again please. If error repeats, contact support."
            }))
        });
    }

    backCallback() {
        window.location.reload();
    }

    render() {
        return (
            <div>
                <Header/>
                <CenterView>
                    <div className="mt-5 h-100 d-flex flex-column align-items-center justify-content-center">
                        <Spinner className="m-auto" hidden={!this.state.loading} animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        <div className="d-flex justify-content-center align-items-center">
                            <InputForm className="h-100 w-100" hidden={!this.state.inputForm}
                                       submitCallback={(text, file, keywordsNum, keySentencesNum) => this.requestPageRankSummary(text, file, keywordsNum, keySentencesNum)}/>
                        </div>
                        <TextSummary backCallback={() => this.backCallback()} showBack={true}
                                     showSource={true} hidden={!this.state.showSummary}
                                     keywords_tfidf={this.state.keywords_tfidf}
                                     keywords_heuristic={this.state.keywords_heuristic}
                                     sourceText={this.state.sourceText} summary={this.state.summary}/>

                        <div hidden={this.state.error === ""} className="mt-3 alert alert-danger">
                            {this.state.error}
                        </div>
                    </div>
                </CenterView>
            </div>
        );
    }
}
