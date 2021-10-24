import React, { useState } from 'react';

import {
    Alert, Button, Card, CardContent, Grid, Typography,
    FormControl, InputLabel, MenuItem, Select, Box, SelectChangeEvent
} from '@mui/material';

import { findServices } from "~/api";
import { CommonError } from "~/types";

import './service-list.component.scss';

export const ServiceListComponent = (): JSX.Element => {
    const [error, setError] = useState<string>();
    const [services, setServices] = useState<string[]>([]);
    const [searchType, setSearchType] = useState<string>('active');

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

    const handleSearchTypeChange = async (e: SelectChangeEvent<string>) => {
        const value: string = (e.target as HTMLSelectElement).value;

        setSearchType(value);
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
        <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
            {error
            ? <Alert severity="error">{error}</Alert>
            : <Grid item container direction="column" spacing={2}>
                <Grid item>
                    <Box component="h3">Рекомендованные сервисы</Box>
                </Grid>
                <Grid item container alignItems="center" justifyContent="center" spacing={2}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={onSearch}>
                            Подобрать компании
                        </Button>
                    </Grid>
                    <Grid item>
                        <FormControl>
                            <InputLabel id="searchType">Тип поиска</InputLabel>
                            <Select
                                labelId="searchType"
                                label="Тип поиска"
                                value={searchType}
                                onChange={handleSearchTypeChange}
                            >
                                <MenuItem value={'active'}>Действующие программы</MenuItem>
                                <MenuItem value={'all'}>Все программы</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {services.length > 0
                ? services.map(renderService)
                : <Grid item>
                    <Alert severity="info">
                        После нажатия на кнопку "Подобрать компании" здесь отобразятся результаты поиска.
                    </Alert>
                </Grid>
                }
            </Grid>
            }
        </Grid>
    );
};
