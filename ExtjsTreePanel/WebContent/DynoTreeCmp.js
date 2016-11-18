/*
 * 	Tree Component for In List module
 * 
 *	@author Sushil	
 * 
 * */
//define(function{})
var DynoTreeCmp = (function() {

    Ext.define('RMSAjaxProxy', {
        alias: 'proxy.rmsajaxproxy',
        extend: 'Ext.data.proxy.Ajax',
        wrapPagingData: function() {},
        doRequest: function(operation, callback, scope) {
            var writer = this.getWriter(),
                request = this.buildRequest(
                    operation, callback, scope);
            if (operation.allowWrite()) {
                request = writer.write(request);
            }
            Ext.apply(request, {
                headers: this.headers,
                timeout: this.timeout,
                scope: this,
                callback: this.createRequestCallback(request, operation,callback, scope),
                method: this.getMethod(request),
                jsonData: this.jsonData,
                disableCaching: false
            });

            if (this.jsonData) {
                request.jsonData = Ext.encode(Ext.merge(request.params,operation.params));
                delete request.params;
            }

            jd = Ext.decode(request.jsonData);
            // if pageParam and other params is set to different value than
            // default this will not work
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
                // start: start,
                // limit: limit,
                size: 16,
                sortColumn: sort,
                sortOrder: dir
            };
            request.jsonData = jd;
            Ext.Ajax.request(request);
            return request;
        }
    });

    Ext.define('Projects', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'checked',
            defaultValue: false
        }, 'id', {
            name: 'leaf',
            mapping: 'leaf',
            type: 'boolean'
        }, {
            name: 'text',
            mapping: 'text'
        }, {
            name: 'children',
            mapping: 'entity'
        }],
        proxy: {
            type: 'rmsajaxproxy',
            url: 'data.jsp',
            reader: {
                type: 'json'
            },
            actionMethods: {
                read: 'POST'
            },
            jsonData: true
        }
    });
    
    
    Ext.define('RMS.tree.Panel', {
    	extend: 'Ext.tree.Panel',
    	alias : ['widget.rmstree'],        
        useArrows: true,
        areChidrenChecked: function(parentNode) {
            var isAll = true;
            if (parentNode && parentNode.childNodes) {
                parentNode.childNodes.forEach(function(node) {
                    isAll = isAll && node.get('checked');
                });
            }
            return isAll;
        },
        checkParent: function(node) {                        	
            if (node && node.parentNode) {
                var checked = node.get('checked'),parentNode = node.parentNode;
                
                if (!checked) {
                    while (parentNode && parentNode.parentNode) {
                        parentNode.set('checked', false);
                        parentNode = parentNode.parentNode;
                    }
                } else {
                    while (parentNode && parentNode.parentNode) {
                        var isAll = this.areChidrenChecked(parentNode);
                        if (isAll) {
                            parentNode.set('checked',true);
                        }
                        parentNode = parentNode.parentNode;
                    }
                }
            }
        },
        listeners: {
            /*
             * Check all the children if the parent is
             * checked.
             */
            checkchange: function(node, checked) {
                var _this = this;
                node.cascadeBy(function(child) {
                    child.set('checked', checked);
                });

                // ExtJS default treepanel
                // implementation doesn't handle
                // checkbox selection model
                // change event, it doesn't check parent
                // if all children are checked

                _this.checkParent(node);

            },
            /*
             * Newly tree nodes are not checked by
             * default if parent node is checked
             */
            afteritemexpand: function(node, index,
                item, eOpts) {
                var isNodeChecked = node.get('checked')
                if (isNodeChecked) {
                    node.cascadeBy(function(child) {
                        child.set('checked',
                            isNodeChecked);
                    });
                }
            }
        }
    
    });

    var _private = {
        getStore: function() {
            return Ext.create('Ext.data.TreeStore', {
                model: 'Projects',
                fields: ['text'],
                jsonData: true,
                root: {
                    text: 'Demo Tree'
                },
                listeners: {
                    beforeload: function(store, operation, eOpts) {
                        var node = operation.node;
                        operation.params.hash = "somevalue";
                        operation.params.type = "some other value";
                        operation.params.node = node.get('id');
                    }
                }
            });
        },
        createTree: function() {

            return Ext.create('RMS.tree.Panel', {
                    	renderTo: 'ctn',
                        store: this.getStore(),        
                        autoScroll: true,        
                        height: 900,
                        width: 500,
                        title: 'Files'                        
            		
                    });
        }
    };

    function DynoTreeCmp() {}

    DynoTreeCmp.prototype = {
        create: function() {
            var tree = _private.createTree();
            return tree;
        }
    }
    return DynoTreeCmp;
})();

new DynoTreeCmp().create();