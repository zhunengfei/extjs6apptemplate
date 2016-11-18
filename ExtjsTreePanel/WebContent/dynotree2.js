Ext.onReady(function() {

	Ext.define('RMSAjaxProxy', {
		alias : 'proxy.rmsajaxproxy',
		extend : 'Ext.data.proxy.Ajax',
		wrapPagingData : function() {
		},
		doRequest : function(operation, callback, scope) {
			var writer = this.getWriter(), request = this.buildRequest(
					operation, callback, scope);
			if (operation.allowWrite()) {
				request = writer.write(request);
			}
			Ext.apply(request, {
				headers : this.headers,
				timeout : this.timeout,
				scope : this,
				callback : this.createRequestCallback(request, operation,
						callback, scope),
				method : this.getMethod(request),
				jsonData : this.jsonData,
				disableCaching : false
			});

			if (this.jsonData) {
				request.jsonData = Ext.encode(Ext.merge(request.params,
						operation.params));
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
				number : page,
				//start: start,
				//limit: limit,
				size : 16,
				sortColumn : sort,
				sortOrder : dir
			};
			request.jsonData = jd;
			Ext.Ajax.request(request);
			return request;
		}
	});

	Ext.define('Projects', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'checked',
			defaultValue : false
		}, 'id', {
			name : 'leaf',
			mapping : 'leaf',
			type : 'boolean'
		}, {
			name : 'text',
			mapping : 'text'
		}, {
			name : 'children',
			mapping : 'entity'
		} ],
		proxy : {
			type : 'rmsajaxproxy',
			url : 'data.jsp',
			reader : {
				type : 'json'
			},
			actionMethods : {
				read : 'POST'
			},
			jsonData : true
		}
	});

	var store = Ext.create('Ext.data.TreeStore', {
		model : 'Projects',
		fields : [ 'text' ],
		jsonData : true,
		root : {
			text : 'Demo Tree'
		},
		listeners : {
			beforeload : function(store, operation, eOpts) {
				var node = operation.node;
				operation.params.hash = "somevalue";
				operation.params.type = "some other value";
				operation.params.node = node.get('id');
			}
		}
	});

	
	
	var tree = Ext.create('Ext.tree.Panel', {
		store : store,
		dockedItems : [ {
			xtype : 'toolbar',
			dock : 'left',
			items : [ {
				xtype : 'button',
				text : 'Button 1'
			} ]
		} ],
		autoScroll : true,
		renderTo : Ext.getBody(),
		height : 900,
		width : 500,
		title : 'Files',
		useArrows : true,
		select : function(parentNode, checked) {
			parentNode.set('checked', checked);
		},
		
		
		
		
		isAllChidrenAreSelected : function(parentNode) {
			var isAll = true;
			parentNode.childNodes.forEach(function(node) {
				isAll = isAll && node.get('checked');
			});
			return isAll;
		},
		sanitize : function(node, checked) {
			this.select(node.parentNode, this.isAllChidrenAreSelected(node.parentNode));
		},
		listeners : {
			checkchange : function(node, checked) {
				var _this = this;
				node.cascadeBy(function(child) {
					child.set('checked', checked);					
				});
				_this.sanitize(node, checked);
			},						
			afteritemexpand : function( node, index, item, eOpts ){
				var isNodeChecked = node.get('checked')
				if(isNodeChecked){					
					node.cascadeBy(function(child) {
						child.set('checked', isNodeChecked);
					});
				}
			}
		}
	});
});