function shortCode(){
  that = this;
  this.escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  this.replaceTextNode = function(node,elm1,elm2,elm3){
  }

  this.preloadShortcode = function(code,element){
    var replacement_html = '<div class="shortcode-placeholder" data-shortcode="'+code+'" style="display: inline-block;"> ... </div>';
    if(!element) element=document.body;
    var nodes=element.childNodes;
    for(var n=0;n<nodes.length;n++){
      if(nodes[n].nodeType==Node.TEXT_NODE){
        if(nodes[n].textContent.match(new RegExp(that.escapeRegExp(code),'gi'))){
          var newtextContent=nodes[n].textContent.replace(new RegExp(that.escapeRegExp(code),'gi'), replacement_html);
          $(nodes[n]).before(newtextContent).remove();
        }
      }else{
        if(nodes[n].nodeName.toUpperCase()!='SCRIPT'){
          that.preloadShortcode(code, nodes[n]);
        }
      }
    }
  }

  this.replaceShortcode = function(code,replacement_html,element){
    if(!element) element=document.body;
    $placeholders = $('.shortcode-placeholder[data-shortcode="'+code+'"]');
    $placeholders.replaceWith(replacement_html);
  }

  this.findShortcodes = function(element){
    if(!element) element=document.body;
    return document.body.innerHTML.match(/\[\{[^\:]{1,255}\}\]/g);
  }

  this.activateShortcodes = function(element, options){
    var shortcodes = that.findShortcodes(element);
    options = options || {};
    console.log(options);
    $(shortcodes).each(function(i){
      var shortcode = this;
      that.preloadShortcode(shortcode);
      $.ajax('/shortcode/view', {
                   success: function(data){that.installWidget(shortcode, data, options);},
                   error:   function(data){that.showError(shortcode, data);},
                   method: 'post',
                   data: {'code': this}
            });
    });
  }

  this.installWidget = function(shortcode, data, options){
    that.replaceShortcode(shortcode, data);
    if(options && options.callback) { console.log(options); options.callback(data); }
  }

  this.showError = function(shortcode, request){
    that.replaceShortcode(shortcode, '<span class="shortcode-error">'+request.statusText+'</span>');
  }
}


$(function(){
  var shortcode = new shortCode();
  shortcode.activateShortcodes();
});

