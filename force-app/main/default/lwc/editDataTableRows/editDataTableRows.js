import { LightningElement, api, wire } from 'lwc';
import getContactsBasedOnAccount from '@salesforce/apex/ContactController.getContactsBasedOnAccount';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const COLUMNS = [
    { label: 'First Name', fieldName: 'FirstName', editable: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true },
    { label: 'Title', fieldName: 'Title', editable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
];

export default class EditDataTableRows extends LightningElement {
    @api recordId;
    contactData = [];
    columns = COLUMNS;
    draftValues = [];
    contactRefreshProp;

    @wire(getContactsBasedOnAccount, { accountId: "$recordId" })
    getContactsOutput(result) {
        this.contactRefreshProp = result;
        if (result.data) {
            this.contactData = result.data;
        } else if (result.error) {
            console.log("Error while loading records.");
        }
    }

    async saveHandler(event) {
        let records = event.detail.draftValues;
        let updatedRecordsArray = records.map(currentItem => {
            let fieldInput = { ...currentItem };
            return {
                fields: fieldInput
            }
        });

        this.draftValues = [];
        let updateRecordsArrayPromise = updatedRecordsArray.map((currentItem) =>
            updateRecord(currentItem)
        );

        await Promise.all(updateRecordsArrayPromise);
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            variant: 'success',
            message: 'Records updated successfully.',
        });
        this.dispatchEvent(toastEvent);
        await refreshApex(this.contactRefreshProp);
    }

}