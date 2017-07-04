import Ember from 'ember';
import layout from '../templates/components/ap-components';

export default Ember.Component.extend({
    layout,
    tagName: '',
    componentConfig: Ember.computed.reads('config.componentConfig'),
    init(){
        this._super(...arguments);
        this.set('multilevelTableConfig', this.getMultilevelTableConfig());
        this.set('multilevelTabConfig', this.getMultilevelTabConfig());
    },
    actions:{
      rowExpandMultilevelTableAction(row) {
          Ember.Logger.log('Client contact Row called on ', row);
      },
      rowExpandMultilevelTabAction(row) {
          Ember.Logger.log('Buying Centre Row called on ', row);
      },
      redirectToCallreport(record){
        Ember.Logger.log('Redirect Call report', record);
      }
    },
    getMultilevelTableConfig(){
      return {
        "hideToolbar": true,
        "rowActions" : {
            "items": [
                { "label": "Add SCB Contacts", "action": "addSCBContacts", "iconName": "supervisor_account"},
                { "label": "New Call Report", "action": "newRCR", "iconName": "phone" },
                { "label": "Remove Contact", "action": "rmContact", "iconName": "remove_circle"}
            ]
        },
      	"content": Ember.A([
          Ember.Object.create({
        		"name": "Chia, Yeong Yeong",
        		"id": 11,
        		"roleBuyDecision": "Administrative",
        		"products": "Transaction Banking",
        		"last2Calls": Ember.A([
              Ember.Object.create({
                "callId": "201660681000318869",
                "callDate": "1479962153396"
              }),
              Ember.Object.create({
                "callId": "20166068100430318869",
                "callDate": "1479962153396"
              })
            ]),
        		"callFrequency": "Monthly",
        		"SCBContacts": "Yes",
            "childContent": Ember.A([
               Ember.Object.create({
            			"name": "1501911-Pusa Venkatesh, VinothKumar",
            			"id": 11,
            			"roleType": "Relationship Manager",
            			"relationshipStatus": "Example Status"
          		 })
            ])
        	}),
          Ember.Object.create({
        		"name": "Darsana, Billy Kristian",
        		"id": 22,
        		"roleBuyDecision": "Global Head",
        		"products": "Lending",
            "last2Calls": Ember.A([
              Ember.Object.create({
                "callId": "2016606810043430318869",
                "callDate": "1479962153396"
              })
            ]),
        		"callFrequency": "Monthly",
        		"SCBContacts": "Yes",
            "childContent": Ember.A([
               Ember.Object.create({
            			"name": "1531570-Frank Palmer",
            			"id": 12,
            			"roleType": "Relationship Manager",
            			"relationshipStatus": "Example Status"
          		 }),
               Ember.Object.create({
                 "name": "1435698-Cathy Miller",
                 "id": 13,
                 "roleType": "Relationship Manager",
                 "relationshipStatus": "Example Status"
          		 })
            ])
        	}),
          Ember.Object.create({
        		"name": "Foo, Lilian Yin Fun",
        		"id": 33,
        		"roleBuyDecision": "Administrative",
        		"products": "Transaction Banking",
            "last2Calls": Ember.A([
              Ember.Object.create({
                "callId": "201660681003430318869",
                "callDate": "1479962153396"
              })
            ]),
        		"callFrequency": "Monthly",
        		"SCBContacts": "Yes",
            "childContent": Ember.A()
        	})
        ]),
      	"columns": [{
      		"field": "name",
      		"title": "Name",
          "type": 'link',
          "vCardField" : 'customVCardField',
          "isPriorityWidth": true
      	}, {
      		"field": "roleBuyDecision",
      		"type": "text",
      		"title": "Role in Buy Decision"
      	}, {
      		"field": "products",
      		"type": "text",
      		"title": "Products",
          "isPriorityWidth": true
      	}, {
      		"field": "last2Calls",
          "type": 'arrayLink',
          "action": "redirectToCallreport",
      		"title": "Last 2 Calls",
          "isPriorityWidth": true
      	}, {
      		"field": "callFrequency",
      		"type": "text",
      		"title": "call Plan Freq."
      	}, {
      		"field": "SCBContacts",
      		"type": "text",
      		"title": "SCB Contacts"
      	}],
      	"isMultilevelTable": true,
        "childContentKey":'childContent',
      	"rowExpandAction": "rowExpandMultilevelTableAction",
      	"childTableConfig": {
          "hideToolbar": true,
          "rowAction": {
        		"iconName": "remove_circle",
        		"action": "deleteAction"
        	},
      		"columns": [{
      			"field": "name",
      			"type": "text",
      			"title": "Name"
      		}, {
      			"field": "roleType",
      			"type": "text",
      			"title": "Role Type"
      		}, {
      			"field": "relationshipStatus",
      			"type": "text",
      			"title": "Relationship Status",
            "isPriorityWidth": true
      		}]
      	}
      }
    },
    getMultilevelTabConfig(){
        return {
            "hideToolbar": true,
            "rowActions" : {
                "items": [
                    { "label": "Add Centre Contacts", "action": "addCentreContacts", "iconName": "supervisor_account"},
                    { "label": "Remove Centre", "action": "rmCentre", "iconName": "remove_circle"}
                ]
            },
            "content": Ember.A([
              Ember.Object.create({
                "name": "Chia, Yeong Yeong",
                "id": 11,
                "roleBuyDecision": "Administrative",
                "products": "Transaction Banking",
                "last2Calls": Ember.A([
                  Ember.Object.create({
                    "callId": "201660681000318869",
                    "callDate": "1479962153396"
                  }),
                  Ember.Object.create({
                    "callId": "20166068100430318869",
                    "callDate": "1479962153396"
                  })
                ]),
                "callFrequency": "Monthly",
                "SCBContacts": "Yes",
                "contacts": {
                    "clientContacts":Ember.A([
                        Ember.Object.create({
                          "name": "1501911 - Pusa Venkatesh, VinothKumar",
                          "role": "Administrative"
                        }),
                        Ember.Object.create({
                          "name": "1435698-Cathy Miller",
                          "role": "Global Head"
                        })
                    ]),
                    "scbContacts":Ember.A([
                        Ember.Object.create({
                          "name": "1480831 - Deepen Kothari",
                          "role": "Administrative"
                        }),
                        Ember.Object.create({
                          "name": "1435698-Cathy Miller",
                          "role": "Global Head"
                        })
                    ])
                }
              }),
              Ember.Object.create({
                "name": "Darsana, Billy Kristian",
                "id": 22,
                "roleBuyDecision": "Global Head",
                "products": "Lending",
                "last2Calls": Ember.A([
                  Ember.Object.create({
                    "callId": "201660681000318869",
                    "callDate": "1479962153396"
                  }),
                  Ember.Object.create({
                    "callId": "20166068100430318869",
                    "callDate": "1479962153396"
                  })
                ]),
                "callFrequency": "Monthly",
                "SCBContacts": "Yes",
                "contacts": {
                    "clientContacts":Ember.A([
                        Ember.Object.create({
                          "name": "1480831 - Deepen Kothari",
                          "role": "Administrative"
                        })
                    ]),
                    "scbContacts":Ember.A([
                        Ember.Object.create({
                          "name": "1501911 - Pusa Venkatesh, VinothKumar",
                          "role": "Administrative"
                        })
                    ])
                }
              }),
              Ember.Object.create({
                "name": "Foo, Lilian Yin Fun",
                "id": 33,
                "roleBuyDecision": "Administrative",
                "products": "Transaction Banking",
                "last2Calls": Ember.A([
                  Ember.Object.create({
                    "callId": "201660681000318869",
                    "callDate": "1479962153396"
                  }),
                  Ember.Object.create({
                    "callId": "20166068100430318869",
                    "callDate": "1479962153396"
                  })
                ]),
                "callFrequency": "Monthly",
                "SCBContacts": "Yes",
                "contacts": {
                    "clientContacts":Ember.A([
                        Ember.Object.create({
                          "name": "1435698-Cathy Miller",
                          "role": "Global Head"
                        })
                    ]),
                    "scbContacts":Ember.A([
                        Ember.Object.create({
                          "name": "1501911 - Pusa Venkatesh, VinothKumar",
                          "role": "Administrative"
                        })
                    ])
                }
              })
            ]),
            "columns": [{
          		"field": "name",
          		"title": "Name",
              "type": 'link',
              "vCardField" : 'customVCardField',
              "isPriorityWidth": true
          	}, {
          		"field": "roleBuyDecision",
          		"type": "text",
          		"title": "Role in Buy Decision"
          	}, {
          		"field": "products",
          		"type": "text",
          		"title": "Products",
              "isPriorityWidth": true
          	}, {
          		"field": "last2Calls",
              "type": 'arrayLink',
              "action": "redirectToCallreport",
          		"title": "Last 2 Calls",
              "isPriorityWidth": true
          	}, {
          		"field": "callFrequency",
          		"type": "text",
          		"title": "call Plan Freq."
          	}, {
          		"field": "SCBContacts",
          		"type": "text",
          		"title": "SCB Contacts"
          	}],
            "isMultilevelTab": true,
            "childContentKey":'contacts',
            "rowExpandAction": "rowExpandMultilevelTabAction",
            "childTabConfig": {
              "isStatic": true,
              "selectedIndex":0,
              "tabs": Ember.A([
                  Ember.Object.create({
                      "label": "CLIENT",
                      "tabContentKey": "clientContacts",
                      "tabContentConfig":{
                        "hideToolbar":true,
                        "rowAction": {
                      		"iconName": "remove_circle",
                      		"action": "deleteAction"
                      	},
                        "columns": Ember.A([
                          {
                              "field": 'name',
                              "title": 'Name'
                          }, {
                              "field": 'role',
                              "title": 'Role in Buy Decision',
                              "isPriorityWidth": true
                          }
                        ])
                      }
                  }),
                  Ember.Object.create({
                      "label": "SCB",
                      "tabContentKey": "scbContacts",
                      "tabContentConfig":{
                        "hideToolbar":true,
                        "rowAction": {
                      		"iconName": "remove_circle",
                      		"action": "deleteAction"
                      	},
                        "columns": Ember.A([
                          {
                              "field": 'name',
                              "title": 'Name',
                              "isPriorityWidth": true
                          }
                        ])
                      }
                  })
              ])
            }
        }
    }
});
