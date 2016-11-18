
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
    proxy: {
        type: 'ajax',
        url: 'data.jsp',
        reader: {
            type: 'json',
            root: 'children'                 
        }
    }
});


Ext.create('Ext.tree.Panel', {
    title: 'Simple Tree',
    width: 800,
    height: 900,
    store: store,
    rootVisible: false,
    renderTo: Ext.getBody()
});;
