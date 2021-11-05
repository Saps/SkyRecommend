import React, {useCallback, useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {
    Alert, Box, Button, ButtonGroup, FormControl, Grid, InputLabel, MenuItem, Paper, Select,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField
} from '@mui/material';
import { getServices, getServiceTypes } from "~/api";
import { ServiceGraphModalComponent } from '~/components';
import { CommonError, ServiceItem } from "~/types";

import './services-list.component.scss';

export const ServicesListComponent = (): JSX.Element => {
    const history = useHistory();
    const [currentList, setCurrentList] = useState<ServiceItem[]>([]);
    const [error, setError] = useState<string>();
    const [isSearched, setIsSearched] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>();
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [search, setSearch] = useState<string>('');
    const [serviceType, setServiceType] = useState<string>('all');
    const [serviceTypes, setServiceTypes] = useState<string[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [graphModalServiceId, setGraphModalServiceId] = useState<number | null>(null);

    const handleChangePage = async (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
        await onRefresh(rowsPerPage, newPage * rowsPerPage);
    };

    const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPage(0);
        setRowsPerPage(+event.target.value);
        await onRefresh(+event.target.value, 0);
    };

    const onRefresh = async (limit: number, offset: number) => {
        try {
            setCurrentList([]);
            setError('');
            setLoading(true);
            setIsSearched(true);
            const {result, total} = await getServices(limit, offset, search, serviceType === 'all' ? '' : serviceType);
            setCurrentList(result);
            setTotal(total);
        } catch (e) {
            console.error(e);
            setError((e as CommonError).message);
        } finally {
            setLoading(false);
        }
    };

    const onUpdate = async () => {
        setPage(0);
        await onRefresh(rowsPerPage, 0);
    };

    const loadServiceTypes = useCallback(async () => {
        try {
            setError('');
            setServiceTypes(await getServiceTypes());
        } catch (e) {
            console.error(e);
            setError((e as CommonError).message);
        }
    }, [setServiceTypes]);

    useEffect(() => {
        loadServiceTypes();
    }, [loadServiceTypes]);

    return (
        <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
            <Box component="h3" sx={{ paddingBottom: 2, textAlign: 'center' }}>
                Сервисы
            </Box>
            <Grid container item sx={{ justifyContent: 'center', alignItems: 'center', marginBottom: 2 }} spacing={2}>
                <Grid item>
                    <TextField
                        label="Поиск по строке"
                        onChange={event => setSearch(event.target.value)}
                        sx={{ width: '220px' }}
                        value={search}
                        variant="outlined"
                    />
                </Grid>
                <Grid item>
                    <FormControl sx={{ width: '220px' }}>
                        <InputLabel id="searchType">Тип сервисов</InputLabel>
                        <Select
                            labelId="searchType"
                            label="Тип сервисов"
                            onChange={event => setServiceType(event.target.value)}
                            value={serviceType}
                        >
                            <MenuItem key="all" value={'all'}>Все типы</MenuItem>
                            {serviceTypes.map((service: string) => <MenuItem key={service} value={service}>{service}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={onUpdate}>
                        Обновить
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="success" onClick={() => history.push('/algorithm-settings')}>
                        Настройка алгоритмов
                    </Button>
                </Grid>
            </Grid>
            {
                loading ? (
                    <Alert severity="warning">Информация загружается.</Alert>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : currentList.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table aria-label="sticky table" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Наименование сервиса</TableCell>
                                    <TableCell align="center">Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentList.map(item => (
                                    <TableRow
                                        key={item.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" align="center" scope="row">
                                            {item.serv_name}
                                        </TableCell>
                                        <TableCell align="center">
                                            <ButtonGroup variant="text" aria-label="text button group">
                                                <Button>Алгоритм формального соответствия</Button>
                                                <Button onClick={() => setGraphModalServiceId(item.id)}>Граф</Button>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={total}
                            labelDisplayedRows={e => `${e.from}-${e.to} из ${e.count !== -1 ? e.count : `больше чем ${e.to}`}`}
                            labelRowsPerPage="Количество элементов на странице"
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            page={page}
                            rowsPerPage={rowsPerPage}
                        />
                    </TableContainer>
                ) : isSearched ? (
                    <Alert severity="info">
                        Не были найдены данные, удовлетворяющие запросу. Для изменения запроса нужно обновить
                        поля "Поиск по строке" и "Тип сервисов", после чего нажать на кнопку "Обновить".
                    </Alert>
                ) : (
                    <Alert severity="info">
                        После нажатия на кнопку "Обновить" здесь отобразятся результаты поиска.
                        Также можно предварительно заполнить поля "Поиск по строке" и "Тип сервисов".
                    </Alert>
                )
            }
            {graphModalServiceId && (
                <ServiceGraphModalComponent
                    serviceId={graphModalServiceId}
                    onClose={() => setGraphModalServiceId(null)}
                />
            )}
        </Grid>
    )
};
