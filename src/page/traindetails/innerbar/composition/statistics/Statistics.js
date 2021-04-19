import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    table: {
        minWidth: 300,
      },
  }));
  
  function createData(info1, info2, info3) {
    return { info1, info2, info3 };
  }
  
export default function Statistics({ selectedJourney }) {

    //TODO naar kijken
    const calculateBrakeWeight = () => {
        return parseInt(selectedJourney.trainComposition.brakeWeight / selectedJourney.trainComposition.weight * 100, 10);
    }
    const rows = [
    
        createData("Number of vehicles",selectedJourney.trainComposition.numberOfVehicles),
        createData('Brake percentage', calculateBrakeWeight() + " %"),
        createData('Dangerous goods', selectedJourney.trainComposition.containsDangerousGoods === true ? 'Yes' : 'No'), 
        
      ];
    const rows2 = [

        createData("Train weight",selectedJourney.trainComposition.weight + " tonnes"),
        createData('Max. speed', selectedJourney.trainComposition.maxSpeed + " km/h"),
        createData('Exceptional gauging', selectedJourney.trainComposition.gaugedExceptional === true ? 'Yes' : 'No'), 
        
    ];

    const rows3 = [

        createData("Train length",selectedJourney.trainComposition.length + " meters"),
        createData('Max. axle weight', selectedJourney.trainComposition.maxAxleWeight + " tonnes"),
        
    ];

    const classes = useStyles();
    return (
        
        <>
        {selectedJourney?.trainComposition ?
        <Grid container spacing={1}>
        <Grid item xs={4}>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
        <TableBody>
            {rows.map((row) => (
            <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                {row.name}
                </TableCell>
                <TableCell align="left">{row.info1}</TableCell>
                <TableCell align="left">{row.info2}</TableCell>
                <TableCell align="left">{row.info3}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
      </TableContainer>
        </Grid>
        <Grid item xs={4}>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
        <TableBody>
            {rows2.map((row2) => (
            <TableRow key={row2.name}>
                <TableCell component="th" scope="row">
                {row2.name}
                </TableCell>
                <TableCell align="left">{row2.info1}</TableCell>
                <TableCell align="left">{row2.info2}</TableCell>
                <TableCell align="left">{row2.info3}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
      </TableContainer>
        </Grid>
        <Grid item xs={4}>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
        <TableBody>
            {rows3.map((row3) => (
            <TableRow key={row3.name}>
                <TableCell component="th" scope="row">
                {row3.name}
                </TableCell>
                <TableCell align="left">{row3.info1}</TableCell>
                <TableCell align="left">{row3.info2}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
      </TableContainer>
        </Grid>
        </Grid>        : <div className="d-flex justify-content-center align-items-center mt-5 mb-5">Please select a journey</div>}
        </>
        
    )
      
}