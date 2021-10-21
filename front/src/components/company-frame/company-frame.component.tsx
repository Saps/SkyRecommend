import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Alert, Box, Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Formik, FormikState } from 'formik';

import { changeCompanyFrame, getCompanyFrame, getCompanyFrameOptions } from '~/api';
import { RootState } from "~/store/rootReducer";
import { CompanyFrame, CompanyFrameOptions } from '~/types';

const defaultFrame: CompanyFrame = {
    markets: [],
    srvs: [],
    study: '',
    techs: [],
};

const defaultFrameOptions: CompanyFrameOptions = {
    markets: [],
    srvs: [],
    study: [],
    techs: [],
};

export const CompanyFrameComponent = (): JSX.Element => {
    const [frame, setFrame] = useState<CompanyFrame>(defaultFrame);
    const [frameOptions, setFrameOptions] = useState<CompanyFrameOptions>(defaultFrameOptions);
    const [loading, setLoading] = useState<boolean>(true);
    const { id, role } = useSelector((state: RootState) => state.user);

    const getData = async () => {
        try {
            if (id > -1 && role !== 'admin') {
                const frame = await getCompanyFrame();
                const frameOptions = await getCompanyFrameOptions();

                setFrame(frame);
                setFrameOptions(frameOptions);
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onFormSubmit = async (newFrame: CompanyFrame): Promise<void> => {
        console.log(newFrame);
        try {
            const result = await changeCompanyFrame(newFrame);
            console.log('result is', result);
        } catch (e) {
            console.log(e);
        }
    };

    const onFormReset = async (resetForm: (nextState?: Partial<FormikState<CompanyFrame>>) => void) => {
        await getData();
        resetForm({ values: frame });
    };

    useEffect(() => {
        getData();
    }, [id, role]);

    if (id < 0) {
        return <Redirect to="/login" />
    } else if (role === 'admin') {
        return <Redirect to="/" />;
    }

    return (
        <Grid container direction="column" p={2} xs={12} sm={10} md={8} lg={6}>
            <Grid item>
                {loading
                ? <Alert severity="warning">Информация загружается.</Alert>
                : <Formik initialValues={frame} onSubmit={onFormSubmit}>
                        {props =>
                            <form onSubmit={props.handleSubmit} noValidate>
                                <Grid container direction="column" rowSpacing={3} p={2}>
                                    <Grid item key="header">
                                        <Box component="h3" sx={{ textAlign: 'center' }}>Фрейм компании</Box>
                                    </Grid>
                                    <Grid item key="study">
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel>Стадия</InputLabel>
                                            <Select
                                                label="Стадия"
                                                name="study"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                value={props.values.study}
                                            >
                                                <MenuItem key="null" value={''}>Не выбрано</MenuItem>
                                                {frameOptions.study.map(option =>
                                                    <MenuItem key={option} value={option}>{option}</MenuItem>)
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item key="markets">
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel>Рынки</InputLabel>
                                            <Select
                                                multiple
                                                label="Рынки"
                                                name="markets"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                value={props.values.markets || []}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                    </Box>
                                                )}
                                            >
                                                {frameOptions.markets.map(option =>
                                                    <MenuItem key={option} value={option}>{option}</MenuItem>)
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item key="srvs">
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel>Сервисы</InputLabel>
                                            <Select
                                                multiple
                                                label="Сервисы"
                                                name="srvs"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                value={props.values.srvs || []}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                    </Box>
                                                )}
                                            >
                                                {frameOptions.srvs.map(option =>
                                                    <MenuItem key={option} value={option}>{option}</MenuItem>)
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item key="techs">
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel>Технологии</InputLabel>
                                            <Select
                                                multiple
                                                label="Технологии"
                                                name="techs"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                value={props.values.techs || []}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                    </Box>
                                                )}
                                            >
                                                {frameOptions.techs.map(option =>
                                                    <MenuItem key={option} value={option}>{option}</MenuItem>)
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item container key="submit" justifyContent="center">
                                        <Button type="submit" variant="contained" sx={{ marginRight: '16px' }}>
                                            Сохранить
                                        </Button>
                                        <Button color="info" type="button" variant="contained" onClick={() => onFormReset(props.resetForm)}>
                                            Сбросить
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        }
                    </Formik>
                }
            </Grid>
        </Grid>
    );
};
