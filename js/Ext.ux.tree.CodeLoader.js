/*global Ext document */
 /*  
  * Author: Sierk Hoeksma. WebBlocks.eu
  * Copyright 2007-2008, WebBlocks.  All rights reserved.
  *
  ************************************************************************************
  *   This file is distributed on an AS IS BASIS WITHOUT ANY WARRANTY;
  *   without even the implied warranty of MERCHANTABILITY or
  *   FITNESS FOR A PARTICULAR PURPOSE.
  ************************************************************************************

  License: This source is licensed under the terms of the Open Source LGPL 3.0 license.
  Commercial use is permitted to the extent that the code/component(s) do NOT become
  part of another Open Source or Commercially licensed development library or toolkit
  without explicit permission.Full text: http://www.opensource.org/licenses/lgpl-3.0.html

  * Donations are welcomed: http://donate.webblocks.eu
  */

//Register name spaces used
Ext.namespace('Ext.ux.tree');

/**
 * Extend Ext.tree.TreeLoader to enable loading of the designer Components
 * The name of the element is created based on components data
 */
Ext.ux.tree.CodeLoader = function(designer,config) {
   Ext.apply(this, config);
   this.designer = designer;
   Ext.tree.TreeLoader.superclass.constructor.call(this);
};

Ext.extend(Ext.ux.tree.CodeLoader, Ext.util.Observable, {
 // @private jsonId is the id used to store the original code
 jsonId : '__JSON__',
  
  /**
   * Convert an element into a self explaining name
   * @param c {component} The component for which to create a name
   */
  elementToText : function(c) {
      var txt = [];
      c = c || {};
      if (c.xtype)      { txt.push(c.xtype); }
      if (c.fieldLabel) { txt.push('[' + c.fieldLabel + ']'); }
      if (c.boxLabel)   { txt.push('[' + c.boxLabel + ']'); }
      if (c.layout)     { txt.push('<i>' + c.layout + '</i>'); }
      if (c.title)      { txt.push('<b>' + c.title + '</b>'); }
      if (c.text)       { txt.push('<b>' + c.text + '</b>'); }
      if (c.region)     { txt.push('<i>(' + c.region + ')</i>'); }
      return (txt.length == 0 ? "Element" : txt.join(" "));
  },
  
 // @private load is called when content of tree should be reloaded
 load : function(node, callback){ 
     while(node.firstChild) node.removeChild(node.firstChild);
     if(this.doLoad(node,this.designer.getConfig())){
       if(typeof callback == "function") callback();
     }
  },
 
  // @private the interal loop used to go through the data and build a tree
  doLoad : function(node,data){
    if(data){
      node.beginUpdate();
      if (!this.designer.isEmpty(data)) {
        var cs = {
             text: this.elementToText(data),
             cls: data.items ? 'folder' : 'file' , 
             leaf : data.items ? false : true,
             jsonId : data[this.jsonId]
        };
        var cn = node.appendChild(new Ext.tree.TreeNode(cs));
        if (data.items) {
          for(var i = 0, len = data.items.length; i < len; i++){
            this.doLoad(cn,data.items[i]);
          }
        }
      }
      node.endUpdate();
      return true;
    }
    return false;
  }
});
