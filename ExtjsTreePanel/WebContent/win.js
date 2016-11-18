Ext.require([
    'Ext.data.*',
    'Ext.grid.*'
]);

var TOTAL = 94; //random

var fetchedData = function(){
    this.data = null;
    this.total = 0;
}

function getRandomDate() {
    var from = new Date(1900, 0, 1).getTime();
    var to = new Date().getTime();
    var date = new Date(from + Math.random() * (to - from));
    
    return Ext.Date.clearTime(date);
}


function createFakeData(page, count) {
        var firstNames   = ['Ed', 'Tommy', 'Aaron', 'Abe'];
        var lastNames    = ['Spencer', 'Maintz', 'Conran', 'Elias'];
            
        var data = [];
        for (var i = 0; i < count ; i++) {
            var dob = getRandomDate();           
            var firstNameId = Math.floor(Math.random() * firstNames.length);
            var lastNameId  = Math.floor(Math.random() * lastNames.length);
            var name        = Ext.String.format("{0} {1}", firstNames[firstNameId], lastNames[lastNameId]);

            var id = 1 + (page-1) * count + i;
            if ( id > TOTAL ) break;
            data.push([id, name, dob]);
        }
        return data;
    }

Ext.onReady(function(){
    Ext.define('Person',{
        extend: 'Ext.data.Model',
        fields: [ { name:'Id', type: 'int' }, 'Name', 'dob']
    });

    // create the Data Store
    var store = Ext.create('Ext.data.Store', {
        model: 'Person',
        pageSize : 20,
        proxy: {
            type: 'memory',
            reader: {type: 'array', root : 'data', totalProperty : 'total'}
        },
        sorters: [{
            property : 'Id',
            direction:'ASC'
        }],
        listeners : {
            beforeload : function(store, operation, eOpts){
                var page = operation.page;
                var limit = operation.limit;  
                fetchedData.data = createFakeData(page, limit);
                fetchedData.total = TOTAL;
                store.proxy.data = fetchedData;
            }
        }
    });

    // create the grid
    Ext.create('Ext.grid.Panel', {
        store: store,
        columns: [
            {text: "Id", width:30, dataIndex: 'Id'},
            {text: "Name", flex:1, dataIndex: 'Name'},
            {text: "DOB", width: 130, dataIndex: 'dob', renderer: Ext.util.Format.dateRenderer('M d, Y')}
        ],
        // paging bar on the bottom
        bbar: Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true,
            displayMsg: '{0} - {1} of {2}',
            emptyMsg: "No topics to display"
        }),
        renderTo:'example-grid',
        width: 350,
        height: 280,
    });
        
    // trigger the data store load
    store.loadPage(1);
});