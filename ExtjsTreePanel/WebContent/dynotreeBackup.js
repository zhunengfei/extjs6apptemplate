Ext.onReady(function(){
	
	
	
	  Ext.define('RMSAjaxProxy', {
		    alias: 'proxy.rmsajaxproxy',
		    extend: 'Ext.data.proxy.Ajax',
		    wrapPagingData: function() {
		    },
		    doRequest: function(operation, callback, scope) {
		      var writer = this.getWriter(), request = this.buildRequest(operation,
		              callback, scope);
		      if (operation.allowWrite()) {
		        request = writer.write(request);
		      }
		      Ext.apply(request, {
		        headers: this.headers,
		        timeout: this.timeout,
		        scope: this,
		        callback: this.createRequestCallback(request, operation, callback,
		                scope),
		        method: this.getMethod(request),
		        jsonData: this.jsonData,
		        disableCaching: false
		      });
		      
		      
		      if (this.jsonData) {
		        request.jsonData = Ext.encode(Ext.merge(request.params,operation.params));
		        delete request.params;
		      }

		      jd = Ext.decode(request.jsonData);
		      //if pageParam and other params is set to different value than default this will not work
		      var page = jd.page;
		      delete jd.page;
		      var start = jd.start;
		      delete jd.start;
		      var limit = jd.limit;
		      delete jd.limit;
		      var sort = jd.sort;
		      delete jd.sort;
		      var dir = jd.dir;
		      delete jd.dir;

		      jd.pagingInfo = {
		        number: page,
		        //start: start,
		        //limit: limit,
		        size : 16,
		        sortColumn: sort,
		        sortOrder: dir
		      };
		      request.jsonData = jd;
		      Ext.Ajax.request(request);
		      return request;
		    }
		  });

	  
	  
	
	 var store = Ext.create('Ext.data.TreeStore', {
		 fields: ['text', {
		        name: 'checked',
		        defaultValue: false
		    }],  
		    jsonData : true,
	        proxy: {
	            type: 'rmsajaxproxy',
	            url: 'data.jsp',
	            actionMethods: {
	                read   : 'POST'
	            },
	            
	 			jsonData : true
	        },
	        root: {
	            text: 'Demo Tree',
	            id: 'id'
	        },
	        listeners: {
	                beforeload: function(store, operation, eOpts) {
	                    var node = operation.node;
	                    operation.params.hash = "somevalue";
	                    operation.params.type = "some other value";
	                    operation.params.node = node.get('id');
	                    //debugger;
	                }
	        }
	    });
	 
	 var tree = Ext.create('Ext.tree.Panel', {
	        store: store,	
	        dockedItems: [{
	            xtype: 'toolbar',
	            dock: 'left',
	            items: [
	                { xtype: 'button', text: 'Button 1' }
	            ]
	        }],
	        autoScroll : true,
	        renderTo: Ext.getBody(),
	        height: 900,
	        width: 500,
	        title: 'Files',
	        useArrows: true,
	        listeners: {
	            checkchange: function(node, checked) {
	             
	            	node.cascadeBy(function(child) {
	                    child.set('checked', checked);
	                });
	            	
	            }
	        }
	    });
});