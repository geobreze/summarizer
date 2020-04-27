import React from "react";
import {Link} from "react-router-dom";

export default class Header extends React.Component {
    render() {
        return (
            <div className="d-inline-flex align-content-between w-100 bg-info">
                <Link to="/" className="text-white btn w-50">Home</Link>
                <Link to="/documents" className="text-white btn w-50">All documents</Link>
            </div>
        );
    }
}