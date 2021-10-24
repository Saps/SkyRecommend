import React, { useState } from 'react';
import {
    Alert, Button, Card, CardContent, Grid, Typography, Rating, Modal,
    FormControl, InputLabel, MenuItem, Select, Box, SelectChangeEvent
} from '@mui/material';

import { findCompanies } from '~/api';
import { CommonError, CompanyCandidate } from '~/types';

import './companies-list.component.scss';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    p: 4,
  };

export const CompaniesListComponent = (): JSX.Element => {
    const [error, setError] = useState<string>();
    const [services, setServices] = useState<CompanyCandidate[]>([]);
    const [searchType, setSearchType] = useState<string>('active');
    const [moreItem, setMoreItem] = useState<CompanyCandidate | null>(null);

    const onSearch = async () => {
        try {
            setError('');
            const result = await findCompanies(searchType === 'active');
            setServices(result);
        } catch (e) {
            console.error(e);
            setError((e as CommonError).message);
        }
    };

    const handleSearchTypeChange = async (e: SelectChangeEvent) => {
        const value: string = (e.target as HTMLSelectElement).value;

        setSearchType(value);
    };

    const handleDisplayMore = (item: CompanyCandidate) => {
        setMoreItem(item);
    };

    const handleModalClose = () => {
        setMoreItem(null);
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
            <Grid item key={`${item} ${index}`}>
                <Card>
                    <CardContent>
                        <Grid container alignItems="center" columnSpacing={2} className="card-content">
                            <Grid item className="card-content__item">
                                <Typography variant="h6">
                                    {item.name}
                                </Typography>
                                <Typography variant="body1">
                                    {item.type}
                                </Typography>
                            </Grid>
                            <Grid item className="card-content__item">
                                {renderMark(item.rating)}
                            </Grid>
                            <Grid item className="card-content__item">
                                <Button onClick={() => handleDisplayMore(item)}>подробнее</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        );
    }

    return (
        <>
            <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
                {error
                ? <Alert severity="error">{error}</Alert>
                : <Grid item container direction="column" spacing={2}>
                    <Grid item>
                        <Box component="h3">Рекомендованные компании</Box>
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
                                    <MenuItem value={'active'}>Действующие компании</MenuItem>
                                    <MenuItem value={'all'}>Все компании</MenuItem>
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
            <Modal open={Boolean(moreItem)} onClose={handleModalClose}>
                <Box sx={modalStyle} component="div">
                    <Grid container direction="column" rowSpacing={3}>
                        <Grid item>
                            <Typography variant="h6">{moreItem?.name}</Typography>
                            <Typography variant="body1">{moreItem?.type}</Typography>
                        </Grid>
                        {moreItem?.algos.length
                        ? <>
                            <Grid item>
                                <Box component="h4" sx={{ textAlign: 'center' }}>Использованные алгоритмы</Box>
                            </Grid>
                            {moreItem?.algos.map(entry => 
                                <Grid item>
                                    <Box component="h4">{entry.a_name}</Box>
                                    <Box component="div">{entry.a_message}</Box>
                                </Grid>
                            )}
                            
                        </>
                        : null}
                    </Grid>
                        
                </Box>
            </Modal>
        </>
    );
};
