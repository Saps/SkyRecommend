import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';

import {
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Card,
    CardContent,
    Typography,
    Grid
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
    }, [dispatch, history, id]);

    return (
        <Grid container justifyContent="center" mt={2}>
            <Grid item xs={6} container direction="column" rowSpacing={2} columnSpacing={2} p={2}>
                <Grid container item alignItems="center" rowSpacing={2} columnSpacing={2} mb={5}>
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
                        <Button variant="contained" color="success">Подобрать сервис</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained">Моя траектория</Button>
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
        </Grid>
    );
};
