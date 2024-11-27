<aura:application extends="force:slds">
    <c:TreeviewWithParentChildSearch 
        parentObj="Account" 
        childObj="Opportunities" 
        parentObjNameField="Name" 
        childObjNameField="Name" />
</aura:application>