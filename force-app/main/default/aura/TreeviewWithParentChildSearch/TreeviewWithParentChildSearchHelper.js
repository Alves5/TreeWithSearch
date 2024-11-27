({
    filterTree: function(items, keyword) {
        let filteredItems = [];
        items.forEach(item => {
            let match = item.label.toLowerCase().includes(keyword);
            let filteredChildren = item.items ? this.filterTree(item.items, keyword) : [];
            if (match || filteredChildren.length > 0) {
                let newItem = {
                    label: item.label,
                    items: filteredChildren
                };
                filteredItems.push(newItem);
            }
        });
        return filteredItems;
    }
});