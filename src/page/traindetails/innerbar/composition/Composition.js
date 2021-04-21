import React from 'react'
import Button from '@material-ui/core/Button'
import './Composition.css';
import Statistics from './statistics/Statistics'
import DnD from './draggable/DnD'
import CloneComposition from './cloneComposition/CloneComposition'
import { hasPermissions } from '../../../../utils/scopeChecker'
import {Box} from "@material-ui/core";

export default function Composition({ selectedJourney, createTractionHandler, setShowCreateWagon, setTrain, setJourneyAndTrainHandler, showEditMode, fetchTrain, getToken }) {

    const setTrainCompositionHandler = (stockId) => {
        const { trainComposition } = selectedJourney
        const updatedRollingStock = trainComposition.rollingStock.filter((item) => item.id !== stockId)
        const updatedTrainComposition = { ...trainComposition, rollingStock: updatedRollingStock }
        const updatedSelectedJourney = { ...selectedJourney, trainComposition: updatedTrainComposition }
        setJourneyAndTrainHandler(updatedSelectedJourney);
    }

    return (
        <>
            {/*<div className="jp-header d-flex align-items-center justify-content-between pl-3 pr-3">*/}
            <Box className="composition-header" display="flex" flexDirection="row" justifyContent="center" px={3}>
                <h5>Composition</h5>
                {selectedJourney && <Box flexGrow={1} display="flex" flexDirection="row" justifyContent="flex-end">
                    {hasPermissions(["write:traincomposition"]) && <CloneComposition
                        getToken={getToken}
                        selectedJourney={selectedJourney}
                        setTrain={setTrain}
                    />}
                    {hasPermissions(["write:rollingstock"]) && <>
                        <Button
                            className="mr-2"
                            variant="outlined"
                            size="small"
                            onClick={() => createTractionHandler(selectedJourney)}>
                            ADD TRACTION
                        </Button>
                        <Button
                            className="mr-2"
                            variant="outlined"
                            size="small"
                            onClick={setShowCreateWagon}>
                            ADD WAGON
                        </Button>
                    </>}
                </Box>}
            </Box>

            {selectedJourney &&
                <>
                    <DnD
                        getToken={getToken}
                        showEditMode={showEditMode}
                        selectedJourney={selectedJourney}
                        setTrainCompositionHandler={setTrainCompositionHandler}
                        fetchTrain={fetchTrain}
                    />
                    <div style={{ clear: "both" }}>
                        <Statistics selectedJourney={selectedJourney} />
                    </div>
                </>
            }


        </>
    )
}
