({
    filterTree: function(items, searchValue, seenItems) {
        var filteredItems = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.label.toLowerCase().includes(searchValue) && !seenItems.has(item.label)) {
                filteredItems.push(item);
                seenItems.add(item.label); // Marca a conta como "vistada"
            }
            // Verifica itens filhos e os filtra recursivamente
            if (item.items && item.items.length > 0) {
                var childResults = this.filterTree(item.items, searchValue, seenItems);
                if (childResults.length > 0) {
                    item.items = childResults;
                    filteredItems.push(item);
                }
            }
        }
        return filteredItems;
    }
})