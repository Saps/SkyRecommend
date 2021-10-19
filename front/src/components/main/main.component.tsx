import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import {
    Button, Card, CardContent, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Typography
} from '@mui/material';
import { getToken } from '~/api';
import { RootState } from '~/store/rootReducer';
import { getCurrentUserAction } from '~/store/user/actions';
import { AppState } from '~/types';

import './main.component.scss';

export const MainComponent = (): JSX.Element => {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const history = useHistory();
    const { id } = useSelector((state: AppState) => state.user);

    useEffect(() => {
        if (id > -1 || getToken) {
            dispatch(getCurrentUserAction());
        } else {
            history.replace('/login');
        }
    }, []);

    return (
        <Grid container item direction="column" justifyContent="center" mt={1} p={2} xs={6}>
            <Grid container item alignItems="center" spacing={2} mb={5}>
                <Grid item>
                    <FormControl>
                        <InputLabel id="searchType">Тип поиска</InputLabel>
                        <Select labelId="searchType" label="Тип поиска" value={'guaranteed'}>
                            <MenuItem value={'guaranteed'}>Гарантированный</MenuItem>
                            <MenuItem value={'fast'}>Быстрый</MenuItem>
                            <MenuItem value={'perspective'}>Перспективный</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="success">Подобрать</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary">Моя траектория</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="info" onClick={() => history.push('/company')}>
                        Мои свойства
                    </Button>
                </Grid>
            </Grid>
            <Grid item container direction="column" rowSpacing={2} columnSpacing={2}>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={5}>
                                    <Typography variant="h6">
                                        Рекомендуемый сервис
                                    </Typography>
                                    <Typography variant="body1">
                                        Описание
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="body1" color="success.main">
                                        Оценка: хорошо<br />
                                        По скорости: средне<br />
                                        Рискованность: высокая
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={5}>
                                    <Typography variant="h6">
                                        Рекомендуемый сервис
                                    </Typography>
                                    <Typography variant="body1">
                                        Описание
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="body1" color="primary">
                                        Оценка: хорошо<br />
                                        По скорости: средне<br />
                                        Рискованность: высокая
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={5}>
                                    <Typography variant="h6">
                                        Рекомендуемый сервис
                                    </Typography>
                                    <Typography variant="body1">
                                        Описание
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="body1" color="warning.main">
                                        Оценка: хорошо<br />
                                        По скорости: средне<br />
                                        Рискованность: высокая
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={5}>
                                    <Typography variant="h6">
                                        Рекомендуемый сервис
                                    </Typography>
                                    <Typography variant="body1">
                                        Описание
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="body1" color="error">
                                        Оценка: хорошо<br />
                                        По скорости: средне<br />
                                        Рискованность: высокая
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};
