public class TreeviewParentChildContrl {
    @AuraEnabled
    public static List<SObject> getParentWithChildren(String ParentObj, String ChildObj, String ParentObjNameField, 
                                                      String ChildObjNameField) {
        String query = 'SELECT ' + ParentObjNameField + ', (SELECT ' + ChildObjNameField + ' FROM ' + ChildObj + ') FROM ' + ParentObj;
        return Database.query(query);
    }
}