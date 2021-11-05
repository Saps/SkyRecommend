import React, {useEffect, useState} from 'react';
import { useFormik } from 'formik';
import {Button, Checkbox, FormControl, FormControlLabel, Grid, Typography} from '@mui/material';
import * as Yup from 'yup';
import { getTuneAlgorithms, updateTuneAlgorithms } from '~/api';
import { ExtendedAlgorithmData } from '~/types';
import './algorithm-settings.component.scss';

export const AlgorithmSettingsComponent = (): JSX.Element => {
    const [algorithmData, setAlgorithmData] = useState<ExtendedAlgorithmData[]>([]);
    const { isValid, handleChange, handleSubmit, setValues, values } = useFormik({
        initialValues: {} as any,
        onSubmit: async values => {
            // const result = values.map(item => ({
            //     caption: item.caption,
            //     id: +item.id,
            //     is_enabled: +item.is_enabled,
            //     weight: +item.weight
            // }));
            console.log(values);
            // await updateTuneAlgorithms([]);
        }
    });

    const handleGetAlgorithmData = async () => {
        try {
            const result = await getTuneAlgorithms();
            setAlgorithmData(result);
            await setValues(result.reduce((acc, item) => ({
                ...acc, [`${item.id}-is-enabled`]: !!item.is_enabled, [`${item.id}-weight`]: `${item.weight}`
            }), {}));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        handleGetAlgorithmData();
    }, []);

    return (
        <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
            <Typography variant="h6" component="h2">
                Пожалуйста, отметьте галочками алгоритмы, которые Вы хотите подключить
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
                <div className="algorithm-settings__questions">
                    {
                        algorithmData.map((item, index) => (
                            <>
                                <FormControl key={`${item.id}-is-enabled`}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={values[`${item.id}-is-enabled`]}
                                            name={`${item.id}-is-enabled`}
                                            onChange={handleChange}
                                            value={values[`${item.id}-is-enabled`]}
                                        />}
                                        label={item.caption}
                                    />
                                </FormControl>
                            </>
                        ))
                    }
                </div>
                <div className="algorithm-settings__options">
                    <Button color="primary" disabled={!isValid} type="submit" variant="contained">
                        Сохранить
                    </Button>
                    <Button color="info" type="button" variant="contained" onClick={handleGetAlgorithmData}>
                        Отменить
                    </Button>
                </div>
            </form>
        </Grid>
    )
};
