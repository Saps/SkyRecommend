import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { ExpandMore } from '@mui/icons-material';
import {
    Accordion, AccordionDetails, AccordionSummary, Alert, Button, FormControl, InputLabel, MenuItem, Select, TextField
} from '@mui/material';

import { changeCompanyProperties, getCompanyProperties } from '~/api';
import { CompanyProperty, FieldValues, Value } from '~/types';

import './company-properties.component.scss';

export const CompanyPropertiesComponent = (): JSX.Element | null => {
    const [expanded, setExpanded] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [companyProperties, setCompanyProperties] = useState<CompanyProperty[]>([]);

    const { handleBlur, handleChange, handleSubmit, setValues, values } = useFormik({
        initialValues: {} as FieldValues,
        onSubmit: async (fieldValues: FieldValues) => {
            const changedParams = {
                changed_params: Object.entries(fieldValues).map(([key, value]) => ({ id: key, value: value === '' ? null : value }))
            };
            try {
                await changeCompanyProperties(changedParams);
            } catch (err) {
                console.log(err);
            }
        },
    });

    const expandedChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : '');
    };

    const handleGetCompanyProperties = async () => {
        try {
            const properties = await getCompanyProperties();
            const fieldValues = properties
                .reduce((acc: Value[], item: CompanyProperty) => acc.concat(...item.params.map(e => ({ id: e.id, value: e.value }))), [])
                .reduce((acc: FieldValues, item: Value) => ({ ...acc, [item.id]: item.value }), {});
            setCompanyProperties(properties);
            await setValues(fieldValues);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetCompanyProperties();
    }, []);

    const renderAccordion = (property: CompanyProperty): JSX.Element => {
        const { group_name: key, params } = property;
        return (
            <Accordion className="accordion-item" expanded={expanded === key} key={key} onChange={expandedChange(key)}>
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
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values[param.id] ?? ''}
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
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values[param.id] ?? ''}>
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

    return loading ? (
        <Alert severity="warning">Информация загружается.</Alert>
    ) : companyProperties.length > 0 ? (
        <form className="company-properties-form" onSubmit={handleSubmit} noValidate>
            <h3 className="form-header">Дополнительная информация о компании</h3>
            {companyProperties.map(renderAccordion)}
            <div className="form-options">
                <Button color="primary" type="submit" variant="contained">
                    Сохранить
                </Button>
                <Button color="info" type="button" variant="contained" onClick={handleGetCompanyProperties}>
                    Сбросить
                </Button>
            </div>
        </form>
    ) : (
        <Alert severity="error">Дополнительная информация о компании отсутствует.</Alert>
    );
};
