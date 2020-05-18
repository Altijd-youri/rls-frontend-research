import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import JourneySectionService from '../../../../../api/journeysections'
import { errorAlert, succeedAlert } from '../../../../../utils/Alerts'

export default function CloneComposition({ selectedJourney, setTrain }) {
    const [copiedJourneySectionUrl, setCopiedJourneySectionUrl] = useState('')

    const hasComposition = () => {
        const { trainComposition: { wagons, tractions } } = selectedJourney
        return Boolean(wagons.length || tractions.length)
    }

    const copiedJourneySectionUrlHandler = () => {
        setCopiedJourneySectionUrl(findSelectedJourneySelf())
    }

    const isCloneable = () => {
        return Boolean(copiedJourneySectionUrl && !isCopied())
    }

    const isCopied = () => {
        return findSelectedJourneySelf() === copiedJourneySectionUrl
    }

    const findSelectedJourneySelf = () => {
        return selectedJourney?.links?.find(link => link.rel === 'self')?.href
    }

    const cloneComposition = async () => {
        try {
            const body = {
                "journeySectionUrl": copiedJourneySectionUrl
            }
            const { data, error } = await JourneySectionService.clone(selectedJourney.id, body);
            if (data) {
                setTrain(data)
                succeedAlert()
                setCopiedJourneySectionUrl('')
            } else {
                errorAlert(error.message)
            }
        } catch (e) {
            errorAlert(e.message)
        }
    }

    return (
        <>
            {hasComposition() &&
                <Button
                    disabled={isCopied()}
                    className="mr-2"
                    variant="outline-secondary"
                    size="sm"
                    onClick={copiedJourneySectionUrlHandler}>
                    {isCopied() ? "COPIED!" : "COPY COMPOSITION"}
                </Button>
            }

            {
                isCloneable() &&
                <Button
                    className="mr-2"
                    variant="outline-secondary"
                    size="sm"
                    onClick={cloneComposition}>
                    PASTE COMPOSITION
                </Button>
            }
        </>
    )
}
