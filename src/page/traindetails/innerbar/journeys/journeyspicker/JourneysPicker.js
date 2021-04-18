import React, { useState, Fragment, useEffect } from 'react'
import './JourneysPicker.css';
import './JourneysPicker.scss';
import Button from 'react-bootstrap/Button';
import { hasPermissions } from '../../../../../utils/scopeChecker';
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    overrides: {
      MuiTimelineItem: {
        missingOppositeContent: {
          "&:before": {
            display: "none"
          }
        }
      }
    }
  });

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: '6px 16px',
    },
    secondaryTail: {
      backgroundColor: theme.palette.secondary.main,
    },root: {
        width: '100%',
      },
      heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
      },
  }));
  

export default function JourneysPicker({ train, setShowCreateJourney, setShowEditJourney, selectedJourney, selectedJourneyHandler }) {
    const classes = useStyles();
    const [trainWithSortedJourneys, setTrainWithSortedJourneys] = useState(train);

    useEffect(() => {
        let listOfJourneys = train?.journeySections;
        listOfJourneys.sort((a, b) => a.id - b.id);
        setTrainWithSortedJourneys(prevState => {
            return { ...prevState, journeySections: listOfJourneys }
        })
    }, [train])

    function getDepartureName(journey) {
        const departure = journey.links.find(link => link.rel === "journeySectionOrigin")
        return departure.title;
    }

    function getDestinationName(journey) {
        const destination = journey?.links?.find(link => link?.rel === "journeySectionDestination")?.title
        return destination ?? train?.transferPoint
    }

    function createPart(text, onClick) {
        return(
            <TimelineItem>
                <TimelineSeparator>
                <TimelineDot/>
                <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                <Paper elevation={3} className={classes.paper}>
                    <Typography variant="h6" component="h1">
                    {text}
                    </Typography>
                    <Typography>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            onClick ={onClick}
                        >
                            <Typography className={classes.heading}>composition</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                        
                            </Typography>
                        </AccordionDetails>
                        </Accordion>
                    </Typography>
                </Paper>
                </TimelineContent>
            </TimelineItem>
        )
    }

    function renderPart(journey, index) {
        // let className = "part2";
        // if (selectedJourney && journey.id === selectedJourney.id) {
        //     className += " selected";
        // }
        return <Fragment key={index}>
            {createPart( getDepartureName(journey), () => selectedJourneyHandler(journey))}
        </Fragment>
    }

    return (
        <>
            <div className="jp-header d-flex w-100 align-items-center justify-content-between pl-4 pr-4">
                <h5>Journeys</h5>
                {hasPermissions(["write:journeysection"]) && selectedJourney && <Button
                    style={{ marginLeft: "auto", marginRight: "15px" }}
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setShowEditJourney(true)}
                >
                    EDIT DESTINATION
                </Button>}
                {hasPermissions(["write:journeysection"]) && <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setShowCreateJourney(true)}
                >
                    ADD DESTINATION
                </Button>}
            </div>

            <div style={{ overflow: "auto" }} className="partcontainer">
                <ThemeProvider theme={theme}>
                    <Timeline align="left">
                        {trainWithSortedJourneys.journeySections.map((journey, index) => renderPart(journey, index))}
                        {
                            createPart( getDestinationName(trainWithSortedJourneys.journeySections[trainWithSortedJourneys.journeySections.length - 1]), () => { })
                        }
                        {/* {createPart("part2 create", true, false, "Add destination", () => { })} */}
                    </Timeline>
                </ThemeProvider>
            </div>
        </>
    )
}
