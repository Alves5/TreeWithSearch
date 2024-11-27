({
    doInit: function(cmp, event, helper) {
        var action = cmp.get('c.getParentWithChildren');
        action.setParams({
            ParentObj: cmp.get('v.parentObj'),
            ChildObj: cmp.get('v.childObj'),
            ParentObjNameField: cmp.get('v.parentObjNameField'),
            ChildObjNameField: cmp.get('v.childObjNameField')
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var objects = JSON.stringify(response.getReturnValue())
                    .replace(new RegExp(cmp.get('v.parentObjNameField'), 'g'), 'label')
                    .replace(new RegExp(cmp.get('v.childObjNameField'), 'g'), 'label')
                    .replace(new RegExp(cmp.get('v.childObj'), 'g'), 'items');

                var parsedObjects = JSON.parse(objects);
                cmp.set("v.items", parsedObjects);
                cmp.set("v.originalItems", parsedObjects); // Salva os dados originais
            } else {
                console.error("Failed with state: " + response.getError());
            }
        });

        $A.enqueueAction(action);
    },

    Search: function(cmp, event, helper) {
        var inputStr = cmp.find('searchField').get('v.value').toLowerCase();

        // Se o campo de busca estiver vazio, restaure os itens originais
        if (!inputStr) {
            cmp.set('v.items', cmp.get('v.originalItems'));
            return;
        }

        var allItems = JSON.parse(JSON.stringify(cmp.get('v.originalItems')));
        var results = helper.filterTree(allItems, inputStr);
        cmp.set('v.items', results);
    }
});