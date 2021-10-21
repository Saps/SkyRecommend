import React from 'react';
import { Alert, Grid } from '@mui/material';

export const AdminPageComponent = (): JSX.Element => {
    return (
        <Grid container item direction="column" p={2} xs={12} sm={10} md={8} lg={6}>
            <Alert severity="error">
                Данная страница находится в процессе разработки.
            </Alert>
        </Grid>
    )
};
