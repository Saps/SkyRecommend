import React from 'react';
import {Button} from '@mui/material';

export const HeaderComponent = (): JSX.Element => {
    return(
        <div>
            <h1>Top</h1>
            <Button variant="contained" href="/info/who">Who we are</Button>
        </div>
    )
}
