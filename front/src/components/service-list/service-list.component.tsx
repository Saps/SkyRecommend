import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { findServices } from "~/api";
import { CommonError } from "~/types";

import './service-list.component.scss';

export const ServiceListComponent = (): JSX.Element => {
    const history = useHistory();
    const [error, setError] = useState<string>();
    const [services, setServices] = useState<string[]>([]);

    useEffect(() => {
        onSearch();
    }, []);

    const onSearch = async () => {
        try {
            setError('');
            const result = await findServices();
            setServices(result);
        } catch (e) {
            console.error(e);
            setError((e as CommonError).message);
        }
    };

    const renderMark = (index: number): JSX.Element => {
        if (index % 4 === 0) {
            return (
                <Typography variant="body1" color="success.main">
                    Оценка: хорошо<br />
                    По скорости: средне<br />
                    Рискованность: высокая
                </Typography>
            );
        } else if (index % 4 === 1) {
            return (
                <Typography variant="body1" color="primary">
                    Оценка: хорошо<br />
                    По скорости: средне<br />
                    Рискованность: высокая
                </Typography>
            );
        } else if (index % 4 === 2) {
            return (
                <Typography variant="body1" color="warning.main">
                    Оценка: хорошо<br />
                    По скорости: средне<br />
                    Рискованность: высокая
                </Typography>
            );
        } else {
            return (
                <Typography variant="body1" color="error">
                    Оценка: хорошо<br />
                    По скорости: средне<br />
                    Рискованность: высокая
                </Typography>
            );
        }
    };

    const renderService = (item: string, index: number): JSX.Element => {
        return (
            <Grid item key={`${item} ${index}`}>
                <Card>
                    <CardContent>
                        <Grid container alignItems="center" columnSpacing={2} className="card-content">
                            <Grid item className="card-content__item">
                                <Typography variant="h6">
                                    {item}
                                </Typography>
                                <Typography variant="body1">
                                    Описание
                                </Typography>
                            </Grid>
                            <Grid item className="card-content__item">
                                {renderMark(index)}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        );
    }

    return (
        <Grid container item direction="column" justifyContent="center" p={2} xs={12} sm={10} md={8}>
            <Grid container item justifyContent="center" spacing={2} mb={5}>
                {/*<Grid item>*/}
                {/*    <FormControl>*/}
                {/*        <InputLabel id="searchType">Тип поиска</InputLabel>*/}
                {/*        <Select labelId="searchType" label="Тип поиска" value={'guaranteed'}>*/}
                {/*            <MenuItem value={'guaranteed'}>Гарантированный</MenuItem>*/}
                {/*            <MenuItem value={'fast'}>Быстрый</MenuItem>*/}
                {/*            <MenuItem value={'perspective'}>Перспективный</MenuItem>*/}
                {/*        </Select>*/}
                {/*    </FormControl>*/}
                {/*</Grid>*/}
                <Grid item key="search-button">
                    <Button variant="contained" color="primary" onClick={onSearch}>Подобрать</Button>
                </Grid>
                <Grid item key="company-properties-button">
                    <Button variant="contained" color="info" onClick={() => history.push('/company-properties')}>
                        Свойства компании
                    </Button>
                </Grid>
                <Grid item key="company-frame-button">
                    <Button variant="contained" color="secondary" onClick={() => history.push('/company-frame')}>
                        Фрейм компании
                    </Button>
                </Grid>
            </Grid>
            {
                error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <Grid item container direction="column" rowSpacing={2} columnSpacing={2}>
                        {services.map(renderService)}
                    </Grid>
                )
            }
        </Grid>
    );
};
