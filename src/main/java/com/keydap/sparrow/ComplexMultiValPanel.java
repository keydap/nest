package com.keydap.sparrow;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.wicket.MarkupContainer;
import org.apache.wicket.ajax.AjaxRequestTarget;
import org.apache.wicket.ajax.markup.html.form.AjaxButton;
import org.apache.wicket.markup.ComponentTag;
import org.apache.wicket.markup.IMarkupCacheKeyProvider;
import org.apache.wicket.markup.IMarkupResourceStreamProvider;
import org.apache.wicket.markup.MarkupStream;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.form.Button;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.markup.html.link.Link;
import org.apache.wicket.markup.html.panel.Panel;
import org.apache.wicket.markup.repeater.Item;
import org.apache.wicket.markup.repeater.RefreshingView;
import org.apache.wicket.markup.repeater.RepeatingView;
import org.apache.wicket.model.IModel;
import org.apache.wicket.model.Model;
import org.apache.wicket.model.PropertyModel;
import org.apache.wicket.util.resource.IResourceStream;
import org.apache.wicket.util.resource.StringResourceStream;

public class ComplexMultiValPanel<T> extends Panel implements IMarkupResourceStreamProvider, IMarkupCacheKeyProvider {
    
    private static final String rowTemplateVar = "${rowTemplate}";
    
    private static final String panelTemplate = "<wicket:panel>"
                                            + "<form wicket:id=\"panelForm\">"
                                            + "   <div class=\"panel panel-default\">"
                                            + "       <div class=\"panel-heading\" wicket:id=\"cmplxAttrName\">:</div>"
                                            + "       <table class=\"table-condensed\">"
                                            + "           <thead>"
                                            + "               <th wicket:id=\"th\" />"
                                            + "           </thead>"
                                            + "           <tr wicket:id=\"tr\">" + rowTemplateVar + "</tr>"
                                            + "       </table>"
                                            + "       <button type=\"button\" class=\"btn btn-primary btn-sm\" wicket:id=\"add\">+</button>"
                                            + "   </div>"
                                            + "</form>"
                                            + "</wicket:panel>";
    
    private String markup;
    private List<T> data;
    
    public ComplexMultiValPanel(String id, Class<T> cls, List<T> incoming, Object container) {
        super(id);
        this.data = incoming;
        setMarkup(cls);
        setOutputMarkupId(true);
        
        Form panelForm = new Form<>("panelForm");
        queue(panelForm);

        queue(new Label("cmplxAttrName", cls.getSimpleName()));
        // WARN do not store the value of cls.getDeclaredFields() in a local variable
        // Wicket is failing to serialize it
        RepeatingView th = new RepeatingView("th");
        for(Field f : cls.getDeclaredFields()) {
            String name = f.getName();
            th.add(new Label(th.newChildId(), name));
        }
        
        panelForm.queue(th);
        
        List<IModel<Object>> models = new ArrayList<>();
        if(data != null) {
            for(Object t : data) {
                models.add(new Model((Serializable)t));
            }
        }

        RefreshingView<IModel<Object>> tr = new RefreshingView<IModel<Object>>("tr") {

            @Override
            protected Iterator getItemModels() {
                System.out.println(cls.getSimpleName() + " models ->" + models.size());
                return models.iterator();
            }

            @Override
            protected void populateItem(Item<IModel<Object>> item) {
                item.setOutputMarkupId(true);
                
                IModel m = item.getModel();
                for(Field f : cls.getDeclaredFields()) {
                    String name = f.getName();
                    item.add(new TextField<>(name, new PropertyModel<>(m, name)));
                }
                
                AjaxButton rowDelete = new AjaxButton("rowDelete", panelForm) {
                    
                    @Override
                    protected void onSubmit(AjaxRequestTarget target) {
                        data.remove(m.getObject());
                        models.remove(m);
                        target.add(panelForm);
                    }
                };
                
                item.add(rowDelete);
            }
            
        };
        
        panelForm.queue(tr);
        
        AjaxButton btnAdd = new AjaxButton("add", panelForm){

            @Override
            protected void onSubmit(AjaxRequestTarget target) {
                System.out.println("target =>" + target);
                try {
                    
                    T o = cls.newInstance();
                    models.add(new Model((Serializable)o));
                    Field f = container.getClass().getDeclaredField(id);
                    f.setAccessible(true);

                    if(data == null) {
                        data = new ArrayList<>();
                        data.add(o);
                        f.set(container, data);
                    }
                    else {
                        // TODO data.add() should just work here
                        ((List) f.get(container)).add(o);
                    }

                    MarkupContainer mc = this.getParent();
                    target.add(mc);
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
        
        panelForm.queue(btnAdd);
    }

    @Override
    public IResourceStream getMarkupResourceStream(MarkupContainer container, Class<?> containerClass) {
        return new StringResourceStream(markup);
    }
    
    private void setMarkup(Class<T> cls) {
        StringBuilder sb = new StringBuilder();
        for(Field f : cls.getDeclaredFields()) {
            String name = f.getName();
            sb.append("<td><input wicket:id=\"");
            sb.append(name);
            sb.append("\"/></td>");
        }
        sb.append("<td><button wicket:id=\"rowDelete\" class=\"btn btn-xs btn-danger\">Delete</button></td>");
        markup = panelTemplate.replace(rowTemplateVar, sb.toString());
        //markup = markup.replace("${panelForm}", getId() + "Form");
    }

    /*
     * NOTE; it is important to NOT cache the markup cause it is entirely dynamic
     */
    @Override
    public String getCacheKey(MarkupContainer container,
            Class<?> containerClass) {
        return null;
    }
}
