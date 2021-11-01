import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { Alert, Box, Button, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { changeCompanyFrame, findServices, getCompanyFrame, getCompanyFrameOptions, sendSurvey } from '~/api';
import { RootState } from "~/store/rootReducer";
import { CompanyFrameOptions, SurveyValues } from '~/types';
import { CompanyPropertiesComponent, ConfirmModalComponent, SuccessModalComponent, SurveyModalComponent } from '../index';

import './company-frame.component.scss';

export const CompanyFrameComponent = (): JSX.Element => {
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);
    const [algorithmName, setAlgorithmName] = useState<string>('');
    const [foundServices, setFoundServices] = useState<string[]>([]);
    const [frameOptions, setFrameOptions] = useState<CompanyFrameOptions>({ markets: [], srvs: [], study: [], techs: [] });
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
    const [isSurveyModalOpen, setIsSurveyModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const { handleBlur, handleChange, handleSubmit, setValues, values } = useFormik({
        initialValues: {
            company_name: '',
            inn: '',
            okved_osn: '',
            okved_dop: '',
            markets: [] as string[],
            srvs: [] as string[],
            study: '',
            techs: [] as string[],
        },
        onSubmit: () => setIsConfirmModalOpen(true),
    });

    function getUniqueValues(array: string[]): string[] {
        return array.filter((item: string, index: number, self: string[]) => self.indexOf(item) === index);
    }

    const getData = async () => {
        try {
            if (user.id > -1 && user.role !== 'admin') {
                setLoading(true);
                const [frame, frameOptions] = await Promise.all([
                    getCompanyFrame(),
                    getCompanyFrameOptions()
                ]);
                await setValues(frame);
                setFrameOptions(frameOptions);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onFormSubmit = async () => {
        try {
            const result = await changeCompanyFrame(values);
            console.log('result is', result);
            history.push('/companies');
        } catch (err) {
            console.error(err);
        }
    };

    const onSurveyModalSubmit = async (surveyValues: SurveyValues) => {
        try {
            const result = await sendSurvey(surveyValues);
            setAlgorithmName('Алгоритм поиска на основе опроса');
            setFoundServices(result);
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const getAlgorithmResult = async () => {
        try {
            const result = await findServices();
            setAlgorithmName('Алгоритм поиска на основе исторической информации');
            setFoundServices(result);
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const onSuccessModalSubmit = async () => {
        await setValues({ ...values, srvs: getUniqueValues(values.srvs.concat(foundServices)) });
        onSuccessModalCancel();
    };

    const onSuccessModalCancel = () => {
        setAlgorithmName('');
        setFoundServices([]);
        setIsSuccessModalOpen(false);
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
                        <form className="company-frame-form" onSubmit={handleSubmit} noValidate>
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
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values['company_name']}
                                            variant="standard"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth variant="standard">
                                        <TextField
                                            label={'ИНН'}
                                            name={'inn'}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values['inn']}
                                            variant="standard"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth variant="standard">
                                        <TextField
                                            label={'ОКВД основной'}
                                            name={'okved_osn'}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values['okved_osn']}
                                            variant="standard"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth variant="standard">
                                        <TextField
                                            label={'ОКВД дополнительные'}
                                            name={'okved_dop'}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values['okved_dop']}
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
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.study}
                                        >
                                            <MenuItem key="null" value={''}>Не выбрано</MenuItem>
                                            {frameOptions.study.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
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
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.markets || []}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {frameOptions.markets.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
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
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.srvs || []}
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
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.techs || []}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {frameOptions.techs.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <div className="form-options" key="submit">
                                    <Button color="primary" type="submit" variant="contained">
                                        Сохранить
                                    </Button>
                                    <Button color="info" type="button" variant="contained" onClick={getData}>
                                        Сбросить
                                    </Button>
                                    <Button color="secondary" type="button" variant="contained" onClick={() => setIsSurveyModalOpen(true)}>
                                        Уточнить детали
                                    </Button>
                                    <Button color="secondary" type="button" variant="contained" onClick={() => getAlgorithmResult()}>
                                        Подобрать сервисы
                                    </Button>
                                </div>
                            </Grid>
                            {isSurveyModalOpen && (
                                <SurveyModalComponent onSubmit={onSurveyModalSubmit} setOpen={setIsSurveyModalOpen} />
                            )}
                            {isSuccessModalOpen && (
                                <SuccessModalComponent
                                    algorithmName={algorithmName}
                                    foundServices={foundServices}
                                    onCancel={onSuccessModalCancel}
                                    onSubmit={onSuccessModalSubmit}
                                />
                            )}
                            {isConfirmModalOpen && (
                                <ConfirmModalComponent
                                    info={'Вы действительно хотите сохранить профиль компании и перейти к подбору партнеров?'}
                                    onSubmit={onFormSubmit}
                                    setOpen={setIsConfirmModalOpen}
                                />
                            )}
                        </form>
                        <CompanyPropertiesComponent />
                    </>
                )
            }
        </Grid>
    );
};
