import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Formik, FormikProps, FormikState } from 'formik';
import { ExpandMore } from '@mui/icons-material';
import {
    Accordion, AccordionDetails, AccordionSummary, Alert, Button,
    FormControl, Grid, InputLabel, Link, MenuItem, Select, TextField
} from '@mui/material';

import { changeCompanyProperties, getCompanyProperties } from '~/api';
import { RootState } from '~/store/rootReducer';
import { CompanyProperty, FieldValues, Value } from '~/types';

import './company-properties.component.scss';

export const CompanyPropertiesComponent = (): JSX.Element | null => {
    const [expanded, setExpanded] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [companyProperties, setCompanyProperties] = useState<CompanyProperty[]>([]);
    const { id, role } = useSelector((state: RootState) => state.user);

    const initialValues = useMemo(() => {
        return companyProperties
            .reduce((acc: Value[], item: CompanyProperty) => acc.concat(...item.params.map(e => ({ id: e.id, value: e.value }))), [])
            .reduce((acc: FieldValues, item: Value) => ({ ...acc, [item.id]: item.value }), {});
    }, [companyProperties]);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : '');
    };

    const onFormSubmit = async (values: FieldValues) => {
        const changedParams = {
            changed_params: Object.entries(values).map(([key, value]) => ({ id: key, value: value === '' ? null : value }))
        };
        try {
            await changeCompanyProperties(changedParams);
        } catch (err) {
            console.log(err);
        }
    };

    const handleGetCompanyProperties = async () => {
        try {
            if (id > -1 && role !== 'admin') {
                const properties = await getCompanyProperties();

                setCompanyProperties(properties);
                setExpanded(properties[0].group_name);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onFormReset = async (resetForm: (nextState?: Partial<FormikState<FieldValues>>) => void) => {
        await handleGetCompanyProperties();
        resetForm({ values: initialValues });
    };

    useEffect(() => {
        handleGetCompanyProperties();
    }, [id, role]);

    const renderAccordion = (property: CompanyProperty, props: FormikProps<FieldValues>): JSX.Element => {
        const { group_name: key, params } = property;
        return (
            <Accordion className="accordion-item" expanded={expanded === key} key={key} onChange={handleChange(key)}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <h3>{key}</h3>
                </AccordionSummary>
                <AccordionDetails className="accordion-details">
                    {
                        params.map(param => param.list_of_values == null
                            ? (
                                <FormControl className="accordion-field" key={`${key}${param.id}`} variant="standard">
                                    <TextField
                                        label={param.name}
                                        name={`${param.id}`}
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values[param.id] ?? ''}
                                        variant="standard"
                                    />
                                </FormControl>
                            )
                            : (
                                <FormControl className="accordion-field" key={`${key}${param.id}`} variant="standard">
                                    <InputLabel>{param.name}</InputLabel>
                                    <Select
                                        label={param.name}
                                        name={`${param.id}`}
                                        onBlur={props.handleBlur}
                                        onChange={props.handleChange}
                                        value={props.values[param.id] ?? ''}>
                                        <MenuItem key={key + 'null'} value="">Не выбрано</MenuItem>
                                        {
                                            param.list_of_values.map(item => (
                                                <MenuItem key={`${key}${param.id}${item.id}`} value={item.id}>
                                                    {item.value}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            )
                        )
                    }
                </AccordionDetails>
            </Accordion>
        );
    };

    if (id < 0) {
        return <Redirect to="/login" />
    } else if (role === 'admin') {
        return <Redirect to="/" />;
    }

    return (
        <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
            {
                loading ? (
                    <Alert severity="warning">Информация загружается.</Alert>
                ) : companyProperties.length > 0 ? (
                    <Formik initialValues={initialValues} onSubmit={onFormSubmit}>
                        {props => (
                            <form onSubmit={props.handleSubmit} noValidate>
                                <h3 className="form-header">Свойства компании</h3>
                                {companyProperties.map(property => renderAccordion(property, props))}
                                <div className="form-options">
                                    <Button color="primary" type="submit" variant="contained">
                                        Сохранить
                                    </Button>
                                    <Button color="info" type="button" variant="contained" onClick={() => onFormReset(props.resetForm)}>
                                        Сбросить
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                ) : (
                    <Alert severity="error">
                        У Вас отсутствует привязанная компания. &nbsp;
                        <Link href="/">Вернуться на главную страницу.</Link>
                    </Alert>
                )
            }
        </Grid>
    );
};