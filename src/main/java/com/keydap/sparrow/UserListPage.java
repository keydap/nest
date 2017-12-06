package com.keydap.sparrow;

import java.util.List;

import org.apache.wicket.ajax.AjaxEventBehavior;
import org.apache.wicket.ajax.AjaxRequestTarget;
import org.apache.wicket.ajax.attributes.AjaxRequestAttributes;
import org.apache.wicket.ajax.attributes.AjaxRequestAttributes.EventPropagation;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.form.CheckBox;
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
    }

    @Override
    protected void onInitialize() {
        super.onInitialize();
        SparrowClient con = ConnectionUtil.get();
        SearchResponse<User> response = con.searchResource(User.class);
        if(response.getError() == null) {
            List<User> users = response.getResources();
            add(new ListView<User>("users", Model.ofList(users)) {
                @Override
                protected void populateItem(ListItem<User> item) {
                    System.out.println("*************** " + item.getModel());
                    
                    item.add(new Link<Void>("rowLink") {
                        @Override
                        public void onClick() {
                            PageParameters pp = new PageParameters();
                            pp.add("id", item.getModelObject().getId());
                            setResponsePage(UserDetailsPage.class, pp);
                        }
                    });
                    
                           item.queue(new Label("userName", new PropertyModel(item.getModel(), "userName")));   
                           item.queue(new Label("displayName", new PropertyModel(item.getModel(), "displayName")));   
                           item.queue(new Label("active", new PropertyModel(item.getModel(), "active")));
                           
                           
                           CheckBox cb = new CheckBox("chkUser");
                           cb.add(new AjaxEventBehavior("click") {
                               
                               @Override
                               protected void onEvent(AjaxRequestTarget target) {
                                   System.out.println("cb target => " + target);
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
            });

        }
    }
    
}
