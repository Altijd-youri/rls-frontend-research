import React from 'react'
import {TRAIN_TYPES} from '../../../utils/constants';
import {useHistory} from 'react-router-dom';
// import './TrainTable.scoped.css';
import DataTable from "react-data-table-component";
import Button from 'react-data-table-component'
import faker from 'faker';
import styled from 'styled-components';

const createUser = () => ({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar(),
});

const createUsers = (numUsers = 5) =>
    new Array(numUsers).fill(undefined).map(createUser);

const fakeUsers = createUsers(2000);

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
        <TextField id="search" type="text" placeholder="Filter By Name" value={filterText} onChange={onFilter} />
        <ClearButton type="button" onClick={onClear}>X</ClearButton>
    </>
);

const columns = [
    {
        name: 'Name',
        selector: 'name',
        sortable: true,
    },
    {
        name: 'Email',
        selector: 'email',
        sortable: true,
    },
    {
        name: 'Address',
        selector: 'address',
        sortable: true,
    },
];


export default function TrainTable({trains, onEditTrain}) {
    // let history = useHistory();
    //
    // if (!trains.length) {
    //     return (
    //         <div style={{
    //             border: "2px dashed #e4e8f6",
    //             padding: "25px",
    //             display: "flex",
    //             alignContent: "center",
    //             justifyContent: "center"
    //         }}>No trains found</div>
    //     )
    // }
    //
    // function sortListOn(list) {
    //
    // }

    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredItems = fakeUsers.filter(item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()));

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />;
    }, [filterText, resetPaginationToggle]);

    return (
        <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            selectableRows
            persistTableHead
        />
    );

        // <table id="dtBasicExample" className="table" cellspacing="0" width="100%">
        //     <thead>
        //     <tr>
        //         <th scope={"col"}>Number</th>
        //         <th scope={"col"}>Type</th>
        //         <th scope={"col"}>Departure</th>
        //         <th scope={"col"}>Date</th>
        //         <th scope={"col"}>Summary</th>
        //         <th scope={"col"}>Edit</th>
        //     </tr>
        //     </thead>
        //     <tbody>
        //     {trains.map((train, index) => {
        //         return (
        //             <tr key={index} scope="row">
        //                 <th onClick={() => history.push(`train/${train.id}/details`)}>
        //                     {train.operationalTrainNumber}
        //                 </th>
        //                 <th onClick={() => history.push(`train/${train.id}/details`)}>
        //                     {TRAIN_TYPES[train.trainType].summary}
        //                 </th>
        //                 <th onClick={() => history.push(`train/${train.id}/details`)}>
        //                     {train.transferPoint}
        //                 </th>
        //                 <th onClick={() => history.push(`train/${train.id}/details`)}>
        //                     {new Date(train.scheduledTimeAtHandover).toLocaleString()}
        //                 </th>
        //                 <th onClick={() => history.push(`train/${train.id}/details`)}>
        //                     X
        //                 </th>
        //                 <th className="edit" onClick={() => onEditTrain(train)}>
        //                     <i className="fa fa-ellipsis-h"></i>
        //                 </th>
        //             </tr>
        //         )
        //     })}
        //     </tbody>
        // </table>



}
