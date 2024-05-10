public with sharing class ContactController{
    @AuraEnabled(cacheable = true)
    public static List<Contact> getContactsBasedOnAccount(String accountId){
        List<Contact> contactsList = [SELECT Id, Name, FirstName, LastName, Title, Phone, Email, Picture__c, Rank__c, AccountId, Account.Name, LeadSource
                                      FROM Contact
                                      WHERE AccountId = :accountId
                                      LIMIT 10];
        return contactsList;
    }

}