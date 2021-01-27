import React from 'react';
import Grid from '@material-ui/core/Grid';
import Measurements from '../../Features/Measurements/Measurements';

export default () => {

  return (
    <Grid item xs={12}>
      <Grid container direction="column" justify="center" alignItems="center" item xs >
        <Measurements />
      </Grid>
    </Grid>
  );
};
