import React from 'react'
import { TRAIN_TYPES } from '../../../../utils/constants';
import { useHistory } from 'react-router-dom';
import DataTable from "react-data-table-component";
import FilterComponent from './FilterComponent';
import ExpendedRow from './ExpendedRow';
import Button from 'react-bootstrap/Button'
import { hasPermissions } from '../../../../utils/scopeChecker';


export default function TrainTable({ trains, onEditTrain, sendTcm }) {

    const columns = [
        {
            name: 'Number',
            selector: 'operationalTrainNumber',
            sortable: true,
        },
        {
            name: 'Type',
            selector: 'trainType',
            format: row => `${TRAIN_TYPES[row.trainType].summary}`,
            sortable: true,
        },
        {
            name: 'Departure',
            selector: 'transferPoint',
            sortable: true,
        },
        {
            name: 'Departure time',
            selector: 'scheduledTimeAtHandover',
            format: row => `${new Date(row.scheduledTimeAtHandover).toLocaleString()}`,
            sortable: true,
        },
        {
            cell: row => <Button
                variant="outline-warning"
                size="sm"
                onClick={() => sendTcm(row.id)}>
                TCM
            </Button>,
            allowOverflow: true,
            ignoreRowClick: true,
            button: true,
            width: '56px',
        },
        {
            cell: row => <Button
                variant="outline-secondary"
                size="sm"
                onClick={hasPermissions(["write:train"])
                    ? () => onEditTrain(row)
                    : () => history.push(`train/${row.id}/details`)}>
                {hasPermissions(["write:train"]) ? "EDIT" : "VIEW"}
            </Button>,
            allowOverflow: true,
            ignoreRowClick: true,
            button: true,
            width: '56px',
        },
    ];


    const history = useHistory();
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredTrains = trains.filter(train => train.transferPoint && train.transferPoint.toLowerCase().includes(filterText.toLowerCase()))

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />);
    }, [filterText, resetPaginationToggle]);

    return (
        <DataTable
            columns={columns}
            defaultSortField='scheduledTimeAtHandover'
            data={filteredTrains}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            subHeaderAlign="right"
            persistTableHead
            expandableRows
            highlightOnHover
            noHeader={true}
            expandableRowsComponent={<ExpendedRow />}
            pointerOnHover={true}
            onRowClicked={(row) => history.push(`train/${row.id}/details`)}
        />
    );
}
