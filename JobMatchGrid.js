/**
 * The jobMatchingUI application grid view, which displays the grid
 * @extends Ext.grid.Panel
 */
Ext.define('jobMatchingUI.view.JobMatchGrid' ,{	   	
    extend: 'Ext.grid.Panel',
    loadMask: true,
	xtype: 'JobMatchGrid',
	itemId: 'jmHCPGrid',	
	id: 'jmHCPGrid',	
	store : 'JobMatchResults',
	autoScroll: true,
	imageStack : {
		full 	: 'a_current_document.gif',
		partial : 'b_at_risk_alert.gif',
		missing : 'c_missing_incomplete_document.gif',
		service_center: 'service_center.png',
		fireIcon: 'travPromo.gif' // added for CR00003176
	},
	/**
		Filters are added for columns
	*/
	features : [
		{
			ftype: 'filters',
			local: true
		}
	],
	columnLines: true,
	
	IMAGE_FOLDER_PATH : window.JM_IMAGE_FOLDER_PATH,//'ui/src/resources/images/'
	checkAssignmentRenderer : function(value,meta,record) {
								var cell = value, tip;
								if(record.data.onConflictAssig){
									tip = "Assignment Ends : "+record.data.assigEndDate + "";									
									var ae = ""+record.data.assigEndDate + "";									
									cell = '<span style="color:orange;" title="'+tip+'"  >' + value +'</span>';

								}
        						return cell;
	},
	
	/**
		Columns are defined in this function which are displayed in grid
	*/	
    initComponent: function() {
		var me = this;
        me.columns = [ {xtype: 'rownumberer', width:35},
						{
							text: '<a id="lblEven" title="Select Even" href="javascript:void(0);">E</a>&nbsp;&nbsp;&nbsp;<span title="Select All" id="lblAll" >|</span>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0);" title="Select Odd" id="lblOdd">O</a>',
							dataIndex: 'eo',
							align:'center', 
							width: 70, 
							style: 'text-align:center',
							draggable: false,
							menuDisabled : true,
							sortable: false,
							xtype:'checkcolumn',
							listeners: {
								headerclick: function(ct, column, e, t, eOpts) {
																																			
									var store = Ext.StoreManager.lookup('JobMatchResults');									
									var sm = me.getView().getSelectionModel();
									var selections = sm.store.getRange(),
							            i = 0,start = 0;
							            len = selections.length,
							            start = sm.getSelection().length;
								     	sm.suspendChanges();
								     	if(t.id === "lblEven"){											
											start = 1;
											if(!me.evenSelected){
												me.evenSelected = true;
											}else{
												me.evenSelected= false;
											}
											for(var i=start; i < len;i=i+2){										      	
										     	selections[i].data.eo = me.evenSelected;
										  	}										    
										}else{
											if(!me.oddSelected){
												me.oddSelected = true;
											}else{
												me.oddSelected = false;
											}
											for(var i=start; i < len;i=i+2){										      	
										     	selections[i].data.eo = me.oddSelected;
										  	}
										}
								    sm.resumeChanges();							      							      							      	
							      	me.getView().refresh();
							      	Ext.getCmp('distribute-to').focus(false, 200);
							      	Ext.getCmp('sendMassEmail').setDisabled(false);
								},								
								checkchange: function(ct, rowIndex, checked){								
									Ext.getCmp('distribute-to').focus(false, 200);
									Ext.getCmp('sendMassEmail').setDisabled(false);
									
									var records = Ext.getCmp('jmHCPGrid').getStore().queryBy(function(record) {
										if(record.data.isDeleted) {
											var rowNo = Ext.StoreManager.lookup('JobMatchResults').indexOf(record);
											Ext.getCmp('jmHCPGrid').getView().addRowCls(rowNo, 'emailed-row');
										}
									});
								}
							}
						},
						{
							dataIndex: 'isDeleted',
							hidden: true
						}, 
						{
							text: 'CL #',
							dataIndex: 'clientNum',
							width: 65,						
							style: 'text-align:center',
							draggable: false,
							filter: {
								type: 'numeric'
							},
							renderer : me.checkAssignmentRenderer
						}, 
						{
							text: 'Name',
							dataIndex: 'name',
							width: 120,
							align:'left', 
							style: 'text-align:left',
							draggable: false,
							filter: {
								type: 'string'
							},
							renderer: function(v,m,r){
								var tip = '';
								var assignColor = '';
								if(r.data.onConflictAssig) {
									tip = "Assignment Ends : "+r.data.assigEndDate + "";
									assignColor = 'color:orange;';
								}
								if(r.data.searchingJob) // added for CR00003176
								{
									return "<a style='text-decoration: none; "+ assignColor +"' title='"+tip+"' target='_blank' href='"+ _jsSERVICE_CENTER_LINK +"?travClNum="+ r.data.clientNum +"&flow=dashBoard&userId="+ _jsRECRUITER_USERID +"&multiSessionTokenId="+ generateMultiSessionTokenId() +"&busunit="+ _jsRECRUITER_BUSUNIT +"&placementtype="+ _jsREC_PLACETYPE +"'><img style='vertical-align: text-bottom;' src='" + this.IMAGE_FOLDER_PATH + me.imageStack['service_center']+"'/>&nbsp;&nbsp;" + r.data.name + "</a><img style='vertical-align: text-bottom;' src='" + this.IMAGE_FOLDER_PATH + me.imageStack['fireIcon']+"'/>";
								}
								else
								{					
									return "<a style='text-decoration: none; "+ assignColor +"' title='"+tip+"' target='_blank' href='"+ _jsSERVICE_CENTER_LINK +"?travClNum="+ r.data.clientNum +"&flow=dashBoard&userId="+ _jsRECRUITER_USERID +"&multiSessionTokenId="+ generateMultiSessionTokenId() +"&busunit="+ _jsRECRUITER_BUSUNIT +"&placementtype="+ _jsREC_PLACETYPE +"'><img style='vertical-align: text-bottom;' src='" + this.IMAGE_FOLDER_PATH + me.imageStack['service_center']+"'/>&nbsp;&nbsp;" + r.data.name + "</a>";
								}
						    }
						},
						{
							text: 'Rec Init',
							dataIndex: 'recruiterInit',
							width: 60,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							renderer : me.checkAssignmentRenderer
						},
						{
							text: 'Score',
							dataIndex: 'matchingScore',
							width: 50,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							filter: {
								type: 'numeric'
							},
							renderer : me.checkAssignmentRenderer
						},
						{
							text: '%',
							xtype: 'numbercolumn',
							dataIndex: 'matchingPercent',
							width: 60,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							format: '0,000.00',
							filter: {
								type: 'numeric'
							},
							renderer: function(v,m,r){
								var tip = '';
								var assignColor = '';
								if(r.data.onConflictAssig) {
									tip = "Assignment Ends : "+r.data.assigEndDate + "";
									assignColor = 'color:orange;';
								}
								return '<span style="'+assignColor+'" title="'+tip+'"  >' + Ext.util.Format.number(r.data.matchingPercent, '0.00') +'</span>';
						    }
						},
						{
							text: 'State Lic',
							dataIndex: 'stateLicenseScore',
							flex :1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){																
					        	return "<img src='" + this.IMAGE_FOLDER_PATH + 	me.imageStack[ r.data.stateType  ]+"' title='"+(r.data.stateDescription || '') +"' />";
						    }
						},
						{
							text: 'Cert',
							dataIndex: 'certificationScore',
							width: 50,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){
					        	return "<img src='" + this.IMAGE_FOLDER_PATH + me.imageStack[ r.data.certificationType  ]+"' title='"+(r.data.certificationDescription || '') +"' />";
						    }
						},
						{
							text: 'Rec Ref',
							dataIndex: 'recReferenceScore',
							flex :1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){
					        	return "<img src='" + this.IMAGE_FOLDER_PATH + me.imageStack[ r.data.recReferenceType  ]+"' title='"+(r.data.recReferenceDescription || '') +"' />";
						    }
						},
						{
							text: 'Elig',
							dataIndex: 'eligibilityScore',
							width: 40,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){							
					        	return "<img src='" + this.IMAGE_FOLDER_PATH + me.imageStack[ r.data.eligibilityType  ]+"' title='"+(r.data.eligibilityDescription || '') +"' />";
						    }
						},
						{
							text: 'Prg Exp',
							dataIndex: 'programExpScore',
							flex :1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){
					        	return "<img src='" + this.IMAGE_FOLDER_PATH + me.imageStack[ r.data.programExpType  ]+"' title='"+(r.data.programExpDescription || '') +"' />";
						    }
						},
						{
							text: 'Spec Exp',
							dataIndex: 'specialtyExpScore',
							flex :1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){
					        	return "<img src='" + this.IMAGE_FOLDER_PATH + me.imageStack[ r.data.specialtyExpType  ]+"' title='"+(r.data.specialtyExpDescription || '') +"' />";
						    }
						},
						{
							text: 'Trav Exp',
							dataIndex: 'travelExpScore',
							flex :1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){
					        	return "<img src='" + this.IMAGE_FOLDER_PATH + me.imageStack[ r.data.travelExpType  ]+"' title='"+(r.data.travelExpDescription || '') +"' />";
						    }
						},
						{
							text: 'Job Pref',
							dataIndex: 'jobPrefereneScore',
							flex :1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){
					        	return "<img src='" + this.IMAGE_FOLDER_PATH + me.imageStack[ r.data.jobPrefereneType  ]+"' title='"+(r.data.jobPrefereneDescription || '') +"' />";
						    }
						},
						{
							text: 'Dt Avail',
							dataIndex: 'dateAvailableScore',
							flex :1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){
					        	return "<img src='" + this.IMAGE_FOLDER_PATH + me.imageStack[ r.data.dateAvailableType  ]+"' title='"+(r.data.dateAvailableDescription || '') +"' />";
						    }
						},
						{
							text: 'Chklist',
							dataIndex: 'checklistScore',
							flex :1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){
					        	return "<img src='" + this.IMAGE_FOLDER_PATH + me.imageStack[ r.data.checklistType  ]+"' title='"+(r.data.checklistDescription || '') +"' />";
						    }
						},
						{
							text: 'GP',
							dataIndex: 'aveDailyGrossProfit',
							flex :1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){
					        	return "<img src='" + this.IMAGE_FOLDER_PATH + me.imageStack[ r.data.aveDailyGrossProfitType  ]+"' title='"+(r.data.aveDailyGrossProfitDescription || '') +"' />";
						    }
						},
						{
							text: 'EMR',
							dataIndex: 'emrScore',
							flex :1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							/*filter: {
								type: 'list'
							},*/
							renderer: function(v,m,r){								
								return "<img src='" + this.IMAGE_FOLDER_PATH + me.imageStack[ r.data.emrType ]+"' title='"+(r.data.emrDescription || '') +"' />";
						    }
						},
						{
							xtype:'actioncolumn',
							text: 'Action',style: 'align:center',
							id: 'gridAction',style: 'text-align:center',
							layout: 'hbox',pack : 'center',
							width :120,
							items: [
								{									
									icon: this.IMAGE_FOLDER_PATH +'email_traveler.png',
									tooltip: 'Email',
									iconCls: 'phone-email-icon',
						            isDisabled: function(view, rowIndex, colIndex, item, record) {
						                return (record.get("emailTobeSend") == "Y")? false : true;
						            }
								},
								{
									icon: this.IMAGE_FOLDER_PATH +'phone_traveler.png',
									tooltip: 'Call',
									iconCls: 'phone-email-icon'
								},
								{
									icon: this.IMAGE_FOLDER_PATH +'delete.png',
									tooltip: 'Remove HCP for two weeks',
									iconCls: 'delete-icon',
									/**
										Function to remove HCP and give AJAX call to webservice
									*/
									handler: function(grid, rowIndex, colIndex) {										
										var me = this,jsonData={};
										var rec = grid.getStore().getAt(rowIndex);
										//Ext.apply(jsonData,rec.data);
										var positionId = '';
										if(window.JM_POSITION_ID) {
											positionId = window.JM_POSITION_ID;
										}
										else {
											positionId = rec.data.positionId;
										}
										Ext.apply(jsonData,{
													"recInit":_jsRECRUITER_ID,
													"positionID":positionId,
													"recruiterInit":_jsRECRUITER_ID,
													"clientNum": rec.data.clientNum,
													"matchingPercent": rec.data.matchingPercent,
													"matchingScore": rec.data.matchingScore,
													"teamId": Ext.getCmp('teamID').getValue()
												});

										if (rec) {
											Ext.getBody().mask('Deleting HCP...please wait');
											var request = {
												success: function(response){
													var responseObject = Ext.decode(response.responseText);
													if(responseObject && Ext.decode(responseObject.deleted)){
														grid.store.remove(rec);											    			
													}else{
														Ext.Msg.alert('Status', 'HCP deletion failed!');
													}	
													if(Ext.getBody().isMasked()){Ext.getBody().unmask();
													}													    		
												},
												params :jsonData , scope : me	
											}								
										
											jobMatchingUI.extension.JMRestProxy.remove(request);
											
										}
									},
									scope:this
								}
							]
						}
					];		
		
				
        var reorderer = Ext.create('Ext.ux.BoxReorderer', {
            listeners: {
                Drop: function(r, c, button) { //update sort direction when button is dropped
                    me.changeSortDirection(button, false);
                }
            }
        });
        
        //create the toolbar with the 2 plugins
        this.tbar = {
            itemId: 'tbar',
            items  : [	{
            				xtype: 'DistributeHCP'
            			},
            			'->',
            			{
            				xtype: 'panel',
            				border: false,
            				items:[ {
	            				xtype: 'button',
	            				id: 'sendMassEmail',
	            				text: 'Email these clients',
	            				disabled:true
            				} ]
            			}
            			/*,'->',
            			me.createSorterButtonConfig({
							text: 'Sort By Name',
							sortData: {
								property: 'name',
								direction: 'ASC'
							}
						}), 
						me.createSorterButtonConfig({
							text: 'Sort By Score',
							sortData: {
								property: 'score',
								direction: 'ASC'
							}
						})*/	
					]
        };	

        if(Ext.decode(window.JM_BEST_MATCH_ID) || window.JM_SOURCE == 'bestmatch'){
			me.addBestMatchColumns();		
		}

        this.callParent(arguments);
       
    },
    loadSubContractorData : function(){
    	var me = this,searchData={};    			
		Ext.apply(searchData,{"recruiterInit":window.JM_SUB_RECRUITER_ID,"recInit":window.JM_SUB_RECRUITER_ID,
						"positionID":window.JM_SUB_CONTRACTOR_ID , "mspRecruiter":window.isMSPRecruiter});				
   		var request =  {   					    	
	    	success: me.loadStore,
			params : searchData, scope : me,
			disableCaching: false // explicitly set it to false, ServerProxy handles caching
		};   		
    	jobMatchingUI.extension.JMRestProxy.searchSubcontractorMatch(request);    	
    	Ext.getBody().mask('Matching HCPs...please wait');
    	Ext.StoreManager.lookup('JobMatchResults').removeAll();		
    },
    loadDistributionData : function(){
    	var me = this,searchData={};    			
		Ext.apply(searchData,{"distributionId":window.JM_DIST_ID});				
   		var request =  {   					    	
	    	success: me.loadStore,
			params : searchData, scope : me,
			disableCaching: false // explicitly set it to false, ServerProxy handles caching
		};   		
    	jobMatchingUI.extension.JMRestProxy.searchDistribution(request);    	
    	Ext.getBody().mask('Matching HCPs...please wait');
    	Ext.StoreManager.lookup('JobMatchResults').removeAll();		
    },
    loadBestMatchData : function(){
    	var me = this,searchData={};    			
		Ext.apply(searchData,{"bestMatchId":window.JM_BEST_MATCH_ID,"mspRecruiter":window.isMSPRecruiter});				
   		var request =  {   					    	
	    	success: me.loadStore,
			params : searchData, scope : me,
			disableCaching: false // explicitly set it to false, ServerProxy handles caching
		};   		
    	jobMatchingUI.extension.JMRestProxy.searchBestMatch(request);    	
    	Ext.getBody().mask('Matching HCPs...please wait');
    	Ext.StoreManager.lookup('JobMatchResults').removeAll();		
    },
    loadData : function(){    	
    	var me = this;    	
		var formPanel = Ext.getCmp('SearchHCP');
		var form = formPanel.getForm();
		var searchData = form.getValues();
		Ext.apply(searchData,{"recruiterInit":_jsRECRUITER_ID,"recInit":_jsRECRUITER_ID,
							"positionID":_jsPositionID,"mspRecruiter":window.isMSPRecruiter});		
		var me = this;
   		var request =  {   					    	
	    	success: me.loadStore,
			params : searchData, scope : me,
			disableCaching: false // explicitly set it to false, ServerProxy handles caching
		};   		
    	jobMatchingUI.extension.JMRestProxy.search(request);    	
    	Ext.getBody().mask('Matching HCPs...please wait');
    	var store = Ext.StoreManager.lookup('JobMatchResults');
		store.removeAll();
    },
	loadStore : function(response){		
		var store = Ext.StoreManager.lookup('JobMatchResults');			
		var json = Ext.decode(response.responseText);
		
		var includeCNF = Ext.getCmp('includeCNF').getValue();
		var includeIntl = Ext.getCmp('includeIntl').getValue();
		var teamID = Ext.getCmp('teamID').getValue();
		var radius = Ext.getCmp('radius').getValue();
	
		window.JM_POSITION_FACILITY = json.facilityName;		
		window.JM_POSITION_SPECIALTY = json.specialty;
		window.JM_POSITION_SHIFT = json.shift;
		window.JM_POSITION_ID = json.positionId;
		window.JM_BUS_UNIT = json.busUnit;
		window.JM_POSITION_URL = json.positionUrl;
		window.JM_FACILITY_LOCATION = json.location;
		window.JM_SOURCE = json.source;
		window.JM_POSITION_NUMWEEKS = json.numWeeks;
		window.JM_POSITION_PROGRAM = json.program;
	
		if(json.searchResult){		
				
			var hcpList = json.searchResult;
			if(!hcpList.length){
				hcpList = [hcpList];
			}
			store.loadData(hcpList);		
			
			var northPanel = Ext.getCmp('northPanel');
			if(Ext.decode(window.JM_DIST_ID) !== null && window.JM_SOURCE == ''){
				northPanel.setTitle('Distribution Results For Position: '+ json.positionId + '; Hospital: '+ json.hn+ '; State: '+ json.state+ '; Specialty: '+ json.specialty+ '; Shift: '+ json.shift+ '; Start Date: '+ json.startDate);
				window.document.title = 'Job Matching - Distribution Results For Position: '+ json.positionId;
			}else if(Ext.decode(window.JM_SUB_CONTRACTOR_ID) !== null){
				northPanel.setTitle('Subcontractor Results For Position: '+ json.positionId + '; Recruiter: '+ window._jsRECRUITER_ID+ '; Hospital: '+ json.hn+ '; State: '+ json.state+ '; Specialty: '+ json.specialty+ '; Shift: '+ json.shift+ '; Start Date: '+ json.startDate);
				window.document.title = 'Job Matching - Subcontractor Results For Position: '+ json.positionId;
			}else if(json.positionId && !window.JM_SOURCE){
				northPanel.setTitle('Match for Position: '+ json.positionId + '; Recruiter: '+ window._jsRECRUITER_ID+ '; Hospital: '+ json.hn+ '; State: '+ json.state+ '; Specialty: '+ json.specialty+ '; Shift: '+ json.shift+ '; Start Date: '+ json.startDate);
				window.document.title = 'Job Matching Results For Position: '+ json.positionId;
			}
		}else{
			if(radius) {
				Ext.Msg.alert('Status', 'No results could be found for the selected radius. <br />Please widen or remove radius.');
			}
			else if(!includeCNF) {
				Ext.Msg.alert('Status', 'No results could be found. <br />Please select to include CNF.');				
			}
			else {
				Ext.Msg.alert('Status', 'No HCP found!');
			}
		}
		if(Ext.getBody().isMasked()){
		 	Ext.getBody().unmask();	
		 	
	        var columnsfit = Ext.getCmp('jmHCPGrid').columnManager.getColumns();
		 	if(window.JM_POSITION_ID) {
		 		Ext.getCmp('jmHCPGrid').getView().autoSizeColumn(columnsfit[3]);
		 	}
		 	else {
		 		Ext.getCmp('jmHCPGrid').getView().autoSizeColumn(columnsfit[6]);
		 	}
		 			 		 	
		}		
	},
    addBestMatchColumns : function() {
    	var me = this;        
    	var cols = [
    					{
							text: 'P#',
							dataIndex: 'positionId',
							flex : 1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							filter: {
								type: 'list'
							},
							renderer : me.checkAssignmentRenderer
						},
						{
							text: 'PHN',
							dataIndex: 'hn',
							flex : 1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							filter: {
								type: 'list'
							},
							renderer: function(v,m,r) {
								var tip;
								tip = r.data.hname;
								var conflictColor;
								if(r.data.onConflictAssig) {
									conflictColor = "color:orange;";
								}
								return '<span title="'+tip+'" style="'+conflictColor+'"  >' + r.data.hn +'</span>';
							}
						},						
						{
							text: 'PSpec',
							dataIndex: 'specialty',
							flex : 1,
							align:'center', 
							style: 'text-align:center',
							draggable: false,
							filter: {
								type: 'list'
							},
							renderer : me.checkAssignmentRenderer
						}
					];
		//Referring to insertItems methind in Array object in base.js
		me.columns.insertItems(2,cols);
    },
	listeners: {
		itemclick: function(dv, record, item, index, e) {
			var action = e.target.getAttribute('class');
			if (action && (action.indexOf("x-action-col-0") != -1 || action.indexOf("x-action-col-2") != -1)) {
				return false;
			}
			
			var panel = Ext.getCmp('southPanel');
			panel.expand();
			
			Ext.getCmp('hcpID').setValue(record.get("clientNum")).fireEvent('blur');
			
			if (action && action.indexOf("x-action-col-1") != -1) {
				Ext.getCmp('synopsis').setValue("JM I called this client");
				window.rowBlockRecord = undefined;
			}
			else {
				Ext.getCmp('synopsis').setValue("JM I contacted this client");
				window.phoneRecord = undefined;
				window.rowBlockRecord = record;
			}
			
			Ext.getCmp('notes').setValue("");
			Ext.getCmp('chkCallback').setValue(1);
			Ext.getCmp('buttonSaveNotes').enable();
			Ext.getCmp('buttonCancelNotes').enable();
		},
		afterrender: function(el, eOpts) {
			var northPanel = Ext.getCmp('northPanel');
		
			if(Ext.decode(window.JM_BEST_MATCH_ID)){
				northPanel.setTitle('Best Match Results');
				window.document.title = 'Job Matching - Best Match Results';
				this.loadBestMatchData();
			}else if(Ext.decode(window.JM_DIST_ID) !== null){
				northPanel.setTitle('Job Matching - Distribution Results');
				window.document.title = 'Job Matching - Distribution Results';
				this.loadDistributionData();
			}else if(Ext.decode(window.JM_SUB_CONTRACTOR_ID) !== null){
				window.document.title = 'Job Matching - Subcontractor Results';
				northPanel.setTitle('Subcontractor Results For Position: '+ window.JM_SUB_CONTRACTOR_ID + '; Recruiter: '+ window._jsRECRUITER_ID);
				this.loadSubContractorData();
			}else{
				window.document.title = 'Job Matching';
				this.loadData();
			}			
		}
	}, 
	
	 /**
     * Callback handler used when a sorter button is clicked or reordered
     * @param {Ext.Button} button The button that was clicked
     * @param {Boolean} changeDirection True to change direction (default). Set to false for reorder
     * operations as we wish to preserve ordering there
     */
    changeSortDirection: function (button, changeDirection) {
        var sortData = button.sortData,
            iconCls  = button.iconCls;
        
        if (sortData) {
            if (changeDirection !== false) {
                button.sortData.direction = Ext.String.toggle(button.sortData.direction, "ASC", "DESC");
                button.setIconCls(Ext.String.toggle(iconCls, "sort-asc", "sort-desc"));
            }
            this.store.clearFilter();
            this.doSort();
        }
    },

    doSort: function () {
        this.store.sort(this.getSorters());
    },

    /**
     * Returns an array of sortData from the sorter buttons
     * @return {Array} Ordered sort data from each of the sorter buttons
     */
    getSorters: function () {
        var sorters = [];
        var tbar = this.down('#tbar');
 
        Ext.each(tbar.query('button'), function(button) {
            sorters.push(button.sortData);
        }, this);

        return sorters;
    },

    /**
     * Convenience function for creating Toolbar Buttons that are tied to sorters
     * @param {Object} config Optional config object
     * @return {Object} The new Button configuration
     */
    createSorterButtonConfig: function (config) {
        var me = this;
        config = config || {};
        Ext.applyIf(config, {
            listeners: {
                click: function(button, e) {
                    me.changeSortDirection(button, true);
                }
            },
            iconCls: 'sort-' + config.sortData.direction.toLowerCase(),
            reorderable: true,
            xtype: 'button'
        });
        return config;
    }	
 });   
