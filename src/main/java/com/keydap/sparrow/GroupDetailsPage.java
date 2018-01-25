/*
 * Copyright (c) 2017 Keydap Software.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * See LICENSE file for details.
 */
package com.keydap.sparrow;

import org.apache.wicket.markup.html.form.Button;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.apache.wicket.util.string.StringValue;

import com.google.gson.Gson;
import com.keydap.sparrow.models.Group;
import com.keydap.sparrow.models.ScimResourceModel;
import com.keydap.sparrow.models.User;
import com.keydap.sparrow.util.ConnectionUtil;

/**
 *
 * @author Kiran Ayyagari (kayyagari@keydap.com)
 */
public class GroupDetailsPage extends BasePage {
    private ScimResourceModel<Group> srm = null;
    
    private static final Gson gson = new Gson();
    
    public GroupDetailsPage(PageParameters pp) {
        super(pp);
        setOutputMarkupId(true);
    }

    @Override
    protected void onInitialize() {
        super.onInitialize();
        StringValue id = getPageParameters().get("id");
        System.out.println("pp=>" + id);
        
        if(!id.isEmpty()) {
            Response<Group> response = ConnectionUtil.get().getResource(id.toString(), Group.class);
            if(response.getError() == null) {
                srm = new ScimResourceModel<>(response);
            }
        }
        else {
            srm = new ScimResourceModel<>(new Group());
        }
        
        Group group = srm.getObject(); // should be the model object NOT the original
        
        setDefaultModel(srm);
        Form form = new Form("form"){
            
            @Override
            protected void onValidate() {
                super.onValidate();
            }
            
            @Override
            protected void onError() {
                System.out.println("error feedback => " + super.hasError() + ", " + super.getFeedbackMessages());
            }
            
            @Override
            protected void onSubmit() {
                if(!id.isEmpty()) { // PATCH
                    Group original = srm.getOriginal();
                    //serializePermissions(group);
                    PatchGenerator pg = new PatchGenerator();
                    PatchRequest pr = pg.create(group.getId(), group, original, srm.getEtag());
                    System.out.println(pr);
                    Response<User> prResp = ConnectionUtil.get().patchResource(pr);
                    System.out.println("response of patch operation -> " + prResp.getHttpCode());
                }
                else {
                    System.out.println(ConnectionUtil.get().serialize(group));
                    Response<Group> prResp = ConnectionUtil.get().addResource(group);
                    System.out.println("response of add operation -> " + prResp.getHttpCode());
                }
            }
        };
        queue(form);
        queue(new TextField<>("id"));
        queue(new TextField<>("displayName"));
        queue(new Button("save"));
        queue(new MetaPanel("meta"));
        
        queue(new PermissionsPanel("permissions", group));
    }
}
