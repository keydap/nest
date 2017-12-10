package com.keydap.sparrow;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.wicket.markup.html.WebMarkupContainer;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.link.BookmarkablePageLink;
import org.apache.wicket.markup.html.panel.FeedbackPanel;
import org.apache.wicket.markup.html.panel.Panel;
import org.apache.wicket.markup.repeater.RepeatingView;
import org.apache.wicket.model.Model;

public class HeaderPanel extends Panel {
    
    private static final Map<String, Class> pageLinks = new LinkedHashMap<>();
    
    static {
        pageLinks.put("Users", UserListPage.class);
        pageLinks.put("Groups", GroupListPage.class);
    }
    
    public HeaderPanel(String id) {
        super(id);
        
        RepeatingView rv = new RepeatingView("navItem");
        
        for(Entry<String, Class> e : pageLinks.entrySet()) {
            WebMarkupContainer wmc = new WebMarkupContainer(rv.newChildId());
            BookmarkablePageLink lnk = new BookmarkablePageLink<>("navLink", e.getValue());
            lnk.add(new Label("navText", Model.of(e.getKey())));
            wmc.add(lnk);
            rv.add(wmc);
        }
        
        queue(rv);
        queue(new FeedbackPanel("feedback"));
    }
}
