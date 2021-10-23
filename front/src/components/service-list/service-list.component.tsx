import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    Button, Card, CardContent, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Typography
} from '@mui/material';

export const ServiceListComponent = (): JSX.Element => {
    const history = useHistory();

    return (
        <Grid container item direction="column" justifyContent="center" p={2} xs={12} sm={10} md={8}>
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
                    <Button variant="contained" color="primary">Подобрать</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="info" onClick={() => history.push('/company-properties')}>
                        Свойства компании
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={() => history.push('/company-frame')}>
                        Фрейм компании
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
