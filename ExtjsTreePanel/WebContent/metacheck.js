Ext.require([
    'Ext.data.*',
    'Ext.grid.*'
]);

Ext.onReady(function(){
	
	Ext.override(Ext.data.proxy.Ajax, {
        
        doRequest: function(operation, callback, scope) {
            var writer  = this.getWriter(),
                request = this.buildRequest(operation, callback, scope);
            
            if (operation.allowWrite()) {
                request = writer.write(request);
            }
            
            Ext.apply(request, {
                headers       : this.headers,
                timeout       : this.timeout,
                scope         : this,
                callback      : this.createRequestCallback(request, operation, callback, scope),
                method        : this.getMethod(request),
                disableCaching: false // explicitly set it to false, ServerProxy handles caching
            });
            
            //Added... jsonData is handled already
            if(this.jsonData) {
                request.jsonData = Ext.encode(request.params);
                delete request.params;
            }
            
            Ext.Ajax.request(request);
            
            return request;
        }
    });
	
	
	
    Ext.define('Person',{
        extend: 'Ext.data.Model',
        fields: [ 'lvCountry', 'lvGeo', 'effStartDate']
    });

    // create the Data Store
    var store = Ext.create('Ext.data.Store', {
        model: 'Person',
        
        pageSize : 20,
        proxy: {
            type: 'ajax',url:'data.jsp', method:'POST', actionMethods : {
            	read :"POST"
            },            
            jsonData: true ,
            reader: {type: 'json', root : 'resourceData.fringeData', totalProperty : 'total'}
        },
        sorters: [{
            property : 'lvCountry',
            direction:'ASC'
        }]
    });
    store.load({params:{something:1}});

    // create the grid
    Ext.create('Ext.grid.Panel', {
        store: store,
        columns: [
            {text: "Id", width:30, dataIndex: 'lvCountry'},
            {text: "Name", flex:1, dataIndex: 'lvGeo'},
            {text: "DOB", width: 130, dataIndex: 'effStartDate'}
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