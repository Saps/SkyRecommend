import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import {
    Alert, Button, Card, CardContent, Grid, Typography,
    FormControl, InputLabel, MenuItem, Select, Box
} from '@mui/material';

import { findServices } from "~/api";
import { CommonError } from "~/types";

import './service-list.component.scss';

export const ServiceListComponent = (): JSX.Element => {
    const [error, setError] = useState<string>();
    const [services, setServices] = useState<string[]>([]);

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

    const BottomBox = styled(Box)(({ theme }) => ({
        padding: 2,
        [theme.breakpoints.up('lg')]: {
            width: '50%',
        },
    }));

    const renderService = (item: string, index: number): JSX.Element => {
        return (
            <Grid item container alignItems="center" spacing={2} key={`${item} ${index}`}>
                <Grid item xs={12} lg={8}>
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
                <Grid item container xs={12} lg={2}>
                    <Button fullWidth variant="contained" color="primary">Подобрать партнера</Button>
                </Grid>
                <Grid item xs={12} lg={2}>
                    <FormControl fullWidth>
                        <InputLabel id="searchType">Тип поиска</InputLabel>
                        <Select labelId="searchType" label="Тип поиска" value={'active'}>
                            <MenuItem value={'active'}>Действующие программы</MenuItem>
                            <MenuItem value={'opt2'}>Опция 2</MenuItem>
                            <MenuItem value={'opt3'}>Опция 3</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
            <Grid container item justifyContent="center" spacing={2} mb={3}>
                <Grid item key="search-button">
                    <Button variant="contained" color="primary" onClick={onSearch}>Подобрать сервисы</Button>
                </Grid>
            </Grid>
            {
                error ? (
                    <Alert severity="error">{error}</Alert>
                ) : services.length > 0 ? (
                    <>
                        <Grid item container direction="column" rowSpacing={{ xs: 6, lg: 3 }} columnSpacing={2}>
                            <Grid item>
                                <Typography variant="h3">Рекомендованные сервисы</Typography>
                            </Grid>
                            {services.map(renderService)}
                            <Grid item container direction="column" rowSpacing={{ xs: 6, lg: 3 }} columnSpacing={2}>
                                <Grid item>
                                    <BottomBox>
                                        <Typography color="primary" fontSize={24} fontWeight="bold" mb={3}>
                                            Чтобы наиболее точно подобрать сервисы, подходящие вашей ситуации, пожалуйста, пройдите опрос
                                        </Typography>
                                        <Grid item container spacing={2}>
                                            <Grid item>
                                                <Button variant="contained" color="primary">Пройти опрос</Button>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" color="primary">Продолжить самостоятельно</Button>
                                            </Grid>
                                        </Grid>
                                    </BottomBox>
                                    
                                </Grid>
                                {/* <Grid item container spacing={2}>
                                    <Grid item>
                                        <Button variant="contained" color="primary">Пройти опрос</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" color="primary">Продолжить самостоятельно</Button>
                                    </Grid>
                                </Grid> */}
                            </Grid>
                        </Grid>
                    </>

                ) : (
                    <Alert severity="info">
                        После нажатия на кнопку "Подобрать сервисы" здесь отобразятся результаты поиска.
                    </Alert>
                )
            }
        </Grid>
    );
};
