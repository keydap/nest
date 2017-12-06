package com.keydap.sparrow;

import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.panel.Panel;

public class MetaPanel extends Panel {
    public MetaPanel(String id) {
        super(id);
        queue(new Label("meta.resourceType"));
        queue(new Label("meta.created"));
        queue(new Label("meta.lastModified"));
        queue(new Label("meta.location"));
        queue(new Label("meta.version"));
    }
}
