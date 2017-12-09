package com.keydap.sparrow;

import java.util.ArrayList;
import java.util.List;

import org.apache.wicket.ajax.AjaxEventBehavior;
import org.apache.wicket.ajax.AjaxRequestTarget;
import org.apache.wicket.ajax.attributes.AjaxRequestAttributes;
import org.apache.wicket.ajax.attributes.AjaxRequestAttributes.EventPropagation;
import org.apache.wicket.ajax.markup.html.form.AjaxSubmitLink;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.form.Check;
import org.apache.wicket.markup.html.form.CheckGroup;
import org.apache.wicket.markup.html.form.CheckGroupSelector;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.link.Link;
import org.apache.wicket.markup.html.list.ListItem;
import org.apache.wicket.markup.html.list.ListView;
import org.apache.wicket.model.Model;
import org.apache.wicket.model.PropertyModel;
import org.apache.wicket.request.mapper.parameter.PageParameters;

import com.keydap.sparrow.models.User;
import com.keydap.sparrow.util.ConnectionUtil;

public class UserListPage extends BasePage {
    
    public UserListPage() {
        setStatelessHint(true);
        setOutputMarkupId(true);
    }

    @Override
    protected void onInitialize() {
        super.onInitialize();
        SparrowClient con = ConnectionUtil.get();
        SearchResponse<User> response = con.searchResource(User.class);
        if(response.getError() == null) {
            final CheckGroup<User> group = new CheckGroup<>("resourceIds", new ArrayList<User>());
            CheckGroupSelector cgs = new CheckGroupSelector("idSelector");
            group.queue(cgs);
            
            Form<Void> form = new Form<>("form");
            form.setOutputMarkupId(true);
            form.queue(group);
            queue(form);
            
            List<User> users = response.getResources();
            ListView<User> lv = new ListView<User>("users", Model.ofList(users)) {
                @Override
                protected void populateItem(ListItem<User> item) {
                    item.add(new AjaxEventBehavior("click"){
                        @Override
                        public void onEvent(AjaxRequestTarget target) {
                            PageParameters pp = new PageParameters();
                            pp.add("id", item.getModelObject().getId());
                            setResponsePage(UserDetailsPage.class, pp);
                        }
                    });
                    
                           item.queue(new Label("userName", new PropertyModel(item.getModel(), "userName")));   
                           item.queue(new Label("displayName", new PropertyModel(item.getModel(), "displayName")));   
                           item.queue(new Label("active", new PropertyModel(item.getModel(), "active")));
                           
                           
                           Check cb = new Check("chkUser", item.getModel());
                           cb.add(new AjaxEventBehavior("click") {
                               
                               @Override
                               protected void onEvent(AjaxRequestTarget target) {
                               }

                            @Override
                            protected void updateAjaxAttributes(
                                    AjaxRequestAttributes attributes) {
                                attributes.setEventPropagation(EventPropagation.STOP_IMMEDIATE);
                                super.updateAjaxAttributes(attributes);
                            }
                               
                               
                           });
                           item.queue(cb);
                           
                }
            };
            
            lv.setOutputMarkupId(true);
            lv.setReuseItems(true);
            group.queue(lv);
            
            form.queue(new Link<Void>("newUser"){
                @Override
                public void onClick() {
                    setResponsePage(UserDetailsPage.class);
                }
            });
            
            form.queue(new AjaxSubmitLink("deleteUser", form){

                @Override
                protected void onSubmit(AjaxRequestTarget target) {
                    List<User> lst = (List<User>)group.getDefaultModelObject();
                    for(User u : lst) {
                        ConnectionUtil.get().deleteResource(u.getId(), u.getClass());
                    }
                    
                    setResponsePage(UserListPage.class);
                }
                
            });
        }
    }
    
}
