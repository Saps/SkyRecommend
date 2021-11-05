import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Alert, Box, Button, Checkbox, Chip, FormControl, FormHelperText,
    Grid, InputLabel, ListItemText, MenuItem, Select, TextField
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { changeCompanyFrame, findServices, getCompanyFrame, getCompanyFrameOptions, sendSurvey } from '~/api';
import { CompanyFrameOptions, SurveyValues } from '~/types';
import { CompanyPropertiesComponent, ConfirmModalComponent, SuccessModalComponent, SurveyModalComponent } from '../index';

import './company-frame.component.scss';

export const CompanyFrameComponent = (): JSX.Element => {
    const history = useHistory();
    const [foundServices, setFoundServices] = useState<string[]>([]);
    const [foundTasks, setFoundTasks] = useState<string[]>([]);
    const [frameOptions, setFrameOptions] = useState<CompanyFrameOptions>({ markets: [], srvs: [], study: [], techs: [] });
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
    const [isSurveyModalOpen, setIsSurveyModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const { errors, isValid, handleBlur, handleChange, handleSubmit, setFieldValue, setValues, values } = useFormik({
        initialValues: {
            company_name: '',
            inn: '',
            okved_osn: '',
            okved_dop: '',
            study: '',
            markets: [] as string[],
            srvs: [] as string[],
            techs: [] as string[],
        },
        validationSchema: Yup.object({
            company_name: Yup.string().required('Введите наименование компании'),
            inn: Yup.string().required('Введите ИНН'),
            okved_osn: Yup.string().required('Введите основной ОКВЭД'),
            study: Yup.string().required("Выберите стадию"),
            markets: Yup.array().min(1, 'Выберите хотя бы один рынок'),
            srvs: Yup.array().min(1, 'Выберите хотя бы один сервис'),
            techs: Yup.array().min(1, 'Выберите хотя бы одну технологию'),
        }),
        onSubmit: () => setIsConfirmModalOpen(true),
    });

    function getUniqueValues(array: string[]): string[] {
        return array.filter((item: string, index: number, self: string[]) => self.indexOf(item) === index);
    }

    const getData = async () => {
        try {
            setLoading(true);
            const [frame, frameOptions] = await Promise.all([
                getCompanyFrame(),
                getCompanyFrameOptions()
            ]);
            await setValues(frame);
            setFrameOptions(frameOptions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onFormSubmit = async () => {
        try {
            await changeCompanyFrame(values);
            history.push('/companies');
        } catch (err) {
            console.error(err);
        }
    };

    const onSurveyModalSubmit = async (surveyValues: SurveyValues) => {
        try {
            const { needs, servs } = await sendSurvey(surveyValues);
            setFoundServices(servs);
            setFoundTasks(needs);
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const getAlgorithmResult = async () => {
        try {
            const { servs } = await findServices();
            setFoundServices(servs);
            setFoundTasks([]);
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const onSuccessModalSubmit = async () => {
        await setFieldValue('srvs', getUniqueValues(values.srvs.concat(foundServices)));
        onSuccessModalCancel();
    };

    const onSuccessModalCancel = () => {
        setFoundServices([]);
        setIsSuccessModalOpen(false);
    };

    useEffect(() => {
        getData();
    }, []);

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
                                            error={!!errors.company_name}
                                            helperText={errors.company_name}
                                            label={'Наименование'}
                                            name={'company_name'}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            required
                                            value={values.company_name}
                                            variant="standard"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth variant="standard">
                                        <TextField
                                            error={!!errors.inn}
                                            helperText={errors.inn}
                                            label={'ИНН'}
                                            name={'inn'}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            required
                                            value={values.inn}
                                            variant="standard"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth variant="standard">
                                        <TextField
                                            error={!!errors.okved_osn}
                                            helperText={errors.okved_osn}
                                            label={'ОКВЭД основной'}
                                            name={'okved_osn'}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            required
                                            value={values.okved_osn}
                                            variant="standard"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth variant="standard">
                                        <TextField
                                            label={'ОКВЭД дополнительные'}
                                            name={'okved_dop'}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.okved_dop}
                                            variant="standard"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item key="study">
                                    <FormControl error={!!errors.study} fullWidth variant="standard">
                                        <InputLabel>Стадия</InputLabel>
                                        <Select
                                            label="Стадия"
                                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                                            name="study"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            required
                                            value={values.study}
                                        >
                                            <MenuItem key="null" value={''}>Не выбрано</MenuItem>
                                            {frameOptions.study.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.study && <FormHelperText>{errors.study}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item key="markets">
                                    <FormControl error={!!errors.markets} fullWidth variant="standard">
                                        <InputLabel>Рынки</InputLabel>
                                        <Select
                                            label="Рынки"
                                            MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}
                                            multiple
                                            name="markets"
                                            onBlur={handleBlur}
                                            onChange={event => {
                                                handleChange(event);
                                                event.target.value.slice(-1)[0] === 'All' && setFieldValue('markets',
                                                    values.markets.length < frameOptions.markets.length ? frameOptions.markets.slice() : []
                                                );
                                            }}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => <Chip key={value} label={value} />)}
                                                </Box>
                                            )}
                                            required
                                            value={values.markets || []}
                                        >
                                            <MenuItem key={'All markets'} value={'All'}>
                                                <Checkbox
                                                    checked={frameOptions.markets.length > 0 && values.markets.length === frameOptions.markets.length}
                                                    indeterminate={values.markets.length > 0 && values.markets.length < frameOptions.markets.length}
                                                />
                                                <ListItemText primary={'Выбрать все'} />
                                            </MenuItem>
                                            {frameOptions.markets.map(option => (
                                                <MenuItem key={option} value={option}>
                                                    <Checkbox checked={values.markets.indexOf(option) > -1} />
                                                    <ListItemText primary={option} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.markets && <FormHelperText>{errors.markets}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item key="srvs">
                                    <FormControl error={!!errors.srvs} fullWidth variant="standard">
                                        <InputLabel>Сервисы</InputLabel>
                                        <Select
                                            label="Сервисы"
                                            MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}
                                            multiple
                                            name="srvs"
                                            onBlur={handleBlur}
                                            onChange={event => {
                                                handleChange(event);
                                                event.target.value.slice(-1)[0] === 'All' && setFieldValue('srvs',
                                                    values.srvs.length < frameOptions.srvs.length ? frameOptions.srvs.slice() : []
                                                );
                                            }}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => <Chip key={value} label={value} />)}
                                                </Box>
                                            )}
                                            required
                                            value={values.srvs || []}
                                        >
                                            <MenuItem key={'All srvs'} value={'All'}>
                                                <Checkbox
                                                    checked={frameOptions.srvs.length > 0 && values.srvs.length === frameOptions.srvs.length}
                                                    indeterminate={values.srvs.length > 0 && values.srvs.length < frameOptions.srvs.length}
                                                />
                                                <ListItemText primary={'Выбрать все'} />
                                            </MenuItem>
                                            {frameOptions.srvs.map(option =>
                                                <MenuItem key={option} value={option}>
                                                    <Checkbox checked={values.srvs.indexOf(option) > -1} />
                                                    <ListItemText primary={option} />
                                                </MenuItem>
                                            )}
                                        </Select>
                                        {errors.srvs && <FormHelperText>{errors.srvs}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item key="techs">
                                    <FormControl error={!!errors.techs} fullWidth variant="standard">
                                        <InputLabel>Технологии</InputLabel>
                                        <Select
                                            label="Технологии"
                                            MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}
                                            multiple
                                            name="techs"
                                            onBlur={handleBlur}
                                            onChange={event => {
                                                handleChange(event);
                                                event.target.value.slice(-1)[0] === 'All' && setFieldValue('techs',
                                                    values.techs.length < frameOptions.techs.length ? frameOptions.techs.slice() : []
                                                );
                                            }}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => <Chip key={value} label={value} />)}
                                                </Box>
                                            )}
                                            value={values.techs || []}
                                        >
                                            <MenuItem key={'All techs'} value={'All'}>
                                                <Checkbox
                                                    checked={frameOptions.techs.length > 0 && values.techs.length === frameOptions.techs.length}
                                                    indeterminate={values.techs.length > 0 && values.techs.length < frameOptions.techs.length}
                                                />
                                                <ListItemText primary={'Выбрать все'} />
                                            </MenuItem>
                                            {frameOptions.techs.map(option => (
                                                <MenuItem key={option} value={option}>
                                                    <Checkbox checked={values.techs.indexOf(option) > -1} />
                                                    <ListItemText primary={option} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.techs && <FormHelperText>{errors.techs}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <div className="form-options" key="submit">
                                    <Button color="info" type="button" variant="contained" onClick={getData}>
                                        Отменить
                                    </Button>
                                    <Button color="secondary" type="button" variant="contained" onClick={() => setIsSurveyModalOpen(true)}>
                                        Повысить эффективность
                                    </Button>
                                    <Button color="secondary" type="button" variant="contained" onClick={getAlgorithmResult}>
                                        Подобрать сервисы
                                    </Button>
                                    <Button color="primary" disabled={!isValid} type="submit" variant="contained">
                                        Сохранить
                                    </Button>
                                </div>
                            </Grid>
                            {isSurveyModalOpen && (
                                <SurveyModalComponent onSubmit={onSurveyModalSubmit} setOpen={setIsSurveyModalOpen} />
                            )}
                            {isSuccessModalOpen && (
                                <SuccessModalComponent
                                    foundServices={foundServices}
                                    foundTasks={foundTasks}
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
                        {/*<CompanyPropertiesComponent />*/}
                    </>
                )
            }
        </Grid>
    );
};
