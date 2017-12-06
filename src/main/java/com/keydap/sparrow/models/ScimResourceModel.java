/*
 * Copyright (c) 2017 Keydap Software.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * See LICENSE file for details.
 */
package com.keydap.sparrow.models;

import org.apache.wicket.model.CompoundPropertyModel;

import com.google.gson.Gson;
import com.keydap.sparrow.Response;

/**
 *
 * @author Kiran Ayyagari (kayyagari@keydap.com)
 */
@SuppressWarnings("unchecked")
public class ScimResourceModel<T> extends CompoundPropertyModel<T> {
    private static final Gson serializer = new Gson();
    
    private T original;
    
    private String etag;
    
    public ScimResourceModel(Response<T> resp) {
        super(resp.getResource());
        original = (T) serializer.fromJson(resp.getHttpBody(), resp.getResource().getClass());
        etag = resp.getETag();
    }

    public T getOriginal() {
        return original;
    }

    public String getEtag() {
        return etag;
    }
}
