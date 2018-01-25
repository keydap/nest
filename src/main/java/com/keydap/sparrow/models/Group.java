/*
 * Copyright (c) 2018 Keydap Software.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * See LICENSE file for details.
 */
package com.keydap.sparrow.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.google.gson.annotations.JsonAdapter;
import com.keydap.sparrow.ComplexType;
import com.keydap.sparrow.ReadOnly;
import com.keydap.sparrow.Resource;
import com.keydap.sparrow.rbac.OperationPermission;

/**
*
* @author Kiran Ayyagari (kayyagari@keydap.com)
*/
@Resource(schemaId = "urn:ietf:params:scim:schemas:core:2.0:Group", endpoint = "/Groups", desc = "Group")
public class Group implements Serializable {
    @ReadOnly
    private String id;
    private String externalId;
    @ReadOnly
    private Meta meta;
    private String displayName;
    private List<Member> members;
    private List<Permission> permissions;

    // a readonly field that gets populated only while reading resources
    @ReadOnly
    private String[] schemas;

    public static String SCHEMA = "urn:ietf:params:scim:schemas:core:2.0:Group";

    public Group() {
    }

    public String getId() {
        return id;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getExternalId() {
        return externalId;
    }

    public Meta getMeta() {
        return meta;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setMembers(List<Member> members) {
        this.members = members;
    }

    public List<Member> getMembers() {
        return members;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }

    public List<Permission> getPermissions() {
        return permissions;
    }

    public String[] getSchemas() {
        return schemas;
    }

    @ComplexType
    public static class Meta implements Serializable {
        @ReadOnly
        private String resourceType;
        @ReadOnly
        private Date created;
        @ReadOnly
        private Date lastModified;
        @ReadOnly
        private String location;
        @ReadOnly
        private String version;

        public Meta() {
        }

        public String getResourceType() {
            return resourceType;
        }

        public Date getCreated() {
            return created;
        }

        public Date getLastModified() {
            return lastModified;
        }

        public String getLocation() {
            return location;
        }

        public String getVersion() {
            return version;
        }
    }

    @ComplexType(multival = true)
    public static class Member implements Serializable {
        private String value;
        private String $ref;
        private String type;

        public Member() {
        }

        public void setValue(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public void set$ref(String $ref) {
            this.$ref = $ref;
        }

        public String get$ref() {
            return $ref;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getType() {
            return type;
        }
    }

    @ComplexType(multival = true)
    public static class Permission implements Serializable {
        private String resName;
        @JsonAdapter(OperationPermissionListAdapter.class)
        private List<OperationPermission> opsArr;

        public Permission() {
        }

        public void setResName(String resName) {
            this.resName = resName;
        }

        public String getResName() {
            return resName;
        }

        public List<OperationPermission> getOpsArr() {
            return opsArr;
        }

        public void setOpsArr(List<OperationPermission> ops) {
            this.opsArr = ops;
        }
        
        public OperationPermission getPermission(String opName) {
            if(opsArr != null) {
                for(OperationPermission op : opsArr) {
                    if(op.getOp().equalsIgnoreCase(opName)) {
                        return op;
                    }
                }
            }
            
            OperationPermission op = new OperationPermission();
            op.setOp(opName);
            add(op);
            return op;
        }

        public void add(OperationPermission op) {
            if(opsArr == null) {
                opsArr = new ArrayList<>();
            }
            opsArr.add(op);
        }
    }
}