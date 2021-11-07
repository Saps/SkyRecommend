import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import {
    Alert, Box, Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Modal, Rating, Select, Typography
} from '@mui/material';
import { findCompanies } from '~/api';
import { RootState } from '~/store/rootReducer';
import type { CommonResponse, CompanyCandidate } from '~/types';

import './companies-list.component.scss';

export const CompaniesListComponent = (): JSX.Element => {
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);
    const [error, setError] = useState<string>();
    const [moreItem, setMoreItem] = useState<CompanyCandidate | null>(null);
    const [services, setServices] = useState<CompanyCandidate[]>([]);
    const [searchType, setSearchType] = useState<string>('active');

    const onSearch = async () => {
        try {
            setError('');
            const result = await findCompanies(searchType === 'active');
            setServices(result);
        } catch (e) {
            console.error(e);
            setError((e as CommonResponse).message);
        }
    };

    const renderMark = (rating: number): JSX.Element => {
        return (
            <Grid container alignItems="center" spacing={2}>
                <Grid item><Typography variant="body1">Оценка:</Typography></Grid>
                <Grid item><Rating value={rating / 10} precision={0.1} max={10} readOnly /></Grid>
            </Grid>
        );
    };

    const renderService = (item: CompanyCandidate, index: number): JSX.Element => {
        return (
            <Card key={`${item} ${index}`} sx={{ marginTop: 2 }}>
                <CardContent>
                    <Grid container alignItems="center" columnSpacing={2} className="card-content">
                        <Grid item className="card-content__item">
                            <Typography variant="h6">
                                {item.name}
                            </Typography>
                            <Typography variant="body1">
                                {item.type}
                            </Typography>
                            <Button onClick={() => setMoreItem(item)}>
                                Подробнее
                            </Button>
                        </Grid>
                        <Grid item className="card-content__item">
                            {renderMark(item.rating)}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }

    return user.role === 'admin' ? (
        <Redirect to="/" />
    ) : (
        <>
            <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
                {error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <>
                        <Box component="h3" sx={{ paddingBottom: 2, textAlign: 'center' }}>
                            Рекомендованные компании
                        </Box>
                        <Grid container item justifyContent="center" alignItems="center" spacing={2}>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={onSearch}>
                                    Подобрать компании
                                </Button>
                            </Grid>
                            <Grid item>
                                <FormControl sx={{ width: '220px' }}>
                                    <InputLabel id="searchType">Тип поиска</InputLabel>
                                    <Select
                                        labelId="searchType"
                                        label="Тип поиска"
                                        value={searchType}
                                        onChange={event => setSearchType(event.target.value)}
                                    >
                                        <MenuItem value={'active'}>Действующие компании</MenuItem>
                                        <MenuItem value={'all'}>Все компании</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="error" onClick={() => history.push('/')}>
                                    Назад
                                </Button>
                            </Grid>
                        </Grid>
                        {services.length > 0 ? services.map(renderService) : (
                            <Alert severity="info" sx={{ marginTop: 2 }}>
                                После нажатия на кнопку "Подобрать компании" здесь отобразятся результаты поиска.
                            </Alert>
                        )}
                    </>
                )}
            </Grid>
            {
                moreItem && (
                    <Modal open onClose={() => setMoreItem(null)}>
                        <div className="company-info-modal">
                            <button className="close-button" onClick={() => setMoreItem(null)}>
                                &#10006;
                            </button>
                            <Typography variant="h6" component="h2">{moreItem.name}</Typography>
                            <Typography variant="body1">{moreItem.type}</Typography>
                            {moreItem.algos.length > 0 && (
                                <>
                                    <Box component="h3" sx={{ paddingTop: '16px', textAlign: 'center' }}>
                                        Использованные алгоритмы
                                    </Box>
                                    {moreItem.algos.map(entry => (
                                        <Box key={`${moreItem.name}-info`} sx={{ marginTop: '16px' }}>
                                            <h4>{entry.a_name}</h4>
                                            <p>{entry.a_message}</p>
                                        </Box>
                                    ))}
                                </>
                            )}
                        </div>
                    </Modal>
                )
            }
        </>
    );
};
