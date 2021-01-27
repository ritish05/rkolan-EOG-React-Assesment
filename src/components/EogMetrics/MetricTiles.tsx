import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { MeasurementData } from '../../Features/Measurements/reducer';

type ReadOutProps = {
  measurement: MeasurementData;
  metricName: string;
};

export default ({ measurement, metricName }: ReadOutProps) => {
  return (
    <Card style={{margin: "10px"}}>
      <CardContent>
        <Typography variant="h5" style={{fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.6, letterSpacing: "0.0075em"}}>{metricName}</Typography>
        <Typography variant="h3" style={{fontSize:"25px", fontWeight: "bold"}}>{measurement.value} {measurement.unit}</Typography>
      </CardContent>
    </Card>
  );
};
