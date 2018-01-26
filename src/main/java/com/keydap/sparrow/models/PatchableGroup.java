package com.keydap.sparrow.models;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.keydap.sparrow.ComplexType;
import com.keydap.sparrow.ReadOnly;
import com.keydap.sparrow.Resource;

/*
 * Generated on Fri Jan 19 19:24:15 IST 2018 using Keydap Sparrow's json2java plugin 
 */

@Resource(schemaId="urn:ietf:params:scim:schemas:core:2.0:Group", endpoint="/Groups", desc="Group")
public  class PatchableGroup implements Serializable
{
      @ReadOnly
      private String id;
      private String externalId;
      @ReadOnly
      private Meta meta;
      private String displayName;
      private List<Member> members;
      private List<Permission> permissions;
   
   // a readonly field that gets populated only while reading resources
   @ReadOnly
   private String[] schemas;
   
    public static String SCHEMA = "urn:ietf:params:scim:schemas:core:2.0:Group";
    
    public PatchableGroup()
    {
    }
   
      
       public String getId()
       {
          return id;
       }
       
       
       public void setExternalId( String externalId )
       {      
          this.externalId = externalId;
       }
      
       public String getExternalId()
       {
          return externalId;
       }
       
         
       public Meta getMeta()
       {
          return meta;
       }
       
       
       public void setDisplayName( String displayName )
       {      
          this.displayName = displayName;
       }
      
       public String getDisplayName()
       {
          return displayName;
       }
       
       
       public void setMembers( List<Member> members )
       {      
          this.members = members;
       }
      
       public List<Member> getMembers()
       {
          return members;
       }
       
       
       public void setPermissions( List<Permission> permissions )
       {      
          this.permissions = permissions;
       }
      
       public List<Permission> getPermissions()
       {
          return permissions;
       }
       
      
   
   public String[] getSchemas() {
     return schemas;
   }
   
   @ComplexType

   public static class Meta implements Serializable
   {
         @ReadOnly
         private String resourceType;
         @ReadOnly
         private Date created;
         @ReadOnly
         private Date lastModified;
         @ReadOnly
         private String location;
         @ReadOnly
         private String version;
      
      
       
       public Meta()
       {
       }
      
         
          public String getResourceType()
          {
             return resourceType;
          }
          
            
          public Date getCreated()
          {
             return created;
          }
          
            
          public Date getLastModified()
          {
             return lastModified;
          }
          
            
          public String getLocation()
          {
             return location;
          }
          
            
          public String getVersion()
          {
             return version;
          }
          
         
      
      
   } 
   @ComplexType(multival=true)

   public static class Member implements Serializable
   {
         private String value;
         private String $ref;
         private String type;
      
      
       
       public Member()
       {
       }
      
       
          public void setValue( String value )
          {      
             this.value = value;
          }
         
          public String getValue()
          {
             return value;
          }
          
          
          public void set$ref( String $ref )
          {      
             this.$ref = $ref;
          }
         
          public String get$ref()
          {
             return $ref;
          }
          
          
          public void setType( String type )
          {      
             this.type = type;
          }
         
          public String getType()
          {
             return type;
          }
          
         
      
      
   } 
   @ComplexType(multival=true)

   public static class Permission implements Serializable
   {
         private String resName;
         private String opsArr;
      
      
       
       public Permission()
       {
       }
      
       
          public void setResName( String resName )
          {      
             this.resName = resName;
          }
         
          public String getResName()
          {
             return resName;
          }
          
          
          public void setOpsArr( String opsArr )
          {      
             this.opsArr = opsArr;
          }
         
          public String getOpsArr()
          {
             return opsArr;
          }
          
         
      
      
   } 
}