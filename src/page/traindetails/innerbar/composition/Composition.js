import React from 'react'
import Button from 'react-bootstrap/Button'
import Statistics from './statistics/Statistics'
import DnD from './draggable/DnD'
import CloneComposition from './cloneComposition/CloneComposition'

export default function Composition({ selectedJourney, setShowCreateTraction, setShowCreateWagon, setTrain, setJourneyAndTrainHandler }) {

    const setTrainCompositionHandler = (trainComposition) => {
        const updatedSelectedJourney = { ...selectedJourney, trainComposition }
        setJourneyAndTrainHandler(updatedSelectedJourney);
    }

    return (
        <>
            <div className="jp-header d-flex w-100 align-items-center justify-content-between pl-4 pr-4">
                <h5>Composition</h5>
                {selectedJourney && <div className="d-flex justify-content-center align-items-center">
                    <CloneComposition
                        selectedJourney={selectedJourney}
                        setTrain={setTrain}
                    />
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
                </div>}
            </div>

            {selectedJourney &&
                <>
                    <div style={{ overflow: "auto" }}>
                        <Statistics selectedJourney={selectedJourney} />
                    </div>
                    <DnD
                        selectedJourney={selectedJourney}
                        setTrainCompositionHandler={setTrainCompositionHandler}
                    />
                </>
            }


        </>
    )
}
