(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6916],{12543:(e,r,t)=>{"use strict";t.d(r,{A:()=>a});let a=(0,t(40157).A)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},17759:(e,r,t)=>{"use strict";t.d(r,{C5:()=>g,MJ:()=>x,Rr:()=>v,eI:()=>h,lR:()=>p,lV:()=>l,zB:()=>u});var a=t(95155),s=t(12115),n=t(99708),o=t(62177),i=t(59434),d=t(85057);let l=o.Op,c=s.createContext({}),u=e=>{let{...r}=e;return(0,a.jsx)(c.Provider,{value:{name:r.name},children:(0,a.jsx)(o.xI,{...r})})},m=()=>{let e=s.useContext(c),r=s.useContext(f),{getFieldState:t,formState:a}=(0,o.xW)(),n=t(e.name,a);if(!e)throw Error("useFormField should be used within <FormField>");let{id:i}=r;return{id:i,name:e.name,formItemId:"".concat(i,"-form-item"),formDescriptionId:"".concat(i,"-form-item-description"),formMessageId:"".concat(i,"-form-item-message"),...n}},f=s.createContext({}),h=s.forwardRef((e,r)=>{let{className:t,...n}=e,o=s.useId();return(0,a.jsx)(f.Provider,{value:{id:o},children:(0,a.jsx)("div",{ref:r,className:(0,i.cn)("space-y-2",t),...n})})});h.displayName="FormItem";let p=s.forwardRef((e,r)=>{let{className:t,...s}=e,{error:n,formItemId:o}=m();return(0,a.jsx)(d.J,{ref:r,className:(0,i.cn)(n&&"text-destructive",t),htmlFor:o,...s})});p.displayName="FormLabel";let x=s.forwardRef((e,r)=>{let{...t}=e,{error:s,formItemId:o,formDescriptionId:i,formMessageId:d}=m();return(0,a.jsx)(n.DX,{ref:r,id:o,"aria-describedby":s?"".concat(i," ").concat(d):"".concat(i),"aria-invalid":!!s,...t})});x.displayName="FormControl";let v=s.forwardRef((e,r)=>{let{className:t,...s}=e,{formDescriptionId:n}=m();return(0,a.jsx)("p",{ref:r,id:n,className:(0,i.cn)("text-[0.8rem] text-muted-foreground",t),...s})});v.displayName="FormDescription";let g=s.forwardRef((e,r)=>{let{className:t,children:s,...n}=e,{error:o,formMessageId:d}=m(),l=o?String(null==o?void 0:o.message):s;return l?(0,a.jsx)("p",{ref:r,id:d,className:(0,i.cn)("text-[0.8rem] font-medium text-destructive",t),...n,children:l}):null});g.displayName="FormMessage"},30285:(e,r,t)=>{"use strict";t.d(r,{$:()=>l,r:()=>d});var a=t(95155),s=t(12115),n=t(99708),o=t(74466),i=t(59434);let d=(0,o.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),l=s.forwardRef((e,r)=>{let{className:t,variant:s,size:o,asChild:l=!1,...c}=e,u=l?n.DX:"button";return(0,a.jsx)(u,{className:(0,i.cn)(d({variant:s,size:o,className:t})),ref:r,...c})});l.displayName="Button"},35695:(e,r,t)=>{"use strict";var a=t(18999);t.o(a,"usePathname")&&t.d(r,{usePathname:function(){return a.usePathname}}),t.o(a,"useRouter")&&t.d(r,{useRouter:function(){return a.useRouter}}),t.o(a,"useSearchParams")&&t.d(r,{useSearchParams:function(){return a.useSearchParams}})},40157:(e,r,t)=>{"use strict";t.d(r,{A:()=>d});var a=t(12115);let s=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),n=function(){for(var e=arguments.length,r=Array(e),t=0;t<e;t++)r[t]=arguments[t];return r.filter((e,r,t)=>!!e&&""!==e.trim()&&t.indexOf(e)===r).join(" ").trim()};var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,a.forwardRef)((e,r)=>{let{color:t="currentColor",size:s=24,strokeWidth:i=2,absoluteStrokeWidth:d,className:l="",children:c,iconNode:u,...m}=e;return(0,a.createElement)("svg",{ref:r,...o,width:s,height:s,stroke:t,strokeWidth:d?24*Number(i)/Number(s):i,className:n("lucide",l),...m},[...u.map(e=>{let[r,t]=e;return(0,a.createElement)(r,t)}),...Array.isArray(c)?c:[c]])}),d=(e,r)=>{let t=(0,a.forwardRef)((t,o)=>{let{className:d,...l}=t;return(0,a.createElement)(i,{ref:o,iconNode:r,className:n("lucide-".concat(s(e)),d),...l})});return t.displayName="".concat(e),t}},53270:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>g});var a=t(95155),s=t(12115),n=t(35695),o=t(30285),i=t(66695),d=t(62523),l=t(88539),c=t(56671),u=t(55594),m=t(62177),f=t(90221),h=t(17759),p=t(12543),x=t(59119);let v=u.z.object({name:u.z.string().min(2,"Name must be at least 2 characters").max(100,"Name must be less than 100 characters"),description:u.z.string().optional()});function g(){let e=(0,n.useRouter)(),[r,t]=(0,s.useState)(!1),u=(0,m.mN)({resolver:(0,f.u)(v),defaultValues:{name:"",description:""}}),g=async r=>{t(!0);try{let t=await fetch("/api/event-categories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!t.ok){let e=await t.json();throw Error(e.error||"Failed to create category")}c.oR.success("Category created successfully"),e.push("/dashboard/event-categories")}catch(e){console.error("Error creating category:",e),c.oR.error(e.message||"Failed to create category")}finally{t(!1)}};return(0,a.jsxs)("div",{className:"container mx-auto py-6",children:[(0,a.jsxs)("div",{className:"flex items-center mb-6",children:[(0,a.jsxs)(o.$,{variant:"ghost",onClick:()=>e.push("/dashboard/event-categories"),className:"mr-4",children:[(0,a.jsx)(p.A,{className:"mr-2 h-4 w-4"}),"Back"]}),(0,a.jsx)("h1",{className:"text-3xl font-bold",children:"Add New Category"})]}),(0,a.jsxs)(i.Zp,{children:[(0,a.jsxs)(i.aR,{children:[(0,a.jsx)(i.ZB,{children:"Category Details"}),(0,a.jsx)(i.BT,{children:"Create a new event category to organize your events"})]}),(0,a.jsx)(i.Wu,{children:(0,a.jsx)(h.lV,{...u,children:(0,a.jsxs)("form",{onSubmit:u.handleSubmit(g),className:"space-y-6",children:[(0,a.jsx)(h.zB,{control:u.control,name:"name",render:e=>{let{field:r}=e;return(0,a.jsxs)(h.eI,{children:[(0,a.jsx)(h.lR,{children:"Name"}),(0,a.jsx)(h.MJ,{children:(0,a.jsx)(d.p,{placeholder:"Category name",...r})}),(0,a.jsx)(h.Rr,{children:"The name of the category as it will appear to users"}),(0,a.jsx)(h.C5,{})]})}}),(0,a.jsx)(h.zB,{control:u.control,name:"description",render:e=>{let{field:r}=e;return(0,a.jsxs)(h.eI,{children:[(0,a.jsx)(h.lR,{children:"Description"}),(0,a.jsx)(h.MJ,{children:(0,a.jsx)(l.T,{placeholder:"Describe this category (optional)",...r,rows:4})}),(0,a.jsx)(h.Rr,{children:"A brief description of what this category represents"}),(0,a.jsx)(h.C5,{})]})}}),(0,a.jsx)("div",{className:"flex justify-end",children:(0,a.jsxs)(o.$,{type:"submit",disabled:r,children:[(0,a.jsx)(x.A,{className:"mr-2 h-4 w-4"}),r?"Creating...":"Create Category"]})})]})})})]})]})}},53754:(e,r,t)=>{Promise.resolve().then(t.bind(t,53270))},59119:(e,r,t)=>{"use strict";t.d(r,{A:()=>a});let a=(0,t(40157).A)("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]])},59434:(e,r,t)=>{"use strict";t.d(r,{cn:()=>n});var a=t(52596),s=t(39688);function n(){for(var e=arguments.length,r=Array(e),t=0;t<e;t++)r[t]=arguments[t];return(0,s.QP)((0,a.$)(r))}},62523:(e,r,t)=>{"use strict";t.d(r,{p:()=>o});var a=t(95155),s=t(12115),n=t(59434);let o=s.forwardRef((e,r)=>{let{className:t,type:s,...o}=e;return(0,a.jsx)("input",{type:s,className:(0,n.cn)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",t),ref:r,...o})});o.displayName="Input"},63655:(e,r,t)=>{"use strict";t.d(r,{hO:()=>d,sG:()=>i});var a=t(12115),s=t(47650),n=t(99708),o=t(95155),i=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"].reduce((e,r)=>{let t=(0,n.TL)(`Primitive.${r}`),s=a.forwardRef((e,a)=>{let{asChild:s,...n}=e;return"undefined"!=typeof window&&(window[Symbol.for("radix-ui")]=!0),(0,o.jsx)(s?t:r,{...n,ref:a})});return s.displayName=`Primitive.${r}`,{...e,[r]:s}},{});function d(e,r){e&&s.flushSync(()=>e.dispatchEvent(r))}},66695:(e,r,t)=>{"use strict";t.d(r,{BT:()=>l,Wu:()=>c,ZB:()=>d,Zp:()=>o,aR:()=>i,wL:()=>u});var a=t(95155),s=t(12115),n=t(59434);let o=s.forwardRef((e,r)=>{let{className:t,...s}=e;return(0,a.jsx)("div",{ref:r,className:(0,n.cn)("rounded-xl border bg-card text-card-foreground shadow",t),...s})});o.displayName="Card";let i=s.forwardRef((e,r)=>{let{className:t,...s}=e;return(0,a.jsx)("div",{ref:r,className:(0,n.cn)("flex flex-col space-y-1.5 p-6",t),...s})});i.displayName="CardHeader";let d=s.forwardRef((e,r)=>{let{className:t,...s}=e;return(0,a.jsx)("div",{ref:r,className:(0,n.cn)("font-semibold leading-none tracking-tight",t),...s})});d.displayName="CardTitle";let l=s.forwardRef((e,r)=>{let{className:t,...s}=e;return(0,a.jsx)("div",{ref:r,className:(0,n.cn)("text-sm text-muted-foreground",t),...s})});l.displayName="CardDescription";let c=s.forwardRef((e,r)=>{let{className:t,...s}=e;return(0,a.jsx)("div",{ref:r,className:(0,n.cn)("p-6 pt-0",t),...s})});c.displayName="CardContent";let u=s.forwardRef((e,r)=>{let{className:t,...s}=e;return(0,a.jsx)("div",{ref:r,className:(0,n.cn)("flex items-center p-6 pt-0",t),...s})});u.displayName="CardFooter"},85057:(e,r,t)=>{"use strict";t.d(r,{J:()=>l});var a=t(95155),s=t(12115),n=t(40968),o=t(74466),i=t(59434);let d=(0,o.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),l=s.forwardRef((e,r)=>{let{className:t,...s}=e;return(0,a.jsx)(n.b,{ref:r,className:(0,i.cn)(d(),t),...s})});l.displayName=n.b.displayName},88539:(e,r,t)=>{"use strict";t.d(r,{T:()=>o});var a=t(95155),s=t(12115),n=t(59434);let o=s.forwardRef((e,r)=>{let{className:t,...s}=e;return(0,a.jsx)("textarea",{className:(0,n.cn)("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",t),ref:r,...s})});o.displayName="Textarea"}},e=>{var r=r=>e(e.s=r);e.O(0,[9352,5521,6671,8441,1684,7358],()=>r(53754)),_N_E=e.O()}]);