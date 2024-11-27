({
    doInit: function(cmp, event, helper) {
        var parentObj = cmp.get('v.parentObj');
        var childObj = cmp.get('v.childObj');
        var parentObjNameField = cmp.get('v.parentObjNameField');
        var childObjNameField = cmp.get('v.childObjNameField');
        var action = cmp.get('c.getParentWithChildren');
        action.setParams({
            ParentObj: parentObj,
            ChildObj: childObj,
            ParentObjNameField: parentObjNameField,
            ChildObjNameField: childObjNameField
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log("state:" + state);
            if (state === "SUCCESS") {
                var objects = JSON.stringify(response.getReturnValue()).replace(new RegExp(parentObjNameField, 'g'), 'label');
                objects = objects.replace(new RegExp(childObjNameField, 'g'), 'label');
                objects = objects.replace(new RegExp(childObj, 'g'), 'items');
                console.log('Before update:' + objects);
                cmp.set("v.items", JSON.parse(objects)); // Define os itens para exibição
                cmp.set("v.originalItems", JSON.parse(objects)); // Armazena os itens originais para restaurar
            } else {
                console.log("Failed with state: " + response.getError());
            }
        });
        $A.enqueueAction(action);
    },

    // Função de pesquisa
    Search: function(cmp, event, helper) {
        var searchValue = cmp.find('searchField').get('v.value').toLowerCase(); // Valor da pesquisa
        var results = [];
        var allItems = cmp.get('v.originalItems'); // Usa os itens originais para filtrar

        // Se houver algum valor de pesquisa, filtra os itens
        if (searchValue) {
            // Cria um conjunto (set) para evitar duplicação de contas
            var seenItems = new Set();

            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                // Verifica se a conta já foi adicionada (com base no ID ou nome)
                if (item.label.toLowerCase().includes(searchValue) && !seenItems.has(item.label)) {
                    results.push(item);
                    seenItems.add(item.label); // Marca a conta como "vistada"
                }
                // Verifica itens filhos e os filtra recursivamente
                if (item.items && item.items.length > 0) {
                    var childResults = helper.filterTree(item.items, searchValue, seenItems);
                    if (childResults.length > 0) {
                        item.items = childResults;
                        if (!seenItems.has(item.label)) {
                            results.push(item);
                            seenItems.add(item.label); // Marca o item pai como "vistado"
                        }
                    }
                }
            }
        } else {
            // Se não houver valor de pesquisa, retorna os itens originais
            results = allItems;
        }

        cmp.set('v.items', results); // Atualiza os itens na árvore
    },

    // Função para restaurar os itens quando o campo de pesquisa for limpo
    handleSearchClear: function(cmp, event, helper) {
        var searchValue = cmp.find('searchField').get('v.value'); // Obtém o valor do campo de pesquisa
        if (!searchValue) {
            // Se o valor do campo for vazio, restaura os itens originais
            cmp.set('v.items', cmp.get('v.originalItems'));
        }
    }
})