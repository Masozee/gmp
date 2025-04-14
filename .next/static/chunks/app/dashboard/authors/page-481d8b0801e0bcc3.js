(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4842],{17759:(e,t,a)=>{"use strict";a.d(t,{C5:()=>g,MJ:()=>p,Rr:()=>j,eI:()=>x,lR:()=>h,lV:()=>i,zB:()=>m});var r=a(95155),s=a(12115),l=a(99708),n=a(62177),d=a(59434),o=a(85057);let i=n.Op,c=s.createContext({}),m=e=>{let{...t}=e;return(0,r.jsx)(c.Provider,{value:{name:t.name},children:(0,r.jsx)(n.xI,{...t})})},f=()=>{let e=s.useContext(c),t=s.useContext(u),{getFieldState:a,formState:r}=(0,n.xW)(),l=a(e.name,r);if(!e)throw Error("useFormField should be used within <FormField>");let{id:d}=t;return{id:d,name:e.name,formItemId:"".concat(d,"-form-item"),formDescriptionId:"".concat(d,"-form-item-description"),formMessageId:"".concat(d,"-form-item-message"),...l}},u=s.createContext({}),x=s.forwardRef((e,t)=>{let{className:a,...l}=e,n=s.useId();return(0,r.jsx)(u.Provider,{value:{id:n},children:(0,r.jsx)("div",{ref:t,className:(0,d.cn)("space-y-2",a),...l})})});x.displayName="FormItem";let h=s.forwardRef((e,t)=>{let{className:a,...s}=e,{error:l,formItemId:n}=f();return(0,r.jsx)(o.J,{ref:t,className:(0,d.cn)(l&&"text-destructive",a),htmlFor:n,...s})});h.displayName="FormLabel";let p=s.forwardRef((e,t)=>{let{...a}=e,{error:s,formItemId:n,formDescriptionId:d,formMessageId:o}=f();return(0,r.jsx)(l.DX,{ref:t,id:n,"aria-describedby":s?"".concat(d," ").concat(o):"".concat(d),"aria-invalid":!!s,...a})});p.displayName="FormControl";let j=s.forwardRef((e,t)=>{let{className:a,...s}=e,{formDescriptionId:l}=f();return(0,r.jsx)("p",{ref:t,id:l,className:(0,d.cn)("text-[0.8rem] text-muted-foreground",a),...s})});j.displayName="FormDescription";let g=s.forwardRef((e,t)=>{let{className:a,children:s,...l}=e,{error:n,formMessageId:o}=f(),i=n?String(null==n?void 0:n.message):s;return i?(0,r.jsx)("p",{ref:t,id:o,className:(0,d.cn)("text-[0.8rem] font-medium text-destructive",a),...l,children:i}):null});g.displayName="FormMessage"},26126:(e,t,a)=>{"use strict";a.d(t,{E:()=>d});var r=a(95155);a(12115);var s=a(74466),l=a(59434);let n=(0,s.F)("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function d(e){let{className:t,variant:a,...s}=e;return(0,r.jsx)("div",{className:(0,l.cn)(n({variant:a}),t),...s})}},30285:(e,t,a)=>{"use strict";a.d(t,{$:()=>i,r:()=>o});var r=a(95155),s=a(12115),l=a(99708),n=a(74466),d=a(59434);let o=(0,n.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),i=s.forwardRef((e,t)=>{let{className:a,variant:s,size:n,asChild:i=!1,...c}=e,m=i?l.DX:"button";return(0,r.jsx)(m,{className:(0,d.cn)(o({variant:s,size:n,className:a})),ref:t,...c})});i.displayName="Button"},31130:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>B});var r=a(95155),s=a(12115),l=a(34301),n=a(75074),d=a(9572),o=a(30285),i=a(62523),c=a(59409),m=a(66695),f=a(35695),u=a(19637),x=a(31554),h=a(3561),p=a(17607),j=a(75943),g=a(77223),N=a(85127),b=a(44838),v=a(26126),y=a(91394);function w(e){let{searchQuery:t,categoryFilter:a}=e,l=(0,f.useRouter)(),[n,d]=(0,s.useState)([]),[i,c]=(0,s.useState)(!0);(0,s.useEffect)(()=>{m()},[t,a]);let m=async()=>{try{let e=new URLSearchParams;t&&e.set("search",t),"all"!==a&&e.set("category",a);let r=await fetch("/api/authors?".concat(e));if(!r.ok)throw Error("Failed to fetch authors");let s=await r.json();d(s)}catch(e){console.error("Error fetching authors:",e)}finally{c(!1)}},w=async e=>{try{if(!(await fetch("/api/authors/".concat(e),{method:"DELETE"})).ok)throw Error("Failed to delete author");d(t=>t.filter(t=>t.id!==e))}catch(e){console.error("Error deleting author:",e)}},R=e=>(0,r.jsx)(v.E,{variant:{AUTHOR:"default",BOARD:"secondary",STAFF:"outline",RESEARCHER:"secondary"}[e],children:e.charAt(0)+e.slice(1).toLowerCase()});return(0,r.jsxs)(N.XI,{children:[(0,r.jsx)(N.A0,{children:(0,r.jsxs)(N.Hj,{children:[(0,r.jsx)(N.nd,{children:"Name"}),(0,r.jsx)(N.nd,{children:"Category"}),(0,r.jsx)(N.nd,{children:"Organization"}),(0,r.jsx)(N.nd,{children:"Contact"}),(0,r.jsx)(N.nd,{className:"w-[100px]",children:"Actions"})]})}),(0,r.jsx)(N.BF,{children:i?(0,r.jsx)(N.Hj,{children:(0,r.jsx)(N.nA,{colSpan:5,className:"text-center",children:"Loading..."})}):0===n.length?(0,r.jsx)(N.Hj,{children:(0,r.jsx)(N.nA,{colSpan:5,className:"text-center text-muted-foreground",children:"No authors found"})}):n.map(e=>(0,r.jsxs)(N.Hj,{children:[(0,r.jsx)(N.nA,{children:(0,r.jsxs)("div",{className:"flex items-center gap-3",children:[(0,r.jsxs)(y.eu,{children:[(0,r.jsx)(y.BK,{src:e.photoUrl||"",alt:"".concat(e.firstName," ").concat(e.lastName)}),(0,r.jsxs)(y.q5,{children:[e.firstName[0],e.lastName[0]]})]}),(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{className:"font-medium",children:[e.firstName," ",e.lastName]}),(0,r.jsx)("div",{className:"text-sm text-muted-foreground",children:e.email})]})]})}),(0,r.jsx)(N.nA,{children:R(e.category)}),(0,r.jsx)(N.nA,{children:e.organization||"—"}),(0,r.jsx)(N.nA,{children:(0,r.jsxs)("div",{className:"flex items-center gap-2",children:[(0,r.jsx)(o.$,{variant:"ghost",size:"icon",className:"h-8 w-8",onClick:()=>window.location.href="mailto:".concat(e.email),children:(0,r.jsx)(u.A,{className:"h-4 w-4"})}),e.phoneNumber&&(0,r.jsx)(o.$,{variant:"ghost",size:"icon",className:"h-8 w-8",onClick:()=>window.location.href="tel:".concat(e.phoneNumber),children:(0,r.jsx)(x.A,{className:"h-4 w-4"})})]})}),(0,r.jsx)(N.nA,{children:(0,r.jsxs)(b.rI,{children:[(0,r.jsx)(b.ty,{asChild:!0,children:(0,r.jsxs)(o.$,{variant:"ghost",className:"flex h-8 w-8 p-0 data-[state=open]:bg-muted",children:[(0,r.jsx)(h.A,{className:"h-4 w-4"}),(0,r.jsx)("span",{className:"sr-only",children:"Open menu"})]})}),(0,r.jsxs)(b.SQ,{align:"end",className:"w-[160px]",children:[(0,r.jsxs)(b._2,{onClick:()=>l.push("/dashboard/authors/".concat(e.id)),children:[(0,r.jsx)(p.A,{className:"mr-2 h-4 w-4"}),"View"]}),(0,r.jsxs)(b._2,{onClick:()=>l.push("/dashboard/authors/".concat(e.id,"/edit")),children:[(0,r.jsx)(j.A,{className:"mr-2 h-4 w-4"}),"Edit"]}),(0,r.jsx)(b.mB,{}),(0,r.jsxs)(b._2,{className:"text-destructive",onClick:()=>w(e.id),children:[(0,r.jsx)(g.A,{className:"mr-2 h-4 w-4"}),"Delete"]})]})]})})]},e.id))})]})}var R=a(62177),C=a(90221),A=a(55594),F=a(54165),k=a(17759),z=a(55365),E=a(88539);let S=A.Ik({firstName:A.Yj().min(2,"First name must be at least 2 characters"),lastName:A.Yj().min(2,"Last name must be at least 2 characters"),email:A.Yj().email("Invalid email address"),phoneNumber:A.Yj().optional(),organization:A.Yj().optional(),bio:A.Yj().optional(),category:A.k5(["AUTHOR","BOARD","STAFF","RESEARCHER"])});function T(e){let{open:t,onOpenChange:a}=e,[l,n]=(0,s.useState)(null),[d,m]=(0,s.useState)(!1),[f,u]=(0,s.useState)(null),x=(0,R.mN)({resolver:(0,C.u)(S),defaultValues:{firstName:"",lastName:"",email:"",phoneNumber:"",organization:"",bio:"",category:"AUTHOR"}}),h=async e=>{try{m(!0),n(null);let t=new FormData;if(Object.entries(e).forEach(e=>{let[a,r]=e;r&&t.append(a,r)}),f&&t.append("photo",f),!(await fetch("/api/authors",{method:"POST",body:t})).ok)throw Error("Failed to create author");x.reset(),u(null),a(!1)}catch(e){n(e instanceof Error?e.message:"Something went wrong")}finally{m(!1)}};return(0,r.jsx)(F.lG,{open:t,onOpenChange:a,children:(0,r.jsxs)(F.Cf,{children:[(0,r.jsx)(F.c7,{children:(0,r.jsx)(F.L3,{children:"Create New Author"})}),(0,r.jsx)(k.lV,{...x,children:(0,r.jsxs)("form",{onSubmit:x.handleSubmit(h),className:"space-y-4",children:[(0,r.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,r.jsx)(k.zB,{control:x.control,name:"firstName",render:e=>{let{field:t}=e;return(0,r.jsxs)(k.eI,{children:[(0,r.jsx)(k.lR,{children:"First Name"}),(0,r.jsx)(k.MJ,{children:(0,r.jsx)(i.p,{...t})}),(0,r.jsx)(k.C5,{})]})}}),(0,r.jsx)(k.zB,{control:x.control,name:"lastName",render:e=>{let{field:t}=e;return(0,r.jsxs)(k.eI,{children:[(0,r.jsx)(k.lR,{children:"Last Name"}),(0,r.jsx)(k.MJ,{children:(0,r.jsx)(i.p,{...t})}),(0,r.jsx)(k.C5,{})]})}})]}),(0,r.jsx)(k.zB,{control:x.control,name:"email",render:e=>{let{field:t}=e;return(0,r.jsxs)(k.eI,{children:[(0,r.jsx)(k.lR,{children:"Email"}),(0,r.jsx)(k.MJ,{children:(0,r.jsx)(i.p,{...t,type:"email"})}),(0,r.jsx)(k.C5,{})]})}}),(0,r.jsx)(k.zB,{control:x.control,name:"phoneNumber",render:e=>{let{field:t}=e;return(0,r.jsxs)(k.eI,{children:[(0,r.jsx)(k.lR,{children:"Phone Number"}),(0,r.jsx)(k.MJ,{children:(0,r.jsx)(i.p,{...t,type:"tel"})}),(0,r.jsx)(k.C5,{})]})}}),(0,r.jsx)(k.zB,{control:x.control,name:"organization",render:e=>{let{field:t}=e;return(0,r.jsxs)(k.eI,{children:[(0,r.jsx)(k.lR,{children:"Organization"}),(0,r.jsx)(k.MJ,{children:(0,r.jsx)(i.p,{...t})}),(0,r.jsx)(k.C5,{})]})}}),(0,r.jsx)(k.zB,{control:x.control,name:"category",render:e=>{let{field:t}=e;return(0,r.jsxs)(k.eI,{children:[(0,r.jsx)(k.lR,{children:"Category"}),(0,r.jsxs)(c.l6,{onValueChange:t.onChange,defaultValue:t.value,children:[(0,r.jsx)(k.MJ,{children:(0,r.jsx)(c.bq,{children:(0,r.jsx)(c.yv,{placeholder:"Select a category"})})}),(0,r.jsxs)(c.gC,{children:[(0,r.jsx)(c.eb,{value:"AUTHOR",children:"Author"}),(0,r.jsx)(c.eb,{value:"BOARD",children:"Board Member"}),(0,r.jsx)(c.eb,{value:"STAFF",children:"Staff"}),(0,r.jsx)(c.eb,{value:"RESEARCHER",children:"Researcher"})]})]}),(0,r.jsx)(k.C5,{})]})}}),(0,r.jsx)(k.zB,{control:x.control,name:"bio",render:e=>{let{field:t}=e;return(0,r.jsxs)(k.eI,{children:[(0,r.jsx)(k.lR,{children:"Bio"}),(0,r.jsx)(k.MJ,{children:(0,r.jsx)(E.T,{...t})}),(0,r.jsx)(k.C5,{})]})}}),(0,r.jsxs)("div",{children:[(0,r.jsx)(k.lR,{children:"Photo"}),(0,r.jsx)(i.p,{type:"file",accept:"image/*",onChange:e=>{var t;let a=null==(t=e.target.files)?void 0:t[0];a&&u(a)},className:"mt-1"})]}),l&&(0,r.jsx)(z.Fc,{variant:"destructive",children:(0,r.jsx)(z.TN,{children:l})}),(0,r.jsxs)("div",{className:"flex justify-end space-x-2",children:[(0,r.jsx)(o.$,{type:"button",variant:"outline",onClick:()=>a(!1),children:"Cancel"}),(0,r.jsx)(o.$,{type:"submit",disabled:d,children:d?"Creating...":"Create Author"})]})]})})]})})}function B(){let[e,t]=(0,s.useState)(!1),[a,f]=(0,s.useState)(""),[u,x]=(0,s.useState)("all");return(0,r.jsxs)("div",{className:"flex flex-col gap-6",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between",children:[(0,r.jsxs)("div",{className:"space-y-1",children:[(0,r.jsx)("h1",{className:"text-3xl font-bold tracking-tight",children:"Authors"}),(0,r.jsx)("p",{className:"text-muted-foreground",children:"Manage authors and contributors"})]}),(0,r.jsxs)(o.$,{onClick:()=>t(!0),children:[(0,r.jsx)(l.A,{className:"mr-2 h-4 w-4"}),"Add Author"]})]}),(0,r.jsxs)(m.Zp,{className:"border-none shadow-md",children:[(0,r.jsxs)(m.aR,{children:[(0,r.jsx)(m.ZB,{children:"Author Management"}),(0,r.jsx)(m.BT,{children:"Search, filter, and manage authors"})]}),(0,r.jsx)(m.Wu,{children:(0,r.jsxs)("div",{className:"flex flex-col gap-4 md:flex-row md:items-center",children:[(0,r.jsx)("div",{className:"flex-1",children:(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsx)(n.A,{className:"absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"}),(0,r.jsx)(i.p,{placeholder:"Search authors...",className:"pl-8 bg-background transition-colors focus-visible:ring-1",value:a,onChange:e=>f(e.target.value)})]})}),(0,r.jsx)("div",{className:"flex items-center gap-2",children:(0,r.jsxs)(c.l6,{value:u,onValueChange:x,children:[(0,r.jsxs)(c.bq,{className:"w-[180px] bg-background",children:[(0,r.jsx)(d.A,{className:"mr-2 h-4 w-4"}),(0,r.jsx)(c.yv,{placeholder:"Filter by category"})]}),(0,r.jsxs)(c.gC,{children:[(0,r.jsx)(c.eb,{value:"all",children:"All Categories"}),(0,r.jsx)(c.eb,{value:"AUTHOR",children:"Author"}),(0,r.jsx)(c.eb,{value:"BOARD",children:"Board Member"}),(0,r.jsx)(c.eb,{value:"STAFF",children:"Staff"}),(0,r.jsx)(c.eb,{value:"RESEARCHER",children:"Researcher"})]})]})})]})})]}),(0,r.jsx)("div",{className:"rounded-lg border bg-card shadow-sm",children:(0,r.jsx)(w,{searchQuery:a,categoryFilter:u})}),(0,r.jsx)(T,{open:e,onOpenChange:t})]})}},44838:(e,t,a)=>{"use strict";a.d(t,{I:()=>f,M5:()=>h,SQ:()=>p,_2:()=>j,hO:()=>g,lp:()=>N,lv:()=>u,mB:()=>b,nV:()=>x,rI:()=>c,ty:()=>m});var r=a(95155),s=a(12115),l=a(48698),n=a(73158),d=a(10518),o=a(70154),i=a(59434);let c=l.bL,m=l.l9,f=l.YJ;l.ZL;let u=l.Pb;l.z6;let x=s.forwardRef((e,t)=>{let{className:a,inset:s,children:d,...o}=e;return(0,r.jsxs)(l.ZP,{ref:t,className:(0,i.cn)("flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",s&&"pl-8",a),...o,children:[d,(0,r.jsx)(n.A,{className:"ml-auto"})]})});x.displayName=l.ZP.displayName;let h=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.G5,{ref:t,className:(0,i.cn)("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",a),...s})});h.displayName=l.G5.displayName;let p=s.forwardRef((e,t)=>{let{className:a,sideOffset:s=4,...n}=e;return(0,r.jsx)(l.ZL,{children:(0,r.jsx)(l.UC,{ref:t,sideOffset:s,className:(0,i.cn)("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md","data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",a),...n})})});p.displayName=l.UC.displayName;let j=s.forwardRef((e,t)=>{let{className:a,inset:s,...n}=e;return(0,r.jsx)(l.q7,{ref:t,className:(0,i.cn)("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",s&&"pl-8",a),...n})});j.displayName=l.q7.displayName;let g=s.forwardRef((e,t)=>{let{className:a,children:s,checked:n,...o}=e;return(0,r.jsxs)(l.H_,{ref:t,className:(0,i.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",a),checked:n,...o,children:[(0,r.jsx)("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,r.jsx)(l.VF,{children:(0,r.jsx)(d.A,{className:"h-4 w-4"})})}),s]})});g.displayName=l.H_.displayName,s.forwardRef((e,t)=>{let{className:a,children:s,...n}=e;return(0,r.jsxs)(l.hN,{ref:t,className:(0,i.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",a),...n,children:[(0,r.jsx)("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,r.jsx)(l.VF,{children:(0,r.jsx)(o.A,{className:"h-2 w-2 fill-current"})})}),s]})}).displayName=l.hN.displayName;let N=s.forwardRef((e,t)=>{let{className:a,inset:s,...n}=e;return(0,r.jsx)(l.JU,{ref:t,className:(0,i.cn)("px-2 py-1.5 text-sm font-semibold",s&&"pl-8",a),...n})});N.displayName=l.JU.displayName;let b=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.wv,{ref:t,className:(0,i.cn)("-mx-1 my-1 h-px bg-muted",a),...s})});b.displayName=l.wv.displayName},54165:(e,t,a)=>{"use strict";a.d(t,{Cf:()=>f,Es:()=>x,L3:()=>h,c7:()=>u,lG:()=>o,rr:()=>p,zM:()=>i});var r=a(95155),s=a(12115),l=a(15452),n=a(25318),d=a(59434);let o=l.bL,i=l.l9,c=l.ZL;l.bm;let m=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.hJ,{ref:t,className:(0,d.cn)("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...s})});m.displayName=l.hJ.displayName;let f=s.forwardRef((e,t)=>{let{className:a,children:s,...o}=e;return(0,r.jsxs)(c,{children:[(0,r.jsx)(m,{}),(0,r.jsxs)(l.UC,{ref:t,className:(0,d.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",a),...o,children:[s,(0,r.jsxs)(l.bm,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[(0,r.jsx)(n.A,{className:"h-4 w-4"}),(0,r.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})});f.displayName=l.UC.displayName;let u=e=>{let{className:t,...a}=e;return(0,r.jsx)("div",{className:(0,d.cn)("flex flex-col space-y-1.5 text-center sm:text-left",t),...a})};u.displayName="DialogHeader";let x=e=>{let{className:t,...a}=e;return(0,r.jsx)("div",{className:(0,d.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",t),...a})};x.displayName="DialogFooter";let h=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.hE,{ref:t,className:(0,d.cn)("text-lg font-semibold leading-none tracking-tight",a),...s})});h.displayName=l.hE.displayName;let p=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.VY,{ref:t,className:(0,d.cn)("text-sm text-muted-foreground",a),...s})});p.displayName=l.VY.displayName},55365:(e,t,a)=>{"use strict";a.d(t,{Fc:()=>o,TN:()=>i});var r=a(95155),s=a(12115),l=a(74466),n=a(59434);let d=(0,l.F)("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",{variants:{variant:{default:"bg-background text-foreground",destructive:"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"}},defaultVariants:{variant:"default"}}),o=s.forwardRef((e,t)=>{let{className:a,variant:s,...l}=e;return(0,r.jsx)("div",{ref:t,role:"alert",className:(0,n.cn)(d({variant:s}),a),...l})});o.displayName="Alert",s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("h5",{ref:t,className:(0,n.cn)("mb-1 font-medium leading-none tracking-tight",a),...s})}).displayName="AlertTitle";let i=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,n.cn)("text-sm [&_p]:leading-relaxed",a),...s})});i.displayName="AlertDescription"},59409:(e,t,a)=>{"use strict";a.d(t,{bq:()=>f,eb:()=>p,gC:()=>h,l6:()=>c,yv:()=>m});var r=a(95155),s=a(12115),l=a(31992),n=a(79556),d=a(77381),o=a(10518),i=a(59434);let c=l.bL;l.YJ;let m=l.WT,f=s.forwardRef((e,t)=>{let{className:a,children:s,...d}=e;return(0,r.jsxs)(l.l9,{ref:t,className:(0,i.cn)("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",a),...d,children:[s,(0,r.jsx)(l.In,{asChild:!0,children:(0,r.jsx)(n.A,{className:"h-4 w-4 opacity-50"})})]})});f.displayName=l.l9.displayName;let u=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.PP,{ref:t,className:(0,i.cn)("flex cursor-default items-center justify-center py-1",a),...s,children:(0,r.jsx)(d.A,{className:"h-4 w-4"})})});u.displayName=l.PP.displayName;let x=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.wn,{ref:t,className:(0,i.cn)("flex cursor-default items-center justify-center py-1",a),...s,children:(0,r.jsx)(n.A,{className:"h-4 w-4"})})});x.displayName=l.wn.displayName;let h=s.forwardRef((e,t)=>{let{className:a,children:s,position:n="popper",...d}=e;return(0,r.jsx)(l.ZL,{children:(0,r.jsxs)(l.UC,{ref:t,className:(0,i.cn)("relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]","popper"===n&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",a),position:n,...d,children:[(0,r.jsx)(u,{}),(0,r.jsx)(l.LM,{className:(0,i.cn)("p-1","popper"===n&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:s}),(0,r.jsx)(x,{})]})})});h.displayName=l.UC.displayName,s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.JU,{ref:t,className:(0,i.cn)("px-2 py-1.5 text-sm font-semibold",a),...s})}).displayName=l.JU.displayName;let p=s.forwardRef((e,t)=>{let{className:a,children:s,...n}=e;return(0,r.jsxs)(l.q7,{ref:t,className:(0,i.cn)("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",a),...n,children:[(0,r.jsx)("span",{className:"absolute right-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,r.jsx)(l.VF,{children:(0,r.jsx)(o.A,{className:"h-4 w-4"})})}),(0,r.jsx)(l.p4,{children:s})]})});p.displayName=l.q7.displayName,s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.wv,{ref:t,className:(0,i.cn)("-mx-1 my-1 h-px bg-muted",a),...s})}).displayName=l.wv.displayName},59434:(e,t,a)=>{"use strict";a.d(t,{cn:()=>l});var r=a(52596),s=a(39688);function l(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];return(0,s.QP)((0,r.$)(t))}},62523:(e,t,a)=>{"use strict";a.d(t,{p:()=>n});var r=a(95155),s=a(12115),l=a(59434);let n=s.forwardRef((e,t)=>{let{className:a,type:s,...n}=e;return(0,r.jsx)("input",{type:s,className:(0,l.cn)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",a),ref:t,...n})});n.displayName="Input"},66695:(e,t,a)=>{"use strict";a.d(t,{BT:()=>i,Wu:()=>c,ZB:()=>o,Zp:()=>n,aR:()=>d,wL:()=>m});var r=a(95155),s=a(12115),l=a(59434);let n=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,l.cn)("rounded-xl border bg-card text-card-foreground shadow",a),...s})});n.displayName="Card";let d=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,l.cn)("flex flex-col space-y-1.5 p-6",a),...s})});d.displayName="CardHeader";let o=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,l.cn)("font-semibold leading-none tracking-tight",a),...s})});o.displayName="CardTitle";let i=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,l.cn)("text-sm text-muted-foreground",a),...s})});i.displayName="CardDescription";let c=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,l.cn)("p-6 pt-0",a),...s})});c.displayName="CardContent";let m=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{ref:t,className:(0,l.cn)("flex items-center p-6 pt-0",a),...s})});m.displayName="CardFooter"},85057:(e,t,a)=>{"use strict";a.d(t,{J:()=>i});var r=a(95155),s=a(12115),l=a(40968),n=a(74466),d=a(59434);let o=(0,n.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),i=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.b,{ref:t,className:(0,d.cn)(o(),a),...s})});i.displayName=l.b.displayName},85127:(e,t,a)=>{"use strict";a.d(t,{A0:()=>d,BF:()=>o,Hj:()=>i,XI:()=>n,nA:()=>m,nd:()=>c});var r=a(95155),s=a(12115),l=a(59434);let n=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("div",{className:"relative w-full overflow-auto",children:(0,r.jsx)("table",{ref:t,className:(0,l.cn)("w-full caption-bottom text-sm",a),...s})})});n.displayName="Table";let d=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("thead",{ref:t,className:(0,l.cn)("[&_tr]:border-b",a),...s})});d.displayName="TableHeader";let o=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("tbody",{ref:t,className:(0,l.cn)("[&_tr:last-child]:border-0",a),...s})});o.displayName="TableBody",s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("tfoot",{ref:t,className:(0,l.cn)("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",a),...s})}).displayName="TableFooter";let i=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("tr",{ref:t,className:(0,l.cn)("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",a),...s})});i.displayName="TableRow";let c=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("th",{ref:t,className:(0,l.cn)("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",a),...s})});c.displayName="TableHead";let m=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("td",{ref:t,className:(0,l.cn)("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",a),...s})});m.displayName="TableCell",s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("caption",{ref:t,className:(0,l.cn)("mt-4 text-sm text-muted-foreground",a),...s})}).displayName="TableCaption"},85842:(e,t,a)=>{Promise.resolve().then(a.bind(a,31130))},88539:(e,t,a)=>{"use strict";a.d(t,{T:()=>n});var r=a(95155),s=a(12115),l=a(59434);let n=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)("textarea",{className:(0,l.cn)("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",a),ref:t,...s})});n.displayName="Textarea"},91394:(e,t,a)=>{"use strict";a.d(t,{BK:()=>o,eu:()=>d,q5:()=>i});var r=a(95155),s=a(12115),l=a(85977),n=a(59434);let d=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.bL,{ref:t,className:(0,n.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",a),...s})});d.displayName=l.bL.displayName;let o=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l._V,{ref:t,className:(0,n.cn)("aspect-square h-full w-full",a),...s})});o.displayName=l._V.displayName;let i=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(l.H4,{ref:t,className:(0,n.cn)("flex h-full w-full items-center justify-center rounded-full bg-muted",a),...s})});i.displayName=l.H4.displayName}},e=>{var t=t=>e(e.s=t);e.O(0,[9352,652,9764,3411,5521,1859,3201,8441,1684,7358],()=>t(85842)),_N_E=e.O()}]);