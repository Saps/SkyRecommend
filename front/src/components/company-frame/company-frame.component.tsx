import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { Alert, Box, Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Formik, FormikState } from 'formik';
import { changeCompanyFrame, findServices, getCompanyFrame, getCompanyFrameOptions, sendSurvey } from '~/api';
import { RootState } from "~/store/rootReducer";
import { CompanyFrame, CompanyFrameOptions, SurveyValues } from '~/types';
import { CompanyPropertiesComponent, SuccessModalComponent, SurveyModalComponent } from '../index';

import './company-frame.component.scss';

const defaultFrame: CompanyFrame = {
    company_name: '',
    inn: '',
    okved_osn: '',
    okved_dop: '',
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
    const [algorithmName, setAlgorithmName] = useState<string>('');
    const [foundServices, setFoundServices] = useState<string[]>([]);
    const [frame, setFrame] = useState<CompanyFrame>(defaultFrame);
    const [frameOptions, setFrameOptions] = useState<CompanyFrameOptions>(defaultFrameOptions);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [showServices, setShowServices] = useState<boolean>();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);

    function getUniqueValues(array: string[]): string[] {
        return array.filter((item: string, index: number, self: string[]) => self.indexOf(item) === index);
    }

    const getData = async () => {
        try {
            setShowServices(false);
            if (user.id > -1 && user.role !== 'admin') {
                setLoading(true);
                const [frame, frameOptions] = await Promise.all([
                    getCompanyFrame(),
                    getCompanyFrameOptions()
                ]);
                setFrame(frame);
                setFrameOptions(frameOptions);
                setShowServices(frame.srvs.length > 0);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onFormSubmit = async (newFrame: CompanyFrame): Promise<void> => {
        try {
            const result = await changeCompanyFrame(newFrame);
            console.log('result is', result);
        } catch (err) {
            console.error(err);
        }
    };

    const onFormReset = async (resetForm: (nextState?: Partial<FormikState<CompanyFrame>>) => void) => {
        await getData();
        resetForm({ values: frame });
    };

    const onSurveySubmit = async (values: SurveyValues) => {
        try {
            const result = await sendSurvey(values);
            setAlgorithmName('Алгоритм поиска на основе опроса');
            setFoundServices(result);
            setIsSuccessOpen(true);
            const srvs = getUniqueValues(frame.srvs.concat(result));
            setFrame({ ...frame, srvs });
            setShowServices(true);
        } catch (err) {
            console.error(err);
        }
    };

    const getAlgorithmResult = async () => {
        try {
            const result = await findServices();
            setAlgorithmName('Алгоритм поиска на основе исторической информации');
            setFoundServices(result);
            setIsSuccessOpen(true);
            const srvs = getUniqueValues(frame.srvs.concat(result));
            setFrame({ ...frame, srvs });
            setShowServices(true);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getData();
    }, [user.id, user.role]);

    if (user.id < 0) {
        return <Redirect to="/login" />
    } else if (user.role === 'admin') {
        return <Redirect to="/" />;
    }

    return (
        <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
            {loading
                ? <Alert severity="warning">Информация загружается.</Alert>
                : (
                    <>
                        <Formik initialValues={frame} onSubmit={onFormSubmit}>
                            {props =>
                                <form className="company-frame-form" onSubmit={props.handleSubmit} noValidate>
                                    <Grid container direction="column" rowSpacing={2} p={2}>
                                        <Grid item key="header">
                                            <Box component="h2" sx={{ marginBottom: '8px', textAlign: 'center' }}>
                                                Страница для тестового примера жюри
                                            </Box>
                                            <Box component="h3" sx={{ textAlign: 'center' }}>
                                                Основная информация о компании
                                            </Box>
                                        </Grid>
                                        <Grid item>
                                            <FormControl fullWidth variant="standard">
                                                <TextField
                                                    label={'Наименование'}
                                                    name={'company_name'}
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values['company_name']}
                                                    variant="standard"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <FormControl fullWidth variant="standard">
                                                <TextField
                                                    label={'ИНН'}
                                                    name={'inn'}
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values['inn']}
                                                    variant="standard"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <FormControl fullWidth variant="standard">
                                                <TextField
                                                    label={'ОКВД основной'}
                                                    name={'okved_osn'}
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values['okved_osn']}
                                                    variant="standard"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <FormControl fullWidth variant="standard">
                                                <TextField
                                                    label={'ОКВД дополнительные'}
                                                    name={'okved_dop'}
                                                    onBlur={props.handleBlur}
                                                    onChange={props.handleChange}
                                                    value={props.values['okved_dop']}
                                                    variant="standard"
                                                />
                                            </FormControl>
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
                                        {
                                            showServices && (
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
                                            )
                                        }
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
                                        <div className="form-options" key="submit">
                                            <Button color="primary" type="submit" variant="contained">
                                                Сохранить
                                            </Button>
                                            <Button color="info" type="button" variant="contained" onClick={() => onFormReset(props.resetForm)}>
                                                Сбросить
                                            </Button>
                                            <Button color="secondary" type="button" variant="contained" onClick={() => setIsOpen(true)}>
                                                Уточнить детали
                                            </Button>
                                            <Button color="secondary" type="button" variant="contained" onClick={() => getAlgorithmResult()}>
                                                Подобрать сервисы
                                            </Button>
                                            {
                                                showServices && (
                                                    <Button color="info" type="button" variant="contained" onClick={() => history.push('/companies')}>
                                                        Продолжить
                                                    </Button>
                                                )
                                            }
                                        </div>
                                    </Grid>
                                    {isOpen && <SurveyModalComponent onSubmit={onSurveySubmit} open={isOpen} setOpen={setIsOpen} />}
                                    {isSuccessOpen &&
                                        <SuccessModalComponent
                                            algorithmName={algorithmName}
                                            open={isSuccessOpen}
                                            services={foundServices}
                                            setOpen={setIsSuccessOpen}
                                        />
                                    }
                                </form>
                            }
                        </Formik>
                        <CompanyPropertiesComponent />
                    </>
                )
            }
        </Grid>
    );
};
