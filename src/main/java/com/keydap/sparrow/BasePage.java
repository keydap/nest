package com.keydap.sparrow;

import org.apache.wicket.Component;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.request.mapper.parameter.PageParameters;

public abstract class BasePage extends WebPage {
    private static final long serialVersionUID = 1L;

    public static final String CONTENT_ID = "contentComponent";
    
    private Component headerPanel;
    private Component footerPanel;

    public BasePage() {
        this(null);
    }
    
    public BasePage(PageParameters pp) {
        super(pp);
        
        headerPanel = new HeaderPanel("headerPanel");
        //menuPanel = new MenuPanel("menuPanel");
        footerPanel = new FooterPanel("footerPanel");
        add(headerPanel);
        add(footerPanel);
    }
}
