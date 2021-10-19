import React, { useEffect, useMemo, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { ExpandMore } from '@mui/icons-material';
import {
    Accordion, AccordionDetails, AccordionSummary, Alert, Button,
    FormControl, Grid, InputLabel, Link, MenuItem, Select, TextField
} from '@mui/material';
import { getCompanyProperties } from '~/api';
import { CompanyProperty, FieldValues, Value } from '~/types';
import { COMPANY_PROPERTIES } from './properties';

import './company.component.scss';

export const CompanyComponent = (): JSX.Element | null => {
    const [expanded, setExpanded] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [companyProperties, setCompanyProperties] = useState<CompanyProperty[]>([]);

    const initialValues = useMemo(() => {
        return companyProperties
            .reduce((acc: Value[], item: CompanyProperty) => acc.concat(...item.params.map(e => ({ id: e.id, value: e.value }))), [])
            .reduce((acc: FieldValues, item: Value) => ({ ...acc, [item.id]: item.value }), {});
    }, [companyProperties]);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : '');
    };

    const onFormSubmit = (values: FieldValues) => {
        const result = {
            changed_params: Object.entries(values).map(([key, value]) => ({ id: key, value: value === '' ? null : value }))
        };
        alert(JSON.stringify(result, null, 2));
    };

    useEffect(() => {
        getCompanyProperties()
            .then(res => {
                setCompanyProperties(res);
                setExpanded(res[0].group_name);
            })
            .catch(err => {
                console.error(err);
                setCompanyProperties(COMPANY_PROPERTIES);
                setExpanded(COMPANY_PROPERTIES[0].group_name);
            })
            .finally(() => setLoading(false));
    }, []);

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

    return loading ? null : (
        <Grid container item direction="column" justifyContent="center" alignItems="center" mt={1} p={2} xs={6}>
            <Formik initialValues={initialValues} onSubmit={onFormSubmit}>
                {props => (
                    <form onSubmit={props.handleSubmit} noValidate>
                        {
                            companyProperties.length > 0
                                ? companyProperties.map(property => renderAccordion(property, props))
                                : (
                                    <Alert severity="error">
                                        У Вас отсутствует привязанная компания. &nbsp;
                                        <Link href="/">Вернуться на главную страницу</Link>
                                    </Alert>
                                )
                        }
                        <Button className="submit-button" type="submit" variant="contained">
                            Сохранить
                        </Button>
                    </form>
                )}
            </Formik>
        </Grid>
    );
};
