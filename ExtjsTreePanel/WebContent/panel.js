
Ext.define('Result', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ]
   
});

var store = Ext.create('Ext.data.TreeStore', {
    //model: 'Result',
	autoload: true,
	expanded: false,
	fields: ['text', {
        name: 'checked',
        defaultValue: false
    }],    
    proxy: {
        requestMethod: 'GET',
        type: 'ajax',
        url: 'data.jsp',
        reader: {
            type: 'json',
            root: 'children'                 
        }
    },
    root: {
        text: 'Root'
    }
});


Ext.create('Ext.tree.Panel', {
    title: 'Simple Tree',    
        
    listeners: {
        checkchange: function(node, checked) {
            node.cascadeBy(function(child) {
                child.set('checked', checked);
            });
        }
    },
    width: 800,
    height: 900,
    store: store,
    //rootVisible: false,
    renderTo: Ext.getBody()
});;
