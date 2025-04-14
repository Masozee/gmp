"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7143],{17759:(e,t,r)=>{r.d(t,{C5:()=>v,MJ:()=>p,Rr:()=>j,eI:()=>f,lR:()=>h,lV:()=>d,zB:()=>u});var s=r(95155),a=r(12115),n=r(99708),l=r(62177),i=r(59434),o=r(85057);let d=l.Op,c=a.createContext({}),u=e=>{let{...t}=e;return(0,s.jsx)(c.Provider,{value:{name:t.name},children:(0,s.jsx)(l.xI,{...t})})},m=()=>{let e=a.useContext(c),t=a.useContext(x),{getFieldState:r,formState:s}=(0,l.xW)(),n=r(e.name,s);if(!e)throw Error("useFormField should be used within <FormField>");let{id:i}=t;return{id:i,name:e.name,formItemId:"".concat(i,"-form-item"),formDescriptionId:"".concat(i,"-form-item-description"),formMessageId:"".concat(i,"-form-item-message"),...n}},x=a.createContext({}),f=a.forwardRef((e,t)=>{let{className:r,...n}=e,l=a.useId();return(0,s.jsx)(x.Provider,{value:{id:l},children:(0,s.jsx)("div",{ref:t,className:(0,i.cn)("space-y-2",r),...n})})});f.displayName="FormItem";let h=a.forwardRef((e,t)=>{let{className:r,...a}=e,{error:n,formItemId:l}=m();return(0,s.jsx)(o.J,{ref:t,className:(0,i.cn)(n&&"text-destructive",r),htmlFor:l,...a})});h.displayName="FormLabel";let p=a.forwardRef((e,t)=>{let{...r}=e,{error:a,formItemId:l,formDescriptionId:i,formMessageId:o}=m();return(0,s.jsx)(n.DX,{ref:t,id:l,"aria-describedby":a?"".concat(i," ").concat(o):"".concat(i),"aria-invalid":!!a,...r})});p.displayName="FormControl";let j=a.forwardRef((e,t)=>{let{className:r,...a}=e,{formDescriptionId:n}=m();return(0,s.jsx)("p",{ref:t,id:n,className:(0,i.cn)("text-[0.8rem] text-muted-foreground",r),...a})});j.displayName="FormDescription";let v=a.forwardRef((e,t)=>{let{className:r,children:a,...n}=e,{error:l,formMessageId:o}=m(),d=l?String(null==l?void 0:l.message):a;return d?(0,s.jsx)("p",{ref:t,id:o,className:(0,i.cn)("text-[0.8rem] font-medium text-destructive",r),...n,children:d}):null});v.displayName="FormMessage"},26126:(e,t,r)=>{r.d(t,{E:()=>i});var s=r(95155);r(12115);var a=r(74466),n=r(59434);let l=(0,a.F)("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function i(e){let{className:t,variant:r,...a}=e;return(0,s.jsx)("div",{className:(0,n.cn)(l({variant:r}),t),...a})}},30285:(e,t,r)=>{r.d(t,{$:()=>d,r:()=>o});var s=r(95155),a=r(12115),n=r(99708),l=r(74466),i=r(59434);let o=(0,l.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),d=a.forwardRef((e,t)=>{let{className:r,variant:a,size:l,asChild:d=!1,...c}=e,u=d?n.DX:"button";return(0,s.jsx)(u,{className:(0,i.cn)(o({variant:a,size:l,className:r})),ref:t,...c})});d.displayName="Button"},38092:(e,t,r)=>{r.d(t,{o:()=>b});var s=r(95155),a=r(12115),n=r(23129),l=r(77223),i=r(85127),o=r(30285),d=r(62177),c=r(90221),u=r(55594),m=r(54165),x=r(17759),f=r(62523),h=r(55365);let p=u.Ik({email:u.Yj().email(),firstName:u.Yj().min(2).optional(),lastName:u.Yj().min(2).optional()});function j(e){var t,r;let{user:n,open:l,onOpenChange:i,onSuccess:u}=e,[j,v]=(0,a.useState)(null),[g,N]=(0,a.useState)(!1),b=(0,d.mN)({resolver:(0,c.u)(p),defaultValues:{email:n.email,firstName:(null==(t=n.profile)?void 0:t.firstName)||"",lastName:(null==(r=n.profile)?void 0:r.lastName)||""}}),y=async e=>{try{if(N(!0),v(null),!(await fetch("/api/users/".concat(n.id),{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).ok)throw Error("Failed to update user");u(),i(!1)}catch(e){v(e instanceof Error?e.message:"Something went wrong")}finally{N(!1)}};return(0,s.jsx)(m.lG,{open:l,onOpenChange:i,children:(0,s.jsxs)(m.Cf,{children:[(0,s.jsx)(m.c7,{children:(0,s.jsx)(m.L3,{children:"Edit User"})}),(0,s.jsx)(x.lV,{...b,children:(0,s.jsxs)("form",{onSubmit:b.handleSubmit(y),className:"space-y-4",children:[(0,s.jsx)(x.zB,{control:b.control,name:"email",render:e=>{let{field:t}=e;return(0,s.jsxs)(x.eI,{children:[(0,s.jsx)(x.lR,{children:"Email"}),(0,s.jsx)(x.MJ,{children:(0,s.jsx)(f.p,{...t,type:"email"})}),(0,s.jsx)(x.C5,{})]})}}),(0,s.jsx)(x.zB,{control:b.control,name:"firstName",render:e=>{let{field:t}=e;return(0,s.jsxs)(x.eI,{children:[(0,s.jsx)(x.lR,{children:"First Name"}),(0,s.jsx)(x.MJ,{children:(0,s.jsx)(f.p,{...t})}),(0,s.jsx)(x.C5,{})]})}}),(0,s.jsx)(x.zB,{control:b.control,name:"lastName",render:e=>{let{field:t}=e;return(0,s.jsxs)(x.eI,{children:[(0,s.jsx)(x.lR,{children:"Last Name"}),(0,s.jsx)(x.MJ,{children:(0,s.jsx)(f.p,{...t})}),(0,s.jsx)(x.C5,{})]})}}),j&&(0,s.jsx)(h.Fc,{variant:"destructive",children:(0,s.jsx)(h.TN,{children:j})}),(0,s.jsxs)("div",{className:"flex justify-end space-x-2",children:[(0,s.jsx)(o.$,{type:"button",variant:"outline",onClick:()=>i(!1),children:"Cancel"}),(0,s.jsx)(o.$,{type:"submit",disabled:g,children:g?"Saving...":"Save Changes"})]})]})})]})})}function v(e){let{user:t,open:r,onOpenChange:n,onSuccess:l}=e,[i,d]=(0,a.useState)(null),[c,u]=(0,a.useState)(!1),x=async()=>{try{if(u(!0),d(null),!(await fetch("/api/users/".concat(t.id),{method:"DELETE"})).ok)throw Error("Failed to delete user");l(),n(!1)}catch(e){d(e instanceof Error?e.message:"Something went wrong")}finally{u(!1)}};return(0,s.jsx)(m.lG,{open:r,onOpenChange:n,children:(0,s.jsxs)(m.Cf,{children:[(0,s.jsxs)(m.c7,{children:[(0,s.jsx)(m.L3,{children:"Delete User"}),(0,s.jsx)(m.rr,{children:"Are you sure you want to archive this user? This action will not delete the user permanently but will mark them as archived."})]}),i&&(0,s.jsx)(h.Fc,{variant:"destructive",children:(0,s.jsx)(h.TN,{children:i})}),(0,s.jsxs)("div",{className:"flex justify-end space-x-2",children:[(0,s.jsx)(o.$,{type:"button",variant:"outline",onClick:()=>n(!1),children:"Cancel"}),(0,s.jsx)(o.$,{type:"button",variant:"destructive",onClick:x,disabled:c,children:c?"Archiving...":"Archive User"})]})]})})}var g=r(26126),N=r(68856);function b(e){let{searchQuery:t,roleFilter:r,statusFilter:d}=e,[c,u]=(0,a.useState)([]),[m,x]=(0,a.useState)([]),[f,h]=(0,a.useState)(null),[p,b]=(0,a.useState)(!1),[y,w]=(0,a.useState)(!1),[C,R]=(0,a.useState)(!0),[E,F]=(0,a.useState)(null),k=async()=>{try{R(!0),F(null);let e=await fetch("/api/users");if(!e.ok)throw Error("Failed to fetch users");let t=await e.json();u(t)}catch(e){console.error("Failed to fetch users:",e),F("Failed to fetch users")}finally{R(!1)}};return((0,a.useEffect)(()=>{k()},[]),(0,a.useEffect)(()=>{let e=[...c];if(t){let r=t.toLowerCase();e=e.filter(e=>{var t,s,a,n;return e.email.toLowerCase().includes(r)||(null==(s=e.profile)||null==(t=s.firstName)?void 0:t.toLowerCase().includes(r))||(null==(n=e.profile)||null==(a=n.lastName)?void 0:a.toLowerCase().includes(r))})}"all"!==r&&(e=e.filter(e=>e.role.toLowerCase()===r.toLowerCase())),"all"!==d&&(e=e.filter(e=>e.status.toLowerCase()===d.toLowerCase())),x(e)},[c,t,r,d]),E)?(0,s.jsx)("div",{className:"flex min-h-[400px] items-center justify-center rounded-md border border-red-200 bg-red-50 p-8 text-red-500",children:(0,s.jsx)("p",{className:"text-center",children:E})}):C?(0,s.jsx)("div",{className:"space-y-3",children:(0,s.jsxs)(i.XI,{children:[(0,s.jsx)(i.A0,{children:(0,s.jsxs)(i.Hj,{children:[(0,s.jsx)(i.nd,{children:"Name"}),(0,s.jsx)(i.nd,{children:"Email"}),(0,s.jsx)(i.nd,{children:"Role"}),(0,s.jsx)(i.nd,{children:"Status"}),(0,s.jsx)(i.nd,{className:"text-right",children:"Actions"})]})}),(0,s.jsx)(i.BF,{children:[void 0,void 0,void 0,void 0,void 0].map((e,t)=>(0,s.jsxs)(i.Hj,{children:[(0,s.jsx)(i.nA,{children:(0,s.jsx)(N.E,{className:"h-4 w-[100px]"})}),(0,s.jsx)(i.nA,{children:(0,s.jsx)(N.E,{className:"h-4 w-[200px]"})}),(0,s.jsx)(i.nA,{children:(0,s.jsx)(N.E,{className:"h-4 w-[80px]"})}),(0,s.jsx)(i.nA,{children:(0,s.jsx)(N.E,{className:"h-4 w-[80px]"})}),(0,s.jsx)(i.nA,{className:"text-right",children:(0,s.jsx)(N.E,{className:"h-8 w-[80px] ml-auto"})})]},t))})]})}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("div",{className:"relative",children:(0,s.jsxs)(i.XI,{children:[(0,s.jsx)(i.A0,{children:(0,s.jsxs)(i.Hj,{className:"hover:bg-transparent",children:[(0,s.jsx)(i.nd,{className:"w-[200px]",children:"Name"}),(0,s.jsx)(i.nd,{className:"w-[250px]",children:"Email"}),(0,s.jsx)(i.nd,{className:"w-[100px]",children:"Role"}),(0,s.jsx)(i.nd,{className:"w-[100px]",children:"Status"}),(0,s.jsx)(i.nd,{className:"text-right",children:"Actions"})]})}),(0,s.jsx)(i.BF,{children:0===m.length?(0,s.jsx)(i.Hj,{children:(0,s.jsx)(i.nA,{colSpan:5,className:"h-[400px] text-center text-muted-foreground",children:"No users found"})}):m.map(e=>{var t,r;return(0,s.jsxs)(i.Hj,{className:"group",children:[(0,s.jsxs)(i.nA,{className:"font-medium",children:[null==(t=e.profile)?void 0:t.firstName," ",null==(r=e.profile)?void 0:r.lastName]}),(0,s.jsx)(i.nA,{className:"text-muted-foreground",children:e.email}),(0,s.jsx)(i.nA,{children:(0,s.jsx)(g.E,{variant:"ADMIN"===e.role?"default":"secondary",className:"font-medium",children:e.role})}),(0,s.jsx)(i.nA,{children:(0,s.jsx)(g.E,{variant:"ACTIVE"===e.status?"outline":"destructive",className:"font-medium",children:e.status})}),(0,s.jsx)(i.nA,{className:"text-right",children:(0,s.jsxs)("div",{className:"flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100",children:[(0,s.jsx)(o.$,{variant:"ghost",size:"icon",onClick:()=>{h(e),b(!0)},children:(0,s.jsx)(n.A,{className:"h-4 w-4"})}),(0,s.jsx)(o.$,{variant:"ghost",size:"icon",onClick:()=>{h(e),w(!0)},children:(0,s.jsx)(l.A,{className:"h-4 w-4"})})]})})]},e.id)})})]})}),f&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(j,{user:f,open:p,onOpenChange:b,onSuccess:k}),(0,s.jsx)(v,{user:f,open:y,onOpenChange:w,onSuccess:k})]})]})}},43726:(e,t,r)=>{r.d(t,{_:()=>f});var s=r(95155),a=r(12115),n=r(62177),l=r(90221),i=r(55594),o=r(54165),d=r(17759),c=r(62523),u=r(30285),m=r(55365);let x=i.Ik({email:i.Yj().email(),password:i.Yj().min(8),firstName:i.Yj().min(2).optional(),lastName:i.Yj().min(2).optional()});function f(e){let{open:t,onOpenChange:r}=e,[i,f]=(0,a.useState)(null),[h,p]=(0,a.useState)(!1),j=(0,n.mN)({resolver:(0,l.u)(x),defaultValues:{email:"",password:"",firstName:"",lastName:""}}),v=async e=>{try{if(p(!0),f(null),!(await fetch("/api/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).ok)throw Error("Failed to create user");j.reset(),r(!1)}catch(e){f(e instanceof Error?e.message:"Something went wrong")}finally{p(!1)}};return(0,s.jsx)(o.lG,{open:t,onOpenChange:r,children:(0,s.jsxs)(o.Cf,{children:[(0,s.jsx)(o.c7,{children:(0,s.jsx)(o.L3,{children:"Create New User"})}),(0,s.jsx)(d.lV,{...j,children:(0,s.jsxs)("form",{onSubmit:j.handleSubmit(v),className:"space-y-4",children:[(0,s.jsx)(d.zB,{control:j.control,name:"email",render:e=>{let{field:t}=e;return(0,s.jsxs)(d.eI,{children:[(0,s.jsx)(d.lR,{children:"Email"}),(0,s.jsx)(d.MJ,{children:(0,s.jsx)(c.p,{...t,type:"email"})}),(0,s.jsx)(d.C5,{})]})}}),(0,s.jsx)(d.zB,{control:j.control,name:"password",render:e=>{let{field:t}=e;return(0,s.jsxs)(d.eI,{children:[(0,s.jsx)(d.lR,{children:"Password"}),(0,s.jsx)(d.MJ,{children:(0,s.jsx)(c.p,{...t,type:"password"})}),(0,s.jsx)(d.C5,{})]})}}),(0,s.jsx)(d.zB,{control:j.control,name:"firstName",render:e=>{let{field:t}=e;return(0,s.jsxs)(d.eI,{children:[(0,s.jsx)(d.lR,{children:"First Name"}),(0,s.jsx)(d.MJ,{children:(0,s.jsx)(c.p,{...t})}),(0,s.jsx)(d.C5,{})]})}}),(0,s.jsx)(d.zB,{control:j.control,name:"lastName",render:e=>{let{field:t}=e;return(0,s.jsxs)(d.eI,{children:[(0,s.jsx)(d.lR,{children:"Last Name"}),(0,s.jsx)(d.MJ,{children:(0,s.jsx)(c.p,{...t})}),(0,s.jsx)(d.C5,{})]})}}),i&&(0,s.jsx)(m.Fc,{variant:"destructive",children:(0,s.jsx)(m.TN,{children:i})}),(0,s.jsxs)("div",{className:"flex justify-end space-x-2",children:[(0,s.jsx)(u.$,{type:"button",variant:"outline",onClick:()=>r(!1),children:"Cancel"}),(0,s.jsx)(u.$,{type:"submit",disabled:h,children:h?"Creating...":"Create User"})]})]})})]})})}},54165:(e,t,r)=>{r.d(t,{Cf:()=>m,Es:()=>f,L3:()=>h,c7:()=>x,lG:()=>o,rr:()=>p,zM:()=>d});var s=r(95155),a=r(12115),n=r(15452),l=r(25318),i=r(59434);let o=n.bL,d=n.l9,c=n.ZL;n.bm;let u=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)(n.hJ,{ref:t,className:(0,i.cn)("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",r),...a})});u.displayName=n.hJ.displayName;let m=a.forwardRef((e,t)=>{let{className:r,children:a,...o}=e;return(0,s.jsxs)(c,{children:[(0,s.jsx)(u,{}),(0,s.jsxs)(n.UC,{ref:t,className:(0,i.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",r),...o,children:[a,(0,s.jsxs)(n.bm,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[(0,s.jsx)(l.A,{className:"h-4 w-4"}),(0,s.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})});m.displayName=n.UC.displayName;let x=e=>{let{className:t,...r}=e;return(0,s.jsx)("div",{className:(0,i.cn)("flex flex-col space-y-1.5 text-center sm:text-left",t),...r})};x.displayName="DialogHeader";let f=e=>{let{className:t,...r}=e;return(0,s.jsx)("div",{className:(0,i.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",t),...r})};f.displayName="DialogFooter";let h=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)(n.hE,{ref:t,className:(0,i.cn)("text-lg font-semibold leading-none tracking-tight",r),...a})});h.displayName=n.hE.displayName;let p=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)(n.VY,{ref:t,className:(0,i.cn)("text-sm text-muted-foreground",r),...a})});p.displayName=n.VY.displayName},55365:(e,t,r)=>{r.d(t,{Fc:()=>o,TN:()=>d});var s=r(95155),a=r(12115),n=r(74466),l=r(59434);let i=(0,n.F)("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",{variants:{variant:{default:"bg-background text-foreground",destructive:"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"}},defaultVariants:{variant:"default"}}),o=a.forwardRef((e,t)=>{let{className:r,variant:a,...n}=e;return(0,s.jsx)("div",{ref:t,role:"alert",className:(0,l.cn)(i({variant:a}),r),...n})});o.displayName="Alert",a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("h5",{ref:t,className:(0,l.cn)("mb-1 font-medium leading-none tracking-tight",r),...a})}).displayName="AlertTitle";let d=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("div",{ref:t,className:(0,l.cn)("text-sm [&_p]:leading-relaxed",r),...a})});d.displayName="AlertDescription"},59434:(e,t,r)=>{r.d(t,{cn:()=>n});var s=r(52596),a=r(39688);function n(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return(0,a.QP)((0,s.$)(t))}},62523:(e,t,r)=>{r.d(t,{p:()=>l});var s=r(95155),a=r(12115),n=r(59434);let l=a.forwardRef((e,t)=>{let{className:r,type:a,...l}=e;return(0,s.jsx)("input",{type:a,className:(0,n.cn)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",r),ref:t,...l})});l.displayName="Input"},68856:(e,t,r)=>{r.d(t,{E:()=>n});var s=r(95155),a=r(59434);function n(e){let{className:t,...r}=e;return(0,s.jsx)("div",{className:(0,a.cn)("animate-pulse rounded-md bg-primary/10",t),...r})}},85057:(e,t,r)=>{r.d(t,{J:()=>d});var s=r(95155),a=r(12115),n=r(40968),l=r(74466),i=r(59434);let o=(0,l.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),d=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)(n.b,{ref:t,className:(0,i.cn)(o(),r),...a})});d.displayName=n.b.displayName},85127:(e,t,r)=>{r.d(t,{A0:()=>i,BF:()=>o,Hj:()=>d,XI:()=>l,nA:()=>u,nd:()=>c});var s=r(95155),a=r(12115),n=r(59434);let l=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("div",{className:"relative w-full overflow-auto",children:(0,s.jsx)("table",{ref:t,className:(0,n.cn)("w-full caption-bottom text-sm",r),...a})})});l.displayName="Table";let i=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("thead",{ref:t,className:(0,n.cn)("[&_tr]:border-b",r),...a})});i.displayName="TableHeader";let o=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("tbody",{ref:t,className:(0,n.cn)("[&_tr:last-child]:border-0",r),...a})});o.displayName="TableBody",a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("tfoot",{ref:t,className:(0,n.cn)("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",r),...a})}).displayName="TableFooter";let d=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("tr",{ref:t,className:(0,n.cn)("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",r),...a})});d.displayName="TableRow";let c=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("th",{ref:t,className:(0,n.cn)("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",r),...a})});c.displayName="TableHead";let u=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("td",{ref:t,className:(0,n.cn)("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",r),...a})});u.displayName="TableCell",a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("caption",{ref:t,className:(0,n.cn)("mt-4 text-sm text-muted-foreground",r),...a})}).displayName="TableCaption"}}]);