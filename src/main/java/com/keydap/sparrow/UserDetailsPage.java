/*
 * Copyright (c) 2017 Keydap Software.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * See LICENSE file for details.
 */
package com.keydap.sparrow;

import org.apache.wicket.markup.html.form.Button;
import org.apache.wicket.markup.html.form.CheckBox;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.PasswordTextField;
import org.apache.wicket.markup.html.form.TextArea;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.model.CompoundPropertyModel;
import org.apache.wicket.model.Model;
import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.apache.wicket.util.string.StringValue;

import com.keydap.sparrow.models.ScimResourceModel;
import com.keydap.sparrow.models.User;
import com.keydap.sparrow.models.User.Address;
import com.keydap.sparrow.models.User.Email;
import com.keydap.sparrow.models.User.Entitlement;
import com.keydap.sparrow.models.User.Group;
import com.keydap.sparrow.models.User.Im;
import com.keydap.sparrow.models.User.PhoneNumber;
import com.keydap.sparrow.models.User.Photo;
import com.keydap.sparrow.models.User.Role;
import com.keydap.sparrow.models.User.X509Certificate;
import com.keydap.sparrow.util.ConnectionUtil;

/**
 * @author Kiran Ayyagari (kayyagari@keydap.com)
 */
public class UserDetailsPage extends BasePage {
    public UserDetailsPage(PageParameters pp) {
        super(pp);
        setOutputMarkupId(true);
    }

    @Override
    protected void onInitialize() {
        super.onInitialize();
        StringValue id = getPageParameters().get("id");
        System.out.println("pp=>" + id);
        if(id != null) {
            Response<User> response = ConnectionUtil.get().getResource(id.toString(), User.class);
            if(response.getError() == null) {
                User user = response.getResource();
                ScimResourceModel<User> srm = new ScimResourceModel<>(response);
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
                        User original = srm.getOriginal();
                        PatchGenerator pg = new PatchGenerator();
                        PatchRequest pr = pg.create(user.getId(), user, original, srm.getEtag());
                        System.out.println(pr);
                        Response<User> prResp = ConnectionUtil.get().patchResource(pr);
                        System.out.println("response of patch operation -> " + prResp.getHttpCode());
                    }
                };
                queue(form);
                queue(new TextField<>("userName"));
                queue(new TextField<>("id"));
                queue(new TextField<>("externalId"));
                queue(new TextField<>("displayName"));
                
                queue(new TextField<>("name.formatted"));
                queue(new TextField<>("name.familyName"));
                queue(new TextField<>("name.givenName"));
                queue(new TextField<>("name.middleName"));
                queue(new TextField<>("name.honorificPrefix"));
                queue(new TextField<>("name.honorificSuffix"));
                
                queue(new TextField<>("nickName"));
                queue(new TextField<>("profileUrl"));
                queue(new TextField<>("title"));
                queue(new TextField<>("userType"));
                queue(new TextField<>("preferredLanguage"));
                queue(new TextField<>("locale"));
                queue(new TextField<>("timezone"));
                queue(new CheckBox("active"));
                
                //PasswordTextField ptf = new PasswordTextField("password");
                //ptf.setVisible(false); // FIXME this will leave the label still visible
                //queue(ptf);
                
                queue(new ComplexMultiValPanel<>("addresses", Address.class, user.getAddresses(), user));
                queue(new ComplexMultiValPanel<>("emails", Email.class, user.getEmails(), user));
                queue(new ComplexMultiValPanel<>("phoneNumbers", PhoneNumber.class, user.getPhoneNumbers(), user));
                queue(new ComplexMultiValPanel<>("ims", Im.class, user.getIms(), user));
                queue(new ComplexMultiValPanel<>("photos", Photo.class, user.getPhotos(), user));
                queue(new ComplexMultiValPanel<>("groups", Group.class, user.getGroups(), user));
                queue(new ComplexMultiValPanel<>("entitlements", Entitlement.class, user.getEntitlements(), user));
                queue(new ComplexMultiValPanel<>("roles", Role.class, user.getRoles(), user));
                queue(new ComplexMultiValPanel<>("x509Certificates", X509Certificate.class, user.getX509Certificates(), user));
                
                queue(new Button("save"));
                
                queue(new MetaPanel("meta"));
            }
        }
    }
    
    
}
