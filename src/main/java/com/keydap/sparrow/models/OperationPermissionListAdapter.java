/*
 * Copyright (c) 2018 Keydap Software.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * See LICENSE file for details.
 */
package com.keydap.sparrow.models;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.TypeAdapter;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import com.keydap.sparrow.rbac.OperationPermission;

/**
 *
 * @author Kiran Ayyagari (kayyagari@keydap.com)
 */
public class OperationPermissionListAdapter extends TypeAdapter<List<OperationPermission>> {

    private static final Gson gson = new Gson();

    private static final Type lstPermsObj = new TypeToken<List<OperationPermission>>(){}.getType();
    
    @Override
    public void write(JsonWriter out, List<OperationPermission> value) throws IOException {
        out.value(gson.toJson(value));
    }

    @Override
    public List<OperationPermission> read(JsonReader in) throws IOException {
        String opsArr = in.nextString();
        return gson.fromJson(opsArr, lstPermsObj);
    }
}
