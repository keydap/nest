/*
 * Copyright (c) 2017 Keydap Software.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * See LICENSE file for details.
 */
package com.keydap.sparrow;

import org.apache.wicket.MarkupContainer;
import org.apache.wicket.markup.IMarkupCacheKeyProvider;
import org.apache.wicket.markup.IMarkupResourceStreamProvider;
import org.apache.wicket.markup.html.panel.Panel;
import org.apache.wicket.util.resource.IResourceStream;

/**
 *
 * @author Kiran Ayyagari (kayyagari@keydap.com)
 */
public class MenuPanel extends Panel implements IMarkupResourceStreamProvider, IMarkupCacheKeyProvider {

    public MenuPanel(String id) {
        super(id);
    }
    
    @Override
    public String getCacheKey(MarkupContainer container,
            Class<?> containerClass) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public IResourceStream getMarkupResourceStream(MarkupContainer container,
            Class<?> containerClass) {
        // TODO Auto-generated method stub
        return null;
    }
}
