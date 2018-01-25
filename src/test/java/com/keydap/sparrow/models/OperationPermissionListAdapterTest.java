/*
 * Copyright (c) 2018 Keydap Software.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * See LICENSE file for details.
 */
package com.keydap.sparrow.models;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.junit.Test;
import static org.junit.Assert.*;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.keydap.sparrow.models.Group.Permission;
import com.keydap.sparrow.rbac.OperationPermission;

/**
 *
 * @author Kiran Ayyagari (kayyagari@keydap.com)
 */
public class OperationPermissionListAdapterTest {
    @Test
    public void testSerialization() {
        Group group = new Group();
        List<Permission> permissions = new ArrayList<>();
        Permission p = new Permission();
        p.setResName("User");
        p.add(OperationPermission.withAllowAttributes("read", "name", "id pr"));
        p.add(OperationPermission.withAllowAttributes("write", "name", "id pr"));
        permissions.add(p);
        group.setPermissions(permissions);
        
        Gson gson = new GsonBuilder().create();
        String json = gson.toJson(group);
        System.out.println(json);
        Group read = gson.fromJson(json, Group.class);
        System.out.println(gson.toJson(read));
        assertTrue(EqualsBuilder.reflectionEquals(group.getPermissions(), read.getPermissions(), false));
        
        // test null
        group = new Group();
        json = gson.toJson(group);
        read = gson.fromJson(json, Group.class);
        assertEquals(group.getPermissions(), read.getPermissions());
    }
}
