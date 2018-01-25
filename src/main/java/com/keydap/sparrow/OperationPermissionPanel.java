/*
 * Copyright (c) 2018 Keydap Software.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * See LICENSE file for details.
 */
package com.keydap.sparrow;

import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.markup.html.panel.Panel;
import org.apache.wicket.model.IModel;
import org.apache.wicket.model.Model;
import org.apache.wicket.model.PropertyModel;

import com.keydap.sparrow.rbac.OperationPermission;

/**
 *
 * @author Kiran Ayyagari (kayyagari@keydap.com)
 */
public class OperationPermissionPanel extends Panel {
    private OperationPermission op;
    
    public OperationPermissionPanel(String id, OperationPermission op) {
        super(id);
        setModel(op);
    }
    
    public void setModel(OperationPermission op) {
        this.op = op;
    }

    @Override
    protected void onConfigure() {
        // TODO Auto-generated method stub
        super.onConfigure();
    }

    @Override
    protected void onBeforeRender() {
        super.onBeforeRender();
        IModel<OperationPermission> model = Model.of(op);
        addOrReplace(new TextField<>("allowAttrs", new PropertyModel<>(model, "allowAttrs")));
        addOrReplace(new TextField<>("denyAttrs", new PropertyModel<>(model, "denyAttrs")));
        addOrReplace(new TextField<>("filter", new PropertyModel<>(model, "filter")));
    }
    
    public void markAsActiveTab() {
    }
}
