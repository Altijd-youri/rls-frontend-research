import React from 'react'
import Button from 'react-bootstrap/Button'
import Statistics from './statistics/Statistics'
import DnD from './draggable/DnD'
import CloneComposition from './cloneComposition/CloneComposition'
import { hasPermissions } from '../../../../utils/scopeChecker'

export default function Composition({ selectedJourney, setShowCreateTraction, setShowCreateWagon, setTrain, setJourneyAndTrainHandler, showEditMode, fetchTrain, getToken }) {

    const setTrainCompositionHandler = (stockId) => {
        const { trainComposition } = selectedJourney
        const updatedRollingStock = trainComposition.rollingStock.filter((item) => item.id !== stockId)
        const updatedTrainComposition = { ...trainComposition, rollingStock: updatedRollingStock }
        const updatedSelectedJourney = { ...selectedJourney, trainComposition: updatedTrainComposition }
        setJourneyAndTrainHandler(updatedSelectedJourney);
    }

    return (
        <>
            <div className="jp-header d-flex w-100 align-items-center justify-content-between pl-4 pr-4">
                <h5>Composition</h5>
                {selectedJourney && <div className="d-flex justify-content-center align-items-center">
                    {hasPermissions(["write:traincomposition"]) && <CloneComposition
                        getToken={getToken}
                        selectedJourney={selectedJourney}
                        setTrain={setTrain}
                    />}
                    {hasPermissions(["write:rollingstock"]) && <>
                        <Button
                            className="mr-2"
                            variant="outline-secondary"
                            size="sm"
                            onClick={setShowCreateTraction}>
                            ADD TRACTION
                        </Button>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={setShowCreateWagon}>
                            ADD WAGON
                        </Button>
                    </>}
                </div>}
            </div>

            {selectedJourney &&
                <>
                    <div style={{ overflow: "auto" }}>
                        <Statistics selectedJourney={selectedJourney} />
                    </div>
                    <DnD
                        getToken={getToken}
                        showEditMode={showEditMode}
                        selectedJourney={selectedJourney}
                        setTrainCompositionHandler={setTrainCompositionHandler}
                        fetchTrain={fetchTrain}
                    />
                </>
            }


        </>
    )
}
