/*
 * Copyright (c) 2018 Keydap Software.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * See LICENSE file for details.
 */
package com.keydap.sparrow;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.wicket.MarkupContainer;
import org.apache.wicket.ajax.AjaxRequestTarget;
import org.apache.wicket.ajax.markup.html.AjaxLink;
import org.apache.wicket.ajax.markup.html.form.AjaxButton;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.markup.html.list.ListItem;
import org.apache.wicket.markup.html.list.ListView;
import org.apache.wicket.markup.html.panel.Panel;
import org.apache.wicket.markup.repeater.Item;
import org.apache.wicket.markup.repeater.RefreshingView;
import org.apache.wicket.model.IModel;
import org.apache.wicket.model.Model;
import org.apache.wicket.model.PropertyModel;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.keydap.sparrow.models.Group;
import com.keydap.sparrow.models.Group.Permission;
import com.keydap.sparrow.rbac.OperationPermission;
import com.keydap.sparrow.rbac.ResourcePermission;

/**
 *
 * @author Kiran Ayyagari (kayyagari@keydap.com)
 */
public class PermissionsPanel extends Panel {
    private static final Type lstOpPermsObj = new TypeToken<List<OperationPermission>>(){}.getType();
    private static final Gson gson = new Gson();
    
    public PermissionsPanel(String id, Group group) {
        super(id);
        setOutputMarkupId(true);
        
        Form permsForm = new Form<>("permsForm");
        queue(permsForm);
        
        Form opsPermsForm = new Form<>("opsPermsForm");
        permsForm.queue(opsPermsForm);

        if(group.getPermissions() == null) {
            group.setPermissions(new ArrayList<>());
        }
        
        List<Permission> permissions = group.getPermissions();
        List<IModel<Permission>> permModels = new ArrayList<>();
        for(Permission rp : permissions) {
            OperationPermission readOp = rp.getPermission("read");
            if(readOp == null) {
                readOp = new OperationPermission();
                rp.add(readOp);
            }
            
            
            OperationPermission writeOp = rp.getPermission("write");
            if(writeOp == null) {
                writeOp = new OperationPermission();
                rp.add(writeOp);
            }
            
            permModels.add(Model.of(rp));
        }

        AjaxButton btnAdd = new AjaxButton("add", permsForm){

            @Override
            protected void onSubmit(AjaxRequestTarget target) {
                System.out.println("target =>" + target);
                try {
                    Permission p = new Permission();
                    permissions.add(p);
                    permModels.add(Model.of(p));
                    target.add(permsForm);
                }
                catch(Exception e) {
                    throw new RuntimeException(e);
                }
            }

            @Override
            protected void onError(AjaxRequestTarget target) {
                System.out.println("on error =>" + target);
            }
            
        };
        
        permsForm.queue(btnAdd);        
        OperationPermissionPanel readOpPanel = new OperationPermissionPanel("readOpPanel", new OperationPermission());
        readOpPanel.setVisible(false);
        opsPermsForm.queue(readOpPanel);
        OperationPermissionPanel writeOpPanel = new OperationPermissionPanel("writeOpPanel", new OperationPermission());
        writeOpPanel.setVisible(false);
        opsPermsForm.queue(writeOpPanel);
        
        RefreshingView<IModel<Permission>> lstResources = new RefreshingView<IModel<Permission>>("lstResources") {

            @Override
            protected Iterator getItemModels() {
                return permModels.iterator();
            }

            @Override
            protected void populateItem(Item<IModel<Permission>> item) {
                TextField resName = new TextField<>("resName", new PropertyModel<>(item.getModel(), "resName"));
                AjaxLink<Void> resLink = new AjaxLink<Void>("resLink") {
                    
                    @Override
                    public void onClick(AjaxRequestTarget target) {
                        Permission rp = (Permission) item.getModelObject();
                        OperationPermissionPanel readOpPanel = new OperationPermissionPanel("readOpPanel", rp.getPermission("read"));
                        readOpPanel.setVisible(true);
                        opsPermsForm.addOrReplace(readOpPanel);
                        OperationPermissionPanel writeOpPanel = new OperationPermissionPanel("writeOpPanel", rp.getPermission("write"));
                        writeOpPanel.setVisible(true);
                        opsPermsForm.addOrReplace(writeOpPanel);
                        target.add(opsPermsForm);
                    }
                };
                
                resLink.queue(resName);
                item.queue(resLink);
            }
            
        };

        lstResources.setOutputMarkupId(true);
        permsForm.queue(lstResources);
        
    }
    
    private void parsePerms(Group group) {
        List<Permission> permissions = group.getPermissions();
        if(permissions == null) {
            group.setPermissions(new ArrayList<>());
            return;
        }
        
        for(Permission p : permissions) {
            String name = p.getResName();
            ResourcePermission rp = new ResourcePermission(name);
//            String json = p.getOpsArr();
//            
//            List<OperationPermission> opsPerms = gson.fromJson(json, lstOpPermsObj);
//            p.setOps(opsPerms);
        }
    }
}
