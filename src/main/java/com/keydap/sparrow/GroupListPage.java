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

import com.keydap.sparrow.models.Group;
import com.keydap.sparrow.util.ConnectionUtil;

public class GroupListPage extends BasePage {
    
    public GroupListPage() {
        setStatelessHint(true);
        setOutputMarkupId(true);
    }

    @Override
    protected void onInitialize() {
        super.onInitialize();
        SparrowClient con = ConnectionUtil.get();
        SearchResponse<Group> response = con.searchResource(Group.class);
        if(response.getError() == null) {
            final CheckGroup<Group> group = new CheckGroup<>("resourceIds", new ArrayList<Group>());
            CheckGroupSelector cgs = new CheckGroupSelector("idSelector");
            group.queue(cgs);
            
            Form<Void> form = new Form<>("form");
            form.setOutputMarkupId(true);
            form.queue(group);
            queue(form);
            
            List<Group> groups = response.getResources();
            ListView<Group> lv = new ListView<Group>("groups", Model.ofList(groups)) {
                @Override
                protected void populateItem(ListItem<Group> item) {
                    item.add(new AjaxEventBehavior("click"){
                        @Override
                        public void onEvent(AjaxRequestTarget target) {
                            PageParameters pp = new PageParameters();
                            pp.add("id", item.getModelObject().getId());
                            setResponsePage(GroupDetailsPage.class, pp);
                        }
                    });
                    
                           item.queue(new Label("displayName", new PropertyModel(item.getModel(), "displayName")));   
                           
                           
                           Check cb = new Check("chkGroup", item.getModel());
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
            
            form.queue(new Link<Void>("newGroup"){
                @Override
                public void onClick() {
                    //setResponsePage(UserDetailsPage.class);
                }
            });
            
            form.queue(new AjaxSubmitLink("deleteGroup", form){

                @Override
                protected void onSubmit(AjaxRequestTarget target) {
                    List<Group> lst = (List<Group>)group.getDefaultModelObject();
                    for(Group u : lst) {
                        ConnectionUtil.get().deleteResource(u.getId(), u.getClass());
                    }
                    
                    setResponsePage(UserListPage.class);
                }
                
            });
        }
    }
    
}
