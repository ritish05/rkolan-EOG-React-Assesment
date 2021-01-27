import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { useSubscription, useQuery } from 'urql';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';
import LineGraph from '../../components/EogMetrics/Graph';
import ReadOut from '../../components/EogMetrics/MetricTiles';
import Metrics from '../Metrics/Metrics';

const newMeasurement = `
subscription {
  newMeasurement {
    metric,
    at,
    value,
    unit
  }
}
`;

const getMultipleMeasurements = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      unit
    }
  }
}
`;

const getMeasurements = (state: IState) => {
  return state.measurements;
};
const getChosenMetrics = (state: IState) => {
  return state.metrics.chosen;
};

const halfAnHourAgo = Date.now() - 30 * 60 * 1000;

export default () => {
  const dispatch = useDispatch();
  const measurements = useSelector(getMeasurements);
  const chosenMetrics = useSelector(getChosenMetrics);
  
  const [{ fetching, data, error }] = useSubscription({ query: newMeasurement });
  const [multipleMeasurementsResult] = useQuery({
    query: getMultipleMeasurements,
    variables: {
      input: chosenMetrics.map(metricName => {
        return { metricName, after: halfAnHourAgo };
      }),
    },
  });

  useEffect(() => {
    if (error) {
      dispatch(actions.measurementApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    dispatch(actions.measurementReceived(data.newMeasurement));
  }, [dispatch, data, error]);

  useEffect(() => {
    const { data } = multipleMeasurementsResult;
    if (!data) return;
    dispatch(actions.multipleMeasurementsReceived(data.getMultipleMeasurements));
  }, [dispatch, multipleMeasurementsResult]);

  if (!data && fetching) return <LinearProgress />;

  return (
    <Grid container spacing={3} >
      <Grid container direction="row" justify="flex-start" alignItems="flex-start" item xs={4} style={{margin:"10px 0px 0px 10px"}}>
        <Metrics />
      </Grid>
      <Grid container direction="row" justify="flex-end" alignItems="flex-start" item xs={12} sm={6}>
        {chosenMetrics.map(metric => {
          return (
            <Grid item sm={6} key={metric}>
              <ReadOut measurement={measurements[metric][measurements[metric].length - 1]} metricName={metric} />
            </Grid>
          );
        })}
      </Grid>
      <LineGraph
        measurements={measurements}
        chosenMetrics={chosenMetrics}
      />
    </Grid>
  );
};
