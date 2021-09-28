import React, {Component} from 'react';
import {Button, TextField} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import {connect} from "react-redux";

class TopMenu extends Component {

    props: any;

    constructor(props : any) {
        super(props);
    }

    render() {
        return(
            <div>
                <h1>Top</h1>
                <Button variant="contained" href="/info/who">Who we are</Button>
            </div>
        )

    }

}

export default connect()(TopMenu);