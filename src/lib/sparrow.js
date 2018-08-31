/**
 * Functions for handling SCIM operations
 *
 * Kiran Ayyagari (kayyagari@keydap.com)
 */
/* eslint-disable */
import axios from 'axios'
import { Loading, MessageBox, Notification } from 'element-ui'
export {AXIOS_SCIM_CREATE_CONFIG, SCIM_BASE_URL, USERS_URL, GROUPS_URL, APPS_URL, SCIM_JSON_TYPE, AUDIT_EVENTS_URL,
        normalizeKeys, showWait, closeWait, showSuccess, showErr, confirm, loadGroupNamesAndIds, 
        getGroupNamesAndIds, loadResTypes, getResTypeNames, getResType, getNameOfGroup, addedNewGroup, profile}

 var SCIM_BASE_URL = '/v2/'
 var USERS_URL = SCIM_BASE_URL + 'Users/'
 var GROUPS_URL = SCIM_BASE_URL + 'Groups/'
 var APPS_URL = SCIM_BASE_URL + 'Applications/'
 var AUDIT_EVENTS_URL = SCIM_BASE_URL + 'AuditEvents/'
 var RESTYPES_URL = SCIM_BASE_URL + 'ResourceTypes'
 var SCHEMAS_URL = SCIM_BASE_URL + 'Schemas'

 var SCIM_JSON_TYPE = "application/scim+json; charset=UTF-8"
 var AXIOS_SCIM_CREATE_CONFIG = {headers: {'Content-Type': SCIM_JSON_TYPE}}

 var loadingWidget = null;
 var groupNamesAndIds = []
 var resTypeNames = []
 /** The resourcetypes supported by the server */
 var resTypes = {}
 var profile = null

 export function setProfile(p) {
     profile = p
 }
 async function fetchUser(id) {
    let res = await axios.get(USERS_URL + id)
    return res.data
}

function normalizeKeys(je) {
    //console.log('normalizeKeys')
    //console.log(je)
    if(je === undefined || je === null) {
        return
    }

    if(je instanceof Array) {
        for(var j=0; j<je.length; j++) {
            normalizeKeys(je[j])
        }
    }
    else if (je instanceof Object) {
        for(var k  in je) {
            if(je.hasOwnProperty(k)) {
                var obj = je[k]
                if(k.indexOf(":") != -1) { // extension object's key
                    normalizeKeys(obj)
                }
                else {
                    if(obj instanceof Array || obj instanceof Object) {
                        normalizeKeys(obj)
                    }
                    var loweredKey = k.toLowerCase()
                    je[loweredKey] = obj
                    if (k !== loweredKey) {
						delete je[k]
                    }
                }
            }
        }
    }
}

function loadGroupNamesAndIds(force) {
    if(force || groupNamesAndIds.length == 0) {
        axios.get(GROUPS_URL + '?attributes=id,displayname').then(resp => {
            var tmp = resp.data.Resources
            normalizeKeys(tmp)
            //TODO make groupNamesAndIds a Map
            groupNamesAndIds = tmp
            //console.log('loaded groups ' + tmp.length)
        }).catch(e => {
            showErr(e, 'Failed to load groups')
        })
    }
}

function getGroupNamesAndIds() {
    return groupNamesAndIds
}

function getNameOfGroup(id) {
    for(let i=0; i < groupNamesAndIds.length; i++) {
        let g = groupNamesAndIds[i]
        if(g.id == id) {
            return g.displayname
        }
    }

    return null
}

function addedNewGroup(g) {
    if(g !== undefined || g !== null) {
        groupNamesAndIds.push(g)
    }
}

 function showWait() {
    loadingWidget = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)',
        fullscreen: true
      })
 }

 function closeWait() {
     if(loadingWidget != null) {
         loadingWidget.close()
         loadingWidget = null
     }
 }

 function showSuccess(msg) {
     Notification.success({message: msg})
 }

 function showErr(e, msg) {
     console.log(e)
     // close if the wait screen is still present
     closeWait()
     if(msg === undefined || msg === null) {
         msg = ''
     }
     if(e !== null) {
        if(e.response.data !== undefined) {
            msg = msg + ' (' + e.response.data.detail + ')'
        }
     }
     Notification.warning({message: msg, duration: 10000})
 }

 function confirm(fnNextRoute) {
    MessageBox.confirm('Do you want to discard the changes', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
        center: false}
    ).then(() => {
        fnNextRoute(true)
    }).catch(() => {
        fnNextRoute(false)
    })
 }

 function loadResTypes(force) {
     if(force || resTypeNames.length == 0) {
        axios.get(RESTYPES_URL).then(resp => {
            var tmp = resp.data
            normalizeKeys(tmp)
            for(var i=0; i< tmp.length; i++) {
                var rt = tmp[i]
                resTypeNames.push(rt.name)
                var resourceType = new ResourceType()
                var name = rt.name.toLowerCase()
                resourceType.name = name
                resTypes[name] = resourceType
                loadSchema(resourceType, rt.schema)
                if(rt.schemaextensions != undefined) {
                    for(var j=0; j< rt.schemaextensions.length; j++) {
                        loadSchema(resourceType, rt.schemaextensions[j].schema)
                    }
                }
            }
            resTypeNames.sort()
        }).catch(e => {
            showErr(e, 'Failed to load resourcetypes')
        })         
    }
}

function getResTypeNames() {
    return resTypeNames
}

function loadSchema(resTypeObj, id) {
    axios.get(SCHEMAS_URL + '/' + id).then(resp => {
        normalizeSchemas(resp.data)
        resTypeObj[id] = resp.data
        resTypeObj.schemas.push(resp.data)
        let attrs = getAttrNamesOfNormalizedSchema(resp.data)
        let rtAtrNamesArr = resTypeObj.attrNames
        rtAtrNamesArr.push.apply(rtAtrNamesArr, attrs)
        rtAtrNamesArr.sort()
    }).catch(e => {
        showErr(e, 'Failed to load schemas')
    })
}

function normalizeSchemas(schemaJson) {
    normalizeKeys(schemaJson)
    var metaAttrNames = ['name', 'type', 'mutability', 'returned', 'uniqueness']
    var metaAttrNameMap = {}
    metaAttrNames.forEach(name => {
        metaAttrNameMap[name] = true
    })
    normalizeValuesOf(metaAttrNameMap, schemaJson)
 }

 function getAttrNamesOfNormalizedSchema(schemaJson) {
    let arr = []
    for(let i=0; i< schemaJson.attributes.length; i++) {
        let atDef = schemaJson.attributes[i]
        let name = atDef.name
        if(atDef.type == 'complex') {
            //console.log(JSON.stringify(atDef))
            for(let j=0; j < atDef.subattributes.length; j++) {
                let subName = atDef.subattributes[j].name
                subName = name + '.' + subName
                arr.push(subName)
            }
        }
        else {
            arr.push(name)
        }
    }
    return arr
 }

 function normalizeValuesOf(attrNameMap, je) {
    if(je instanceof Array) {
        for(var j=0; j<je.length; j++) {
            normalizeValuesOf(attrNameMap, je[j])
        }
    }
    else if (je instanceof Object) {
        for(var k  in je) {
            if(je.hasOwnProperty(k)) {
                var obj = je[k]
                if(obj instanceof Array || obj instanceof Object) {
                    normalizeValuesOf(attrNameMap, obj)
                }
                else if(attrNameMap[k]) {
                    je[k] = obj.toLowerCase()
                }
            }    
        }
    }
 }
 
 function getResType(name) {
    return resTypes[name]
 }

 function ResourceType() {
     return {
         //defaultSchemaId: '',
         schemas: [],
         attrNames: [],
         name: '',
         isComplexMultiValAt: function(atName) {
             var at = this.getAt(atName)
             if(at != null) {
                if(at.type == 'complex' && at.multivalued) {
                    return true
                }
             }
             return false
            },
            
        getAt: function(atName) {
                for(var i=0; i< this.schemas.length; i++) {
                    // TODO no special support for schema extensions
                    // add that when necessary
                    // FIXME loop is inefficient make it a Map
                    var attrs = this.schemas[i].attributes
                    for(var j=0; j< attrs.length; j++) {
                        var at = attrs[j]
                        if(at.name == atName) {
                            return at
                        }
                    }
                }
                return null
            },
        createPathExpr: function(obj) {
            var AND = ' AND '
            var str = ''
            var eqAtName = 'value'
            // special case for Application resourcetype, where the oauth and saml attribute complex-type
            // does not define a 'value' sub-attribute
            if(this.name == 'application') {
                eqAtName = 'name'
            }

            if(obj.hasOwnProperty(eqAtName)) {
                var val = obj[eqAtName]
                if(typeof val == 'string') {
                    // if there are double quotes they must have been escaped before coming here
                    // double escape them
                    val = val.replace(/"/g, '\\"')
                    val = '"' + val + '"'
                    //console.log(val)
                }

                str += eqAtName + ' EQ ' + val
            }
            return str
        }
    }
  }