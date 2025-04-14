"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5357],{12543:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(40157).A)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},15452:(e,t,n)=>{n.d(t,{G$:()=>J,Hs:()=>O,UC:()=>en,VY:()=>eo,ZL:()=>ee,bL:()=>Q,bm:()=>ea,hE:()=>er,hJ:()=>et,l9:()=>X});var r=n(12115),o=n(85185),a=n(6101),i=n(46081),l=n(61285),s=n(5845),u=n(19178),d=n(25519),c=n(34378),f=n(28905),p=n(63655),m=n(92293),g=n(93795),v=n(38168),y=n(99708),N=n(95155),h="Dialog",[D,O]=(0,i.A)(h),[R,w]=D(h),C=e=>{let{__scopeDialog:t,children:n,open:o,defaultOpen:a,onOpenChange:i,modal:u=!0}=e,d=r.useRef(null),c=r.useRef(null),[f=!1,p]=(0,s.i)({prop:o,defaultProp:a,onChange:i});return(0,N.jsx)(R,{scope:t,triggerRef:d,contentRef:c,contentId:(0,l.B)(),titleId:(0,l.B)(),descriptionId:(0,l.B)(),open:f,onOpenChange:p,onOpenToggle:r.useCallback(()=>p(e=>!e),[p]),modal:u,children:n})};C.displayName=h;var x="DialogTrigger",I=r.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,i=w(x,n),l=(0,a.s)(t,i.triggerRef);return(0,N.jsx)(p.sG.button,{type:"button","aria-haspopup":"dialog","aria-expanded":i.open,"aria-controls":i.contentId,"data-state":Z(i.open),...r,ref:l,onClick:(0,o.m)(e.onClick,i.onOpenToggle)})});I.displayName=x;var b="DialogPortal",[j,A]=D(b,{forceMount:void 0}),E=e=>{let{__scopeDialog:t,forceMount:n,children:o,container:a}=e,i=w(b,t);return(0,N.jsx)(j,{scope:t,forceMount:n,children:r.Children.map(o,e=>(0,N.jsx)(f.C,{present:n||i.open,children:(0,N.jsx)(c.Z,{asChild:!0,container:a,children:e})}))})};E.displayName=b;var M="DialogOverlay",T=r.forwardRef((e,t)=>{let n=A(M,e.__scopeDialog),{forceMount:r=n.forceMount,...o}=e,a=w(M,e.__scopeDialog);return a.modal?(0,N.jsx)(f.C,{present:r||a.open,children:(0,N.jsx)(F,{...o,ref:t})}):null});T.displayName=M;var _=(0,y.TL)("DialogOverlay.RemoveScroll"),F=r.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,o=w(M,n);return(0,N.jsx)(g.A,{as:_,allowPinchZoom:!0,shards:[o.contentRef],children:(0,N.jsx)(p.sG.div,{"data-state":Z(o.open),...r,ref:t,style:{pointerEvents:"auto",...r.style}})})}),k="DialogContent",P=r.forwardRef((e,t)=>{let n=A(k,e.__scopeDialog),{forceMount:r=n.forceMount,...o}=e,a=w(k,e.__scopeDialog);return(0,N.jsx)(f.C,{present:r||a.open,children:a.modal?(0,N.jsx)(U,{...o,ref:t}):(0,N.jsx)(L,{...o,ref:t})})});P.displayName=k;var U=r.forwardRef((e,t)=>{let n=w(k,e.__scopeDialog),i=r.useRef(null),l=(0,a.s)(t,n.contentRef,i);return r.useEffect(()=>{let e=i.current;if(e)return(0,v.Eq)(e)},[]),(0,N.jsx)(S,{...e,ref:l,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,o.m)(e.onCloseAutoFocus,e=>{var t;e.preventDefault(),null==(t=n.triggerRef.current)||t.focus()}),onPointerDownOutside:(0,o.m)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,n=0===t.button&&!0===t.ctrlKey;(2===t.button||n)&&e.preventDefault()}),onFocusOutside:(0,o.m)(e.onFocusOutside,e=>e.preventDefault())})}),L=r.forwardRef((e,t)=>{let n=w(k,e.__scopeDialog),o=r.useRef(!1),a=r.useRef(!1);return(0,N.jsx)(S,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{var r,i;null==(r=e.onCloseAutoFocus)||r.call(e,t),t.defaultPrevented||(o.current||null==(i=n.triggerRef.current)||i.focus(),t.preventDefault()),o.current=!1,a.current=!1},onInteractOutside:t=>{var r,i;null==(r=e.onInteractOutside)||r.call(e,t),t.defaultPrevented||(o.current=!0,"pointerdown"===t.detail.originalEvent.type&&(a.current=!0));let l=t.target;(null==(i=n.triggerRef.current)?void 0:i.contains(l))&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&a.current&&t.preventDefault()}})}),S=r.forwardRef((e,t)=>{let{__scopeDialog:n,trapFocus:o,onOpenAutoFocus:i,onCloseAutoFocus:l,...s}=e,c=w(k,n),f=r.useRef(null),p=(0,a.s)(t,f);return(0,m.Oh)(),(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(d.n,{asChild:!0,loop:!0,trapped:o,onMountAutoFocus:i,onUnmountAutoFocus:l,children:(0,N.jsx)(u.qW,{role:"dialog",id:c.contentId,"aria-describedby":c.descriptionId,"aria-labelledby":c.titleId,"data-state":Z(c.open),...s,ref:p,onDismiss:()=>c.onOpenChange(!1)})}),(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(Y,{titleId:c.titleId}),(0,N.jsx)($,{contentRef:f,descriptionId:c.descriptionId})]})]})}),W="DialogTitle",q=r.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,o=w(W,n);return(0,N.jsx)(p.sG.h2,{id:o.titleId,...r,ref:t})});q.displayName=W;var G="DialogDescription",B=r.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,o=w(G,n);return(0,N.jsx)(p.sG.p,{id:o.descriptionId,...r,ref:t})});B.displayName=G;var H="DialogClose",V=r.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,a=w(H,n);return(0,N.jsx)(p.sG.button,{type:"button",...r,ref:t,onClick:(0,o.m)(e.onClick,()=>a.onOpenChange(!1))})});function Z(e){return e?"open":"closed"}V.displayName=H;var z="DialogTitleWarning",[J,K]=(0,i.q)(z,{contentName:k,titleName:W,docsSlug:"dialog"}),Y=e=>{let{titleId:t}=e,n=K(z),o="`".concat(n.contentName,"` requires a `").concat(n.titleName,"` for the component to be accessible for screen reader users.\n\nIf you want to hide the `").concat(n.titleName,"`, you can wrap it with our VisuallyHidden component.\n\nFor more information, see https://radix-ui.com/primitives/docs/components/").concat(n.docsSlug);return r.useEffect(()=>{t&&(document.getElementById(t)||console.error(o))},[o,t]),null},$=e=>{let{contentRef:t,descriptionId:n}=e,o=K("DialogDescriptionWarning"),a="Warning: Missing `Description` or `aria-describedby={undefined}` for {".concat(o.contentName,"}.");return r.useEffect(()=>{var e;let r=null==(e=t.current)?void 0:e.getAttribute("aria-describedby");n&&r&&(document.getElementById(n)||console.warn(a))},[a,t,n]),null},Q=C,X=I,ee=E,et=T,en=P,er=q,eo=B,ea=V},28905:(e,t,n)=>{n.d(t,{C:()=>i});var r=n(12115),o=n(6101),a=n(52712),i=e=>{let{present:t,children:n}=e,i=function(e){var t,n;let[o,i]=r.useState(),s=r.useRef({}),u=r.useRef(e),d=r.useRef("none"),[c,f]=(t=e?"mounted":"unmounted",n={mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}},r.useReducer((e,t)=>{let r=n[e][t];return null!=r?r:e},t));return r.useEffect(()=>{let e=l(s.current);d.current="mounted"===c?e:"none"},[c]),(0,a.N)(()=>{let t=s.current,n=u.current;if(n!==e){let r=d.current,o=l(t);e?f("MOUNT"):"none"===o||(null==t?void 0:t.display)==="none"?f("UNMOUNT"):n&&r!==o?f("ANIMATION_OUT"):f("UNMOUNT"),u.current=e}},[e,f]),(0,a.N)(()=>{if(o){var e;let t,n=null!=(e=o.ownerDocument.defaultView)?e:window,r=e=>{let r=l(s.current).includes(e.animationName);if(e.target===o&&r&&(f("ANIMATION_END"),!u.current)){let e=o.style.animationFillMode;o.style.animationFillMode="forwards",t=n.setTimeout(()=>{"forwards"===o.style.animationFillMode&&(o.style.animationFillMode=e)})}},a=e=>{e.target===o&&(d.current=l(s.current))};return o.addEventListener("animationstart",a),o.addEventListener("animationcancel",r),o.addEventListener("animationend",r),()=>{n.clearTimeout(t),o.removeEventListener("animationstart",a),o.removeEventListener("animationcancel",r),o.removeEventListener("animationend",r)}}f("ANIMATION_END")},[o,f]),{isPresent:["mounted","unmountSuspended"].includes(c),ref:r.useCallback(e=>{e&&(s.current=getComputedStyle(e)),i(e)},[])}}(t),s="function"==typeof n?n({present:i.isPresent}):r.Children.only(n),u=(0,o.s)(i.ref,function(e){var t,n;let r=null==(t=Object.getOwnPropertyDescriptor(e.props,"ref"))?void 0:t.get,o=r&&"isReactWarning"in r&&r.isReactWarning;return o?e.ref:(o=(r=null==(n=Object.getOwnPropertyDescriptor(e,"ref"))?void 0:n.get)&&"isReactWarning"in r&&r.isReactWarning)?e.props.ref:e.props.ref||e.ref}(s));return"function"==typeof n||i.isPresent?r.cloneElement(s,{ref:u}):null};function l(e){return(null==e?void 0:e.animationName)||"none"}i.displayName="Presence"},50172:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(40157).A)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},75074:(e,t,n)=>{n.d(t,{A:()=>r});let r=(0,n(40157).A)("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]])}}]);