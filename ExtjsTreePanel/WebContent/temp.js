	Ext.onReady(function () {
		// The data store containing the list of states
		var states = Ext.create('Ext.data.Store', {
			fields: ['abbr', 'name'],
			data: [
				{
					"abbr": "AL",
					"name": "Alabama"
				}
				, {
					"abbr": "AK",
					"name": "Alaska"
				}
				, {
					"abbr": "AZ",
					"name": "Arizona"
				}
        //...
    ]
		});
		Ext.define('DFormPanel', {
			extend: 'Ext.form.FormPanel',
			alias: ['widget.dformpanel'],
			height: 145,
			layout: 'hbox',
			defaults: { // defaults are applied to items, not the container
				padding: 10

			},
			items: [{
				layout: 'vbox',
				border: false,
				items: [{
					layout: 'hbox',
					border: false,
					defaults: {
						labelAlign: 'top',
						style: {
							'padding-left': '20px'
						}
					},
					items: [
						//  rate tyoe currency US nonus
						{
							xtype: 'combo',
							store: states,
							queryMode: 'local',
							displayField: 'name',
							valueField: 'abbr',
							fieldLabel: 'Rate Type',
							flex: 1,
							anchor: '100%',
							name: 'rateType'
                				}
				, {
							xtype: 'combo',
							store: states,
							queryMode: 'local',
							displayField: 'name',
							valueField: 'abbr',
							fieldLabel: 'Currency',
							labelWidth: 80,
							name: 'currency'
                				}, {
							xtype: 'radiogroup',
							columns: [.40, .60],
							width: 150,
							vertical: true,
							items: [
								{
									boxLabel: 'U.S.',
									width: 50,
									name: 'usNoNus',
									margin: '25 0 0 20',
									inputValue: 'Y',
									checked: true
						},
								{
									boxLabel: 'Non-U.S.',
									width: 100,
									name: 'usNoNus',
									margin: '25 0 0 2',
									inputValue: 'N'
						}
				        ]
				    }
					]
				}, {
					layout: 'hbox',
					border: false,
					defaults: {
						labelAlign: 'top',
						style: {
							'padding-left': '20px'
						}
					},
					style: {
						'padding-top': '20px'
					},


					items: [
						//  rate cap
						{
							xtype: 'textfield',
							fieldLabel: 'Rate %',
							flex: 1,
							anchor: '100%',
							name: 'ratePercent'
								}, {
							xtype: 'textfield',
							fieldLabel: 'Cap/Maximum Eligible Earnings',

							width: 360,
							labelWidth: 200,
							name: 'capMaxEligibleEarnings'
								}
					]
				}]
			}, {
				//checkboxes
				layout: 'fit',
				style: {
					'margin-left': '20px'
				},
				border: false,
				items: [{
					xtype: 'fieldset',
					title: 'Applicable Expense Component Type',
					items: [{
							xtype: 'checkboxgroup',
							labelAlign: 'top',
							width: 400,
							height: '100%',
							columns: [.50, .50],
							vertical: true,
							listeners: {
								change: function (field, newValue, oldValue, eOpts) {
									console.log('change:' + field.fieldLabel + ' ' + newValue.rb);
								}
							},
							items: [
								{
									boxLabel: 'All Employee Expense',
									name: 'expenseCompTypeId',
									inputValue: '1'
						},

								{
									boxLabel: 'Unused Vacation Pay',
									name: 'expenseCompTypeId',
									inputValue: '7'
						},
								{
									boxLabel: 'Payment in Lieu of Notice',
									name: 'expenseCompTypeId',
									inputValue: '4'
						},
								{
									boxLabel: 'Annual Salary',
									name: 'expenseCompTypeId',
									inputValue: '2',
									checked: true
						},
								{
									boxLabel: 'Severance Pay',
									name: 'expenseCompTypeId',
									inputValue: '5'
						},
								{
									boxLabel: 'Special Payments',
									name: 'expenseCompTypeId',
									inputValue: '6'
						},
								{
									boxLabel: 'Notice Pay',
									labelWidth: 20,
									name: 'expenseCompTypeId',
									inputValue: '3'
						}]
								}

				]
				}]

			}, {
				layout: 'hbox',
				width: 180,
				style: {
					'margin-top': '30px',
					'margin-left': '43px'
				},
				border: false,
				items: [{
					xtype: 'button',
					text: '-',
					scale: 'medium',
					minWidth: 50,
					handler: function () {
						Ext.getCmp('dynocontainer').remove(this.up('form'));
					}
				}]
			}]
		});
		//window.onclick = function(){
		Ext.create('Ext.window.Window', {
			title: 'Add/Update Fringe/Payroll Tax & DCPP Rates',
			height: window.innerHeight - 100,
			width: window.innerWidth - 100,
			layout: 'border',
			bodyStyle: {
				"background-color": "white"
			},
			items: [
				{
					region: 'north',
					border: false,
					style: {
						'padding-top': '15px'
					},
					height: 105,
					layout: 'vbox',
					items: [{
						style: {
							'padding-bottom': '15px'
						},
						border: false,
						id: 'header',
						items: [{
							border: false,
							id: 'header-form',
							xtype: 'form',
							layout: {
								type: 'hbox',
								align: 'middle',
								pack: 'start'
							},
							items: [{
									xtype: 'combo',
									store: states,
									queryMode: 'local',
									displayField: 'name',
									valueField: 'abbr',
									labelAlign: 'right',
									labelWidth: 190,
									fieldLabel: 'Legal Vehicle Geography (Level 2)',
									anchor: '100%',
									name: 'lvCountry'
                				}
								, {
									xtype: 'combo',
									store: states,
									queryMode: 'local',
									displayField: 'name',
									valueField: 'abbr',
									labelAlign: 'right',
									labelWidth: 200,
									fieldLabel: 'Legal Vehicle Geography (Level 5)',
									anchor: '100%',
									name: 'lvGeo'
                				}, {
									xtype: 'datefield',
									labelWidth: 120,
									anchor: '100%',
									fieldLabel: 'Effective Start Data',
									labelAlign: 'right',
									name: 'from_date',
									maxValue: new Date() // limited to the current date or prior
    							}
							   ]
					}],
					}, {
						layout: 'hbox',
						border: false,
						items: [{
							xtype: 'textareafield',
							grow: true,
							height: 40,
							width: 500,
							labelWidth: 190,
							name: 'message',
							labelAlign: 'right',
							fieldLabel: 'Comments',
							anchor: '100%'
						}]
    }]
				}
				, {
					region: 'center',
					border: false,
					overflowY: 'scroll',
					id: 'dynocontainer',
					autoScroll: true,
					flex: 1,
					title: '&nbsp',

					style: {
						borderTop: '0px'
					},
					split: true,
					anchor: '100%',
					items: [{
						xtype: 'dformpanel'
						}]
				}
				, {
					region: 'south',
					border: false,
					align: 'center',
					height: 40,
					border: false,
					style: {
						'margin': '10px' //,'padd-left': '43px'
					},
					layout: 'hbox',
					columns: [.33, .33, .33],
					items: [{
							width: '33%',
							border: false
						},
						{
							anchor: '100%',
							width: '33%',
							border: false,
							items: [{
								xtype: 'button',
								scale: 'medium',
								text: 'Save',
								margin: '0 10',
								handler: function () {
									//get header form data
									var headerRecord = Ext.getCmp('header-form').getForm().getValues();
									console.log(headerRecord);
									//get line item data
									var lineItems = Ext.getCmp('dynocontainer').items;
									for (var i = 0; i < lineItems.length; i++) {
										console.log(lineItems.items[i].getForm().getValues());
									}
									//header record in each line item
									//send as array of line itmes to server								
								}
						}, {
								xtype: 'button',
								scale: 'medium',
								text: 'Cancel',
								handler: function () {}
						}]
						}, {

							width: '33%',
							border: false,
							items: {
								xtype: 'button',
								style: {
									'margin-right': '50px',
									'border': '1px solid #B3B3B3'
								},
								text: '+',
								scale: 'medium',
								minWidth: 50,
								handler: function () {
									Ext.getCmp('dynocontainer').add({
										xtype: 'dformpanel'
									});
								}
							}
						}]
				}
			]
		}).show();
	});