import React, { useEffect, useState } from 'react';
import { Grid, FormControl, Select, MenuItem, Button, InputLabel, Box, Chip } from '@mui/material';
import { Formik } from 'formik';

import { getCompanyFrame, getCompanyFrameOptions, changeCompanyFrame } from '~/api';
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

export const FrameComponent = (): JSX.Element => {
    const [frame, setFrame] = useState<CompanyFrame>(defaultFrame);
    const [frameOptions, setFrameOptions] = useState<CompanyFrameOptions>(defaultFrameOptions);
    const [loading, setLoading] = useState<boolean>(true);

    const getData = async () => {
        const frame = await getCompanyFrame();
        const frameOptions = await getCompanyFrameOptions();

        setFrame(frame);
        setFrameOptions(frameOptions);
        setLoading(false);
    };

    const onFormSubmit = async (newFrame: CompanyFrame): Promise<void> => {
        try {
            const result = await changeCompanyFrame(newFrame);
            console.log('result is', result);
        } catch (e) {
            console.log(e);
        }

        alert(JSON.stringify(newFrame, null, 2));
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Grid container mt={1} direction="column" alignItems="center">
            <Grid item>
                {loading
                ? 'Подождите, загружаемся...'
                : <Formik initialValues={frame} onSubmit={onFormSubmit}>
                        {props =>
                            <form onSubmit={props.handleSubmit} noValidate>
                                <Grid container direction="column" rowSpacing={3} p={2}>
                                    <Grid item key="header" justifyContent="center">
                                        <Box component="h3" sx={{ textAlign: 'center' }}>Рамочный фрейм компании</Box>
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
                                        <Button type="submit" variant="contained">Сохранить</Button>
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
