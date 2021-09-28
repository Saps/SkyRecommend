import React, {Component} from 'react';
import {Button, Link, TextField} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import {connect} from "react-redux";
import TopMenu from "../../visual/TopMenu/TopMenu";

class MainPage extends Component {

    props: any;

    constructor(props : any) {
        super(props);
    }

    render() {
        return(
            <div>
                <TopMenu />
                <div>
                    <h2>Main Page</h2>
                </div>

             </div>
        )

    }

}

export default connect()(MainPage);