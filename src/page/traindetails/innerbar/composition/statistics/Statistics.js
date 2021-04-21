import React from 'react'
import './Statistics.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import {Tooltip} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    table: {
        minWidth: 300,
      },
  }));

  function labelIcon(type, description) {
      let icon = <Tooltip title={description}><i class="fas fa-question-circle"></i></Tooltip>

      switch (type) {
          case "speed":
              icon = <Tooltip title={description}><i className="fas fa-tachometer-alt"></i></Tooltip>
              break
          case "weight":
              icon = <Tooltip title={description}><i className="fas fa-weight-hanging"></i></Tooltip>
              break;
          case "length":
              icon = <Tooltip title={description}><i className="fas fa-arrows-alt-h"></i></Tooltip>
              break
          case "brake":
              icon = <Tooltip title={description}><i className="fas fa-unlink"></i></Tooltip>
              break
          case "count":
              icon = <Tooltip title={description}><i className="fas fa-train"></i></Tooltip>
              break
          case "axel":
              icon = <Tooltip title={description}><i className="fas fa-dumbbell"></i></Tooltip>
              break
          case "danger":
              icon = <Tooltip title={description}><i className="fas fa-exclamation-triangle"></i></Tooltip>
              break
          case "gauge":
              icon = <Tooltip title={description}><i className="fas fa-ring"></i></Tooltip>
              break
          default:
              break
      }
      return icon
  }

export default function Statistics({ selectedJourney }) {

    const calculateBrakeWeight = () => {
        let brakeWeight = selectedJourney.trainComposition.brakeWeight
        let weight = selectedJourney.trainComposition.weight
        let percentage = (brakeWeight > 0 && weight > 0) ? brakeWeight / weight * 100 : 0
        return parseInt(percentage, 10)
    }

    const information = [
        [
            {label: labelIcon("count","Number of vehicles"), value: selectedJourney.trainComposition.numberOfVehicles},
            {label: labelIcon("brake","Brake percentage"), value: calculateBrakeWeight() + "%"},
            {label: labelIcon("weight","Train weight in tonnes"), value: selectedJourney.trainComposition.weight + " t"},
            {label: labelIcon("speed", "Maximum speed in km/h"), value: selectedJourney.trainComposition.maxSpeed + " km/h"},
            {label: labelIcon("length", "Length of train in meters"), value: selectedJourney.trainComposition.length + " m"},
            {label: labelIcon("axel","Maximum axel-weight of the train"), value: selectedJourney.trainComposition.maxAxleWeight + " t"}
        ]
    ]

    if (selectedJourney.trainComposition.gaugedExceptional) {
        information[0].push(
            {label: labelIcon("gauge","Exceptional gauging used"), value: ""}
        )
    }
    if (selectedJourney.trainComposition.containsDangerousGoods) {
        information[0].push(
            {label: labelIcon("danger","Dangerous goods onboard"), value: ""}
        )
    }

    const classes = useStyles();

    return (
        <>
        {selectedJourney?.trainComposition ?
            <Grid container spacing={1}>
                {information.map((row) => (
                    <Grid container
                          direction="row"
                          justify="space-between"
                          alignItems="center"
                          className="icon-table">
                        {row.map((item) => (
                            <div align="center" className="info-item">
                                {item.label}
                                <span>{item.value}</span>
                            </div>
                        ))}
                    </Grid>
                ))}
            </Grid>
            : <div className="d-flex justify-content-center align-items-center mt-5 mb-5">Please select a journey</div>
        }
        </>
    )
      
}