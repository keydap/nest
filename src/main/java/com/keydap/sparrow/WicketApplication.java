/*
 * Copyright (c) 2017 Keydap Software.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * See LICENSE file for details.
 */
package com.keydap.sparrow;

import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.protocol.http.WebApplication;

import com.keydap.sparrow.util.ConnectionUtil;

import de.agilecoders.wicket.core.Bootstrap;

/**
 * Application object for your web application.
 * If you want to run this application without deploying, run the Start class.
 * 
 * @see com.keydap.sparrow.Start#main(String[])
 * 
 * @author Kiran Ayyagari (kayyagari@keydap.com)
 */
public class WicketApplication extends WebApplication
{
	/**
	 * @see org.apache.wicket.Application#getHomePage()
	 */
	@Override
	public Class<? extends WebPage> getHomePage()
	{
		return UserListPage.class;
	}

	/**
	 * @see org.apache.wicket.Application#init()
	 */
	@Override
	public void init()
	{
		super.init();
		mountPackage("pages", HomePage.class);

		Bootstrap.install(this);
		
		try {
		    ConnectionUtil.init();
		}
		catch(Exception e) {
		    throw new RuntimeException(e);
		}
		
		/*
		List<IResourceFinder> finders = getResourceSettings().getResourceFinders();
		finders.set(0, new WebApplicationPath(getServletContext(), "html-pages"));
		System.out.println("***************>>>>>>>>>" + finders);
		*/
	}
}
