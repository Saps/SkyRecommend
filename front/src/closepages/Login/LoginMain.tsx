import React, {Component} from 'react';
import {connect} from "react-redux";
import TopMenu from "../../visual/TopMenu/TopMenu";

class LoginMain extends Component {

    render() {
        return (
            <div>
                <TopMenu/>
                Loginto...
            </div>
        )
    }
}

export default connect()(LoginMain);