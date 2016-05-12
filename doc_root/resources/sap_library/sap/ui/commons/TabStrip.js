/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/delegate/ItemNavigation','sap/ui/core/Icon','sap/ui/core/delegate/ScrollEnablement','sap/ui/Device'],function(q,l,C,I,a,S,D){"use strict";var T=C.extend("sap.ui.commons.TabStrip",{metadata:{library:"sap.ui.commons",properties:{height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},selectedIndex:{type:"int",group:"Misc",defaultValue:0},enableTabReordering:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"tabs",aggregations:{tabs:{type:"sap.ui.commons.Tab",multiple:true,singularName:"tab"},_leftArrowControl:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},_rightArrowControl:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},events:{select:{parameters:{index:{type:"int"}}},close:{parameters:{index:{type:"int"}}}}}});T.SCROLL_SIZE=320;T.ANIMATION_DURATION=sap.ui.getCore().getConfiguration().getAnimation()?200:0;T.SCROLL_ANIMATION_DURATION=sap.ui.getCore().getConfiguration().getAnimation()?500:0;T.prototype.init=function(){this._bRtl=sap.ui.getCore().getConfiguration().getRTL();this._iCurrentScrollLeft=0;this._iMaxOffsetLeft=null;this._scrollable=null;this._oScroller=new S(this,this.getId()+"-tablist",{horizontal:!this.getEnableTabReordering(),vertical:false,nonTouchScrolling:true});this.data("sap-ui-fastnavgroup","true",true);};T.prototype.setEnableTabReordering=function(v){this.setProperty("enableTabReordering",v,true);if(this._oScroller){this._oScroller.setHorizontal(!v);}return this;};T.prototype.onBeforeRendering=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}};T.prototype.onAfterRendering=function(){if(this._oScroller){this._oScroller.setIconTabBar(this,q.proxy(this._updateScrollingAppearance,this),null);}this._initItemNavigation();this._updateScrollingAppearance();this._sResizeListenerId=sap.ui.core.ResizeHandler.register(this.getDomRef(),q.proxy(this._updateScrollingAppearance,this));var t=this.getTabs();var s=this.getSelectedIndex();var o=t[s];if(o&&o.$().length>0){if(!this._oScroller._$Container){this._oScroller.onAfterRendering();}this._scrollIntoView(o.$(),T.SCROLL_ANIMATION_DURATION);}for(var i=0;i<t.length;i++){t[i].onAfterRendering();}};T.prototype.createTab=function(t,c){var o=new sap.ui.core.Title({text:t}),b=new sap.ui.commons.Tab();b.setTitle(o);b.addContent(c);this.addTab(b);return b;};T.prototype.selectTabByDomRef=function(d){var i=this.getItemIndex(d);if(i>-1){if((i!=this.getSelectedIndex())&&(this.getTabs()[i].getEnabled())){var o=this.getSelectedIndex();this.setProperty('selectedIndex',i,true);this.rerenderPanel(o,true);this.oItemNavigation.setSelectedIndex(this.oItemNavigation.getFocusedIndex());}}};T.prototype.onsapspace=function(e){var s=e.target;this.selectTabByDomRef(s);};T.prototype.onsapspacemodifiers=T.prototype.onsapspace;T.prototype.onsapenter=T.prototype.onsapspace;T.prototype.onsapentermodifiers=T.prototype.onsapspace;T.prototype.onsapdelete=function(e){var s=e.target;var i=this.getItemIndex(s);if(i>-1&&this.getTabs()[i].getClosable()){this.fireClose({index:i});}};T.prototype.getFocusDomRef=function(){return this.getDomRef().firstChild;};T.prototype.exit=function(){this._iCurrentScrollLeft=null;this._iMaxOffsetLeft=null;this._scrollable=null;if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();delete this.oItemNavigation;}};T.prototype.getItemIndex=function(d){var i;if(!d.id||d.id.search("-close")!=-1){var o=q(d).parentByAttribute("id");i=o.id;}else{i=d.id;}for(var b=0,t=this.getTabs();b<t.length;b++){if(i==t[b].getId()){return b;}}return-1;};T.prototype.removeTab=function(e){var i=e;if(typeof(e)=="string"){e=sap.ui.getCore().byId(e);}if(typeof(e)=="object"){i=this.indexOfTab(e);}var t=this.getTabs()[i];if(t.getVisible()){t.setProperty("visible",false,true);this.hideTab(i);t.setProperty("visible",true,true);}if(this.getSelectedIndex()>i){this.setProperty('selectedIndex',this.getSelectedIndex()-1,true);}return this.removeAggregation("tabs",i,true);};T.prototype.setSelectedIndex=function(s){var o=this.getSelectedIndex();if(s==o){return this;}var t=this.getTabs();var b=t[s];if(b&&b.$().length>0){this._scrollIntoView(b.$(),T.SCROLL_ANIMATION_DURATION);}if(!b&&!this.getDomRef()){this.setProperty('selectedIndex',s,false);}else if(b&&b.getEnabled()&&b.getVisible()){this.setProperty('selectedIndex',s,true);if(this.getDomRef()&&!this.invalidated){this.rerenderPanel(o);if(this.oItemNavigation){var v=0;var c=-1;for(var i=0;i<t.length;i++){b=t[i];if(b.getVisible()===false){continue;}if(i==s){c=v;break;}v++;}this.oItemNavigation.setSelectedIndex(c);}}}else{this._warningInvalidSelectedIndex(s,b);}return this;};T.prototype.closeTab=function(i){var t=this.getTabs()[i];if(!t||!t.getClosable()||!t.getVisible()){return;}t.setProperty("visible",false,true);this.hideTab(i);};T.prototype.hideTab=function(b){var t=this.getTabs()[b];if(!this.getDomRef()){return;}var f=this.oItemNavigation.getFocusedIndex();var v=parseInt(t.$().attr("aria-posinset"),10)-1;var F=sap.ui.getCore().getCurrentFocusedControlId();t.$().remove();if(this.iVisibleTabs==1){this.setProperty('selectedIndex',-1,true);t.$("panel").remove();}else if(b==this.getSelectedIndex()){var n=b+1;while(n<this.getTabs().length&&(!this.getTabs()[n].getEnabled()||!this.getTabs()[n].getVisible())){n++;}if(n==this.getTabs().length){n=b-1;while(n>=0&&(!this.getTabs()[n].getEnabled()||!this.getTabs()[n].getVisible())){n--;}}this.setProperty('selectedIndex',n,true);this.rerenderPanel(b);}else{this.toggleTabClasses(this.getSelectedIndex(),this.getSelectedIndex());}this.iVisibleTabs--;var v=0;var c=[];var s=-1;var d=false;for(var i=0;i<this.getTabs().length;i++){var t=this.getTabs()[i];if(F==t.getId()){d=true;}if(t.getVisible()===false){continue;}if(i==this.getSelectedIndex()){s=v;}v++;t.$().attr("aria-posinset",v).attr("aria-setsize",this.iVisibleTabs);c.push(t.getDomRef());}if(v<=f){f--;}this.oItemNavigation.setItemDomRefs(c);this.oItemNavigation.setSelectedIndex(s);this.oItemNavigation.setFocusedIndex(f);if(d){this.oItemNavigation.focusItem(f);}this._updateScrollingAppearance();};T.prototype.rerenderPanel=function(o,f){var n=this.getSelectedIndex();var O=this.getTabs()[o];var N=this.getTabs()[n].getId();var t=this.getTabs()[n];q.sap.delayedCall(0,this,function(){var $=this.$().find('.sapUiTabPanel');if($.length>0){var r=sap.ui.getCore().createRenderManager();this.getRenderer().renderTabContents(r,t);r.flush($[0]);r.destroy();}$.attr("id",N+"-panel").attr("aria-labelledby",N);O.setProperty("scrollTop",$.scrollTop(),true);O.setProperty("scrollLeft",$.scrollLeft(),true);t.onAfterRendering();if(f){this.fireSelect({index:n});}});this.toggleTabClasses(o,n);};T.prototype.toggleTabClasses=function(o,n){this.getTabs()[o].$().toggleClass("sapUiTabSel sapUiTab").attr("aria-selected",false);var b=o-1;while(b>=0&&!this.getTabs()[b].getVisible()){b--;}if(b>=0){this.getTabs()[b].$().removeClass("sapUiTabBeforeSel");}var A=o+1;while(A<this.getTabs().length&&!this.getTabs()[A].getVisible()){A++;}if(A<this.getTabs().length){this.getTabs()[A].$().removeClass("sapUiTabAfterSel");}this.getTabs()[n].$().toggleClass("sapUiTabSel sapUiTab").attr("aria-selected",true);b=n-1;while(b>=0&&!this.getTabs()[b].getVisible()){b--;}if(b>=0){this.getTabs()[b].$().addClass("sapUiTabBeforeSel");}A=n+1;while(A<this.getTabs().length&&!this.getTabs()[A].getVisible()){A++;}if(A<this.getTabs().length){this.getTabs()[A].$().addClass("sapUiTabAfterSel");}};T.prototype._originalInvalidate=T.prototype.invalidate;T.prototype.invalidate=function(){this.invalidated=true;T.prototype._originalInvalidate.apply(this,arguments);};T.prototype._warningInvalidSelectedIndex=function(s,t){var d="";if(!t){d="Tab not exists";}else if(!t.getEnabled()){d="Tab disabled";}else if(!t.getVisible()){d="Tab not visible";}q.sap.log.warning("SelectedIndex "+s+" can not be set",d,"sap.ui.commons.TabStrip");};T.prototype.onkeydown=function(e){if(e.which===q.sap.KeyCodes.ESCAPE){this._stopMoving();}};T.prototype.onclick=function(e){var s=e.target;var $=q(s);if(s.className=="sapUiTabClose"){var i=this.getItemIndex($.parentByAttribute("id"));if(i>-1){this.fireClose({index:i});}}};T.prototype.onmousedown=function(e){var L=!e.button;var i=this._isTouchMode(e);if(!i&&!L){return;}var s=e.target;var $=q(s);if(s.className=="sapUiTabClose"){e.preventDefault();e.stopPropagation();e.target=null;return;}this.selectTabByDomRef(s);if(!this.getEnableTabReordering()){return;}var b=$.closest(".sapUiTab, .sapUiTabSel, .sapUiTabDsbl");if(b.length===1){this._onTabMoveStart(b,e,i);}};T.prototype._onTabMoveStart=function($,e,i){this._disableTextSelection();e.preventDefault();$.zIndex(this.$().zIndex()+10);var b=this.getItemIndex(e.target);var t=this.getTabs()[b];var c=this.$().find('.sapUiTabBarCnt').children();var d=q.inArray($[0],c);var w=$.outerWidth();this._dragContext={index:d,tabIndex:b,isTouchMode:i,startX:i?e.originalEvent.targetTouches[0].pageX:e.pageX,tab:t,tabWidth:w,tabCenter:$.position().left+w/2};this._aMovedTabIndexes=[];var f=q(document);if(i){f.bind("touchmove",q.proxy(this._onTabMove,this));f.bind("touchend",q.proxy(this._onTabMoved,this));}else{f.mousemove(q.proxy(this._onTabMove,this));f.mouseup(q.proxy(this._onTabMoved,this));}};T.prototype._onTabMove=function(e){var d=this._dragContext;if(!d){return;}var b=this._isTouchMode(e);if(b){e.preventDefault();}var p=b?e.targetTouches[0].pageX:e.pageX;var c=p-d.startX;d.tab.$().css({left:c});var $,x,o,r,f=this.$().find('.sapUiTabBarCnt').children(),m=this._aMovedTabIndexes,R=sap.ui.getCore().getConfiguration().getRTL();for(var i=0;i<f.length;i++){if(i==d.index){continue;}$=q(f[i]);x=$.position().left;o=parseFloat($.css('left'));if(!isNaN(o)){x-=o;}if(i<d.index!=R){r=x+$.outerWidth()>d.tabCenter+c;this._onAnimateTab($,d.tabWidth,r,m,i);}else{r=x<d.tabCenter+c;this._onAnimateTab($,-d.tabWidth,r,m,i);}}};T.prototype._onAnimateTab=function($,d,r,m,i){var b=q.inArray(i,m);var c=b!=-1;if(r&&!c){$.stop(true,true);$.animate({left:d},T.ANIMATION_DURATION);m.push(i);}else if(!r&&c){$.stop(true,true);$.animate({left:0},T.ANIMATION_DURATION);m.splice(b,1);}};T.prototype._onTabMoved=function(e){var d=this._dragContext;if(!d){return;}this._stopMoving();var m=this._aMovedTabIndexes;if(m.length==0){return;}var $=d.tab.$(),b,c=this.$().find('.sapUiTabBarCnt').children();var n=m[m.length-1],s=n,N=this.getItemIndex(c[n]);this.removeAggregation('tabs',d.tab,true);this.insertAggregation('tabs',d.tab,N,true);if(n>d.index){$.insertAfter(q(c[n]));}else{$.insertBefore(q(c[n]));}c=this.$().find('.sapUiTabBarCnt').children();if(!d.tab.getEnabled()){for(var i=0;i<c.length;i++){b=q(c[i]);if(b.hasClass('sapUiTabSel')){s=i;N=this.getItemIndex(b[0]);break;}}}this.setProperty('selectedIndex',N,true);c.removeClass('sapUiTabAfterSel');c.removeClass('sapUiTabBeforeSel');for(var i=0;i<c.length;i++){b=q(c[i]);b.attr("aria-posinset",i+1);if(i==s-1){b.addClass('sapUiTabBeforeSel');}else if(i==s+1){b.addClass('sapUiTabAfterSel');}}$.focus();this._initItemNavigation();};T.prototype._stopMoving=function(){var d=this._dragContext;if(!d){return;}var $=d.tab.$();$.css('z-index','');var b=this.$().find('.sapUiTabBarCnt').children();b.stop(true,true);b.css('left','');this._dragContext=null;var c=q(document);if(d.isTouchMode){c.unbind("touchmove",this._onTabMove);c.unbind("touchend",this._onTabMoved);}else{c.unbind("mousemove",this._onTabMove);c.unbind("mouseup",this._onTabMoved);}this._enableTextSelection();};T.prototype._isTouchMode=function(e){return!!e.originalEvent["touches"];};T.prototype._initItemNavigation=function(){var f=this.getDomRef('tablist'),t=f.childNodes,b=[],s=-1;for(var i=0;i<t.length;i++){b.push(t[i]);if(q(t[i]).hasClass("sapUiTabSel")){s=i;}}if(!this.oItemNavigation){this.oItemNavigation=new I();this.oItemNavigation.attachEvent(I.Events.AfterFocus,this._onItemNavigationAfterFocus,this);this.oItemNavigation.setCycling(false);this.addDelegate(this.oItemNavigation);}this.oItemNavigation.setRootDomRef(f);this.oItemNavigation.setItemDomRefs(b);this.oItemNavigation.setSelectedIndex(s);};T.prototype._disableTextSelection=function(e){q(e||document.body).attr("unselectable","on").addClass('sapUiTabStripNoSelection').bind("selectstart",function(E){E.preventDefault();return false;});};T.prototype._enableTextSelection=function(e){q(e||document.body).attr("unselectable","off").removeClass('sapUiTabStripNoSelection').unbind("selectstart");};T.prototype._getActualSelectedIndex=function(){var s=Math.max(0,this.getSelectedIndex());var t=this.getTabs();var o=t[s];if(o&&o.getVisible()&&o.getEnabled()){return s;}for(var i=0;i<t.length;i++){var b=t[i];if(b.getVisible()&&b.getEnabled()){return i;}}return 0;};T.prototype._getLeftArrowControl=function(){var i=this.getAggregation('_leftArrowControl');var t=this;if(!i){i=new a({src:'sap-icon://navigation-left-arrow',noTabStop:true,useIconTooltip:false,tooltip:'',press:function(e){t._scroll(-T.SCROLL_SIZE,T.SCROLL_ANIMATION_DURATION);}}).addStyleClass('sapUiTabStripScrollIcon sapUiTabStripLeftScrollIcon');this.setAggregation("_leftArrowControl",i,true);}return i;};T.prototype._getRightArrowControl=function(){var i=this.getAggregation('_rightArrowControl');var t=this;if(!i){i=new a({src:'sap-icon://navigation-right-arrow',noTabStop:true,useIconTooltip:false,tooltip:'',press:function(e){t._scroll(T.SCROLL_SIZE,T.SCROLL_ANIMATION_DURATION);}}).addStyleClass('sapUiTabStripScrollIcon sapUiTabStripRightScrollIcon');this.setAggregation("_rightArrowControl",i,true);}return i;};T.prototype._scroll=function(d,i){var s=this.getDomRef("scrollCont").scrollLeft,b;if(this._bRtl&&D.browser.firefox){b=s-d;if(b<-this._iMaxOffsetLeft){b=-this._iMaxOffsetLeft;}if(b>0){b=0;}}else{b=s+d;if(b<0){b=0;}if(b>this._iMaxOffsetLeft){b=this._iMaxOffsetLeft;}}this._oScroller.scrollTo(b,0,i);this._iCurrentScrollLeft=b;};T.prototype._scrollIntoView=function($,d){var b=this.$("tablist"),t=b.innerWidth()-b.width(),i=$.outerWidth(true),c=$.position().left-t/2,s=this.getDomRef("scrollCont"),e=s.scrollLeft,f=this.$("scrollCont").width(),n=e;if(c<0||c>f-i){if(this._bRtl&&D.browser.firefox){if(c<0){n+=c+i-f;}else{n+=c;}}else{if(c<0){n+=c;}else{n+=c+i-f;}}this._iCurrentScrollLeft=n;this._oScroller.scrollTo(n,0,d);}};T.prototype._hasScrolling=function(){var t=this.getDomRef("tablist"),s=this.getDomRef("scrollCont"),b=t&&(t.scrollWidth>s.clientWidth);this.$().toggleClass("sapUiTabStripScrollable",b);return b;};T.prototype._updateScrollingAppearance=function(){var t=this.getDomRef("tablist"),s=this.getDomRef("scrollCont"),i,r,b,c=false,d=false;if(this._hasScrolling()&&t&&s){if(this._bRtl&&D.browser.firefox){i=-s.scrollLeft;}else{i=s.scrollLeft;}r=t.scrollWidth;b=s.clientWidth;if(Math.abs(r-b)===1){r=b;}if(i>0){c=true;}if((r>b)&&(i+b<r)){d=true;}}this.$().toggleClass("sapUiTabStripScrollBack",c).toggleClass("sapUiTabStripScrollForward",d);this._iMaxOffsetLeft=Math.abs(q(s).width()-q(t).width());};T.prototype._onItemNavigationAfterFocus=function(e){var i=e.getParameter("index"),$=e.getParameter('event');if(!$){return;}var b=q($.target);if(!b||$.keyCode===undefined){return;}if(i!==null&&i!==undefined){var n=q(b.parent().children()[i]);if(n&&n.length){this._scrollIntoView(n,0);}}};return T;},true);
