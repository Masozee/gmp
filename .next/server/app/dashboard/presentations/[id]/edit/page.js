(()=>{var e={};e.id=6240,e.ids=[6240],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3302:(e,t,s)=>{Promise.resolve().then(s.bind(s,65570))},6488:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>w});var r=s(60687),a=s(43210),n=s.n(a),i=s(16189),d=s(27605),l=s(63442),o=s(45880),c=s(29523),p=s(35950),m=s(20140),x=s(71669),h=s(15079),u=s(89667),f=s(34729),j=s(44493),v=s(55817),g=s(52579),b=s(85726);let y=o.z.object({title:o.z.string().min(1,{message:"Title is required"}),abstract:o.z.string().optional(),speakerId:o.z.string().min(1,{message:"Speaker is required"}),eventId:o.z.string().optional(),videoUrl:o.z.string().url({message:"Must be a valid URL"}).optional().or(o.z.literal("")),duration:o.z.coerce.number().int().positive().optional(),startTime:o.z.string().optional(),endTime:o.z.string().optional()});function w({params:e}){let t=n().use(e).id,s=(0,i.useRouter)(),{toast:o}=(0,m.d)(),[w,N]=(0,a.useState)([]),[R,C]=(0,a.useState)([]),[k,P]=(0,a.useState)(null),[I,z]=(0,a.useState)(!0),[T,E]=(0,a.useState)(!1),[A,M]=(0,a.useState)(null),[S,U]=(0,a.useState)(null),[q,F]=(0,a.useState)(null),_=(0,d.mN)({resolver:(0,l.u)(y),defaultValues:{title:"",abstract:"",speakerId:"",eventId:"",videoUrl:"",duration:void 0,startTime:"",endTime:""}}),J=async e=>{E(!0);try{let r=new FormData;r.append("title",e.title),e.abstract&&r.append("abstract",e.abstract),r.append("speakerId",e.speakerId),e.eventId&&r.append("eventId",e.eventId),e.videoUrl&&r.append("videoUrl",e.videoUrl),e.duration&&r.append("duration",String(e.duration)),e.startTime&&r.append("startTime",e.startTime),e.endTime&&r.append("endTime",e.endTime),S&&r.append("slides",S);let a=await fetch(`/api/presentations/${t}`,{method:"PATCH",body:r});if(!a.ok){let e=await a.json();throw Error(e.error||"Failed to update presentation")}o({title:"Success",description:"Presentation updated successfully"}),s.push(`/dashboard/presentations/${t}`)}catch(e){console.error("Error updating presentation:",e),o({title:"Error",description:e instanceof Error?e.message:"Failed to update presentation",variant:"destructive"})}finally{E(!1)}};return I?(0,r.jsxs)("div",{className:"space-y-6",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between",children:[(0,r.jsx)(b.E,{className:"h-10 w-1/3"}),(0,r.jsx)(b.E,{className:"h-10 w-20"})]}),(0,r.jsx)(p.w,{}),(0,r.jsxs)(j.Zp,{children:[(0,r.jsxs)(j.aR,{children:[(0,r.jsx)(b.E,{className:"h-8 w-1/4"}),(0,r.jsx)(b.E,{className:"h-4 w-1/3"})]}),(0,r.jsxs)(j.Wu,{className:"space-y-6",children:[(0,r.jsx)("div",{className:"grid grid-cols-1 gap-6 md:grid-cols-2",children:[...Array(6)].map((e,t)=>(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsx)(b.E,{className:"h-4 w-1/4"}),(0,r.jsx)(b.E,{className:"h-10 w-full"})]},t))}),(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsx)(b.E,{className:"h-4 w-1/4"}),(0,r.jsx)(b.E,{className:"h-32 w-full"})]})]}),(0,r.jsx)(j.wL,{children:(0,r.jsx)(b.E,{className:"h-10 w-1/4 ml-auto"})})]})]}):A||!k?(0,r.jsx)("div",{className:"flex h-[400px] items-center justify-center",children:(0,r.jsxs)("div",{className:"text-center",children:[(0,r.jsx)("h3",{className:"mt-4 text-lg font-semibold",children:A||"Presentation not found"}),(0,r.jsx)("p",{className:"text-muted-foreground mb-4",children:"The requested presentation could not be found or loaded."}),(0,r.jsxs)(c.$,{variant:"outline",onClick:()=>s.push("/dashboard/presentations"),children:[(0,r.jsx)(v.A,{className:"mr-2 h-4 w-4"}),"Back to Presentations"]})]})}):(0,r.jsxs)("div",{className:"space-y-6",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between",children:[(0,r.jsxs)("div",{className:"space-y-1",children:[(0,r.jsx)("h1",{className:"text-3xl font-bold tracking-tight",children:"Edit Presentation"}),(0,r.jsx)("p",{className:"text-muted-foreground",children:"Update presentation details"})]}),(0,r.jsxs)(c.$,{variant:"outline",onClick:()=>s.back(),children:[(0,r.jsx)(v.A,{className:"mr-2 h-4 w-4"}),"Back"]})]}),(0,r.jsx)(p.w,{}),(0,r.jsxs)(j.Zp,{children:[(0,r.jsxs)(j.aR,{children:[(0,r.jsx)(j.ZB,{children:"Presentation Details"}),(0,r.jsx)(j.BT,{children:"Edit the details of your presentation"})]}),(0,r.jsx)(j.Wu,{children:(0,r.jsx)(x.lV,{..._,children:(0,r.jsxs)("form",{onSubmit:_.handleSubmit(J),className:"space-y-6",children:[(0,r.jsxs)("div",{className:"grid grid-cols-1 gap-6 md:grid-cols-2",children:[(0,r.jsx)(x.zB,{control:_.control,name:"title",render:({field:e})=>(0,r.jsxs)(x.eI,{children:[(0,r.jsx)(x.lR,{children:"Title"}),(0,r.jsx)(x.MJ,{children:(0,r.jsx)(u.p,{placeholder:"Presentation title",...e})}),(0,r.jsx)(x.C5,{})]})}),(0,r.jsx)(x.zB,{control:_.control,name:"speakerId",render:({field:e})=>(0,r.jsxs)(x.eI,{children:[(0,r.jsx)(x.lR,{children:"Speaker"}),(0,r.jsxs)(h.l6,{onValueChange:e.onChange,defaultValue:e.value,children:[(0,r.jsx)(x.MJ,{children:(0,r.jsx)(h.bq,{children:(0,r.jsx)(h.yv,{placeholder:"Select a speaker"})})}),(0,r.jsx)(h.gC,{children:w.map(e=>(0,r.jsxs)(h.eb,{value:e.id,children:[e.firstName," ",e.lastName,e.organization&&` (${e.organization})`]},e.id))})]}),(0,r.jsx)(x.C5,{})]})}),(0,r.jsx)(x.zB,{control:_.control,name:"eventId",render:({field:e})=>(0,r.jsxs)(x.eI,{children:[(0,r.jsx)(x.lR,{children:"Event (Optional)"}),(0,r.jsxs)(h.l6,{onValueChange:e.onChange,defaultValue:e.value,children:[(0,r.jsx)(x.MJ,{children:(0,r.jsx)(h.bq,{children:(0,r.jsx)(h.yv,{placeholder:"Select an event (optional)"})})}),(0,r.jsxs)(h.gC,{children:[(0,r.jsx)(h.eb,{value:"",children:"None"}),R.map(e=>(0,r.jsx)(h.eb,{value:e.id,children:e.title},e.id))]})]}),(0,r.jsx)(x.Rr,{children:"Associate this presentation with an event"}),(0,r.jsx)(x.C5,{})]})}),(0,r.jsx)(x.zB,{control:_.control,name:"duration",render:({field:e})=>(0,r.jsxs)(x.eI,{children:[(0,r.jsx)(x.lR,{children:"Duration (minutes)"}),(0,r.jsx)(x.MJ,{children:(0,r.jsx)(u.p,{type:"number",placeholder:"Duration in minutes",...e,value:e.value||"",onChange:t=>{let s=""===t.target.value?void 0:parseInt(t.target.value);e.onChange(s)}})}),(0,r.jsx)(x.Rr,{children:"How long is the presentation"}),(0,r.jsx)(x.C5,{})]})}),(0,r.jsx)(x.zB,{control:_.control,name:"startTime",render:({field:e})=>(0,r.jsxs)(x.eI,{children:[(0,r.jsx)(x.lR,{children:"Start Time"}),(0,r.jsx)(x.MJ,{children:(0,r.jsx)(u.p,{type:"datetime-local",...e})}),(0,r.jsx)(x.Rr,{children:"When does the presentation start"}),(0,r.jsx)(x.C5,{})]})}),(0,r.jsx)(x.zB,{control:_.control,name:"endTime",render:({field:e})=>(0,r.jsxs)(x.eI,{children:[(0,r.jsx)(x.lR,{children:"End Time"}),(0,r.jsx)(x.MJ,{children:(0,r.jsx)(u.p,{type:"datetime-local",...e})}),(0,r.jsx)(x.Rr,{children:"When does the presentation end"}),(0,r.jsx)(x.C5,{})]})}),(0,r.jsx)(x.zB,{control:_.control,name:"videoUrl",render:({field:e})=>(0,r.jsxs)(x.eI,{children:[(0,r.jsx)(x.lR,{children:"Video URL"}),(0,r.jsx)(x.MJ,{children:(0,r.jsx)(u.p,{placeholder:"https://www.youtube.com/watch?v=...",...e})}),(0,r.jsx)(x.Rr,{children:"Link to a recorded video of the presentation"}),(0,r.jsx)(x.C5,{})]})}),(0,r.jsx)("div",{children:(0,r.jsxs)(x.eI,{children:[(0,r.jsx)(x.lR,{children:"Slides"}),(0,r.jsx)(x.MJ,{children:(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsx)(u.p,{type:"file",accept:".pdf,.ppt,.pptx,.key",onChange:e=>{e.target.files&&e.target.files[0]&&U(e.target.files[0])}}),q&&!S&&(0,r.jsxs)("div",{className:"text-sm text-muted-foreground",children:["Current file: ",q.split("/").pop(),(0,r.jsx)(c.$,{variant:"link",className:"h-auto p-0 ml-2",onClick:()=>window.open(q,"_blank"),children:"View"})]}),S&&(0,r.jsxs)("div",{className:"text-sm text-muted-foreground",children:["New file selected: ",S.name]})]})}),(0,r.jsx)(x.Rr,{children:"Upload new presentation slides (PDF, PowerPoint, Keynote)"})]})})]}),(0,r.jsx)(x.zB,{control:_.control,name:"abstract",render:({field:e})=>(0,r.jsxs)(x.eI,{children:[(0,r.jsx)(x.lR,{children:"Abstract"}),(0,r.jsx)(x.MJ,{children:(0,r.jsx)(f.T,{placeholder:"Write a summary of the presentation...",className:"min-h-[120px]",...e})}),(0,r.jsx)(x.Rr,{children:"A brief description of what the presentation is about"}),(0,r.jsx)(x.C5,{})]})}),(0,r.jsx)(j.wL,{className:"flex justify-end px-0 pb-0",children:(0,r.jsxs)("div",{className:"flex gap-2",children:[(0,r.jsx)(c.$,{type:"button",variant:"outline",onClick:()=>s.push(`/dashboard/presentations/${t}`),disabled:T,children:"Cancel"}),(0,r.jsxs)(c.$,{type:"submit",disabled:T,children:[T&&(0,r.jsx)(g.A,{className:"mr-2 h-4 w-4 animate-spin"}),"Save Changes"]})]})})]})})})]})]})}},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},15079:(e,t,s)=>{"use strict";s.d(t,{bq:()=>m,eb:()=>f,gC:()=>u,l6:()=>c,yv:()=>p});var r=s(60687),a=s(43210),n=s(22670),i=s(61662),d=s(89743),l=s(58450),o=s(4780);let c=n.bL;n.YJ;let p=n.WT,m=a.forwardRef(({className:e,children:t,...s},a)=>(0,r.jsxs)(n.l9,{ref:a,className:(0,o.cn)("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",e),...s,children:[t,(0,r.jsx)(n.In,{asChild:!0,children:(0,r.jsx)(i.A,{className:"h-4 w-4 opacity-50"})})]}));m.displayName=n.l9.displayName;let x=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)(n.PP,{ref:s,className:(0,o.cn)("flex cursor-default items-center justify-center py-1",e),...t,children:(0,r.jsx)(d.A,{className:"h-4 w-4"})}));x.displayName=n.PP.displayName;let h=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)(n.wn,{ref:s,className:(0,o.cn)("flex cursor-default items-center justify-center py-1",e),...t,children:(0,r.jsx)(i.A,{className:"h-4 w-4"})}));h.displayName=n.wn.displayName;let u=a.forwardRef(({className:e,children:t,position:s="popper",...a},i)=>(0,r.jsx)(n.ZL,{children:(0,r.jsxs)(n.UC,{ref:i,className:(0,o.cn)("relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]","popper"===s&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",e),position:s,...a,children:[(0,r.jsx)(x,{}),(0,r.jsx)(n.LM,{className:(0,o.cn)("p-1","popper"===s&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:t}),(0,r.jsx)(h,{})]})}));u.displayName=n.UC.displayName,a.forwardRef(({className:e,...t},s)=>(0,r.jsx)(n.JU,{ref:s,className:(0,o.cn)("px-2 py-1.5 text-sm font-semibold",e),...t})).displayName=n.JU.displayName;let f=a.forwardRef(({className:e,children:t,...s},a)=>(0,r.jsxs)(n.q7,{ref:a,className:(0,o.cn)("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",e),...s,children:[(0,r.jsx)("span",{className:"absolute right-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,r.jsx)(n.VF,{children:(0,r.jsx)(l.A,{className:"h-4 w-4"})})}),(0,r.jsx)(n.p4,{children:t})]}));f.displayName=n.q7.displayName,a.forwardRef(({className:e,...t},s)=>(0,r.jsx)(n.wv,{ref:s,className:(0,o.cn)("-mx-1 my-1 h-px bg-muted",e),...t})).displayName=n.wv.displayName},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},20140:(e,t,s)=>{"use strict";s.d(t,{d:()=>a,o:()=>r.oR});var r=s(52581);function a(){return{toast:({title:e,description:t,variant:s="default",duration:a=3e3,...n})=>(0,r.oR)(e||t||"",{description:e?t:void 0,duration:a,className:"destructive"===s?"destructive":"",...n})}}},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34729:(e,t,s)=>{"use strict";s.d(t,{T:()=>i});var r=s(60687),a=s(43210),n=s(4780);let i=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)("textarea",{className:(0,n.cn)("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),ref:s,...t}));i.displayName="Textarea"},47369:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>i.a,__next_app__:()=>p,pages:()=>c,routeModule:()=>m,tree:()=>o});var r=s(65239),a=s(48088),n=s(88170),i=s.n(n),d=s(30893),l={};for(let e in d)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>d[e]);s.d(t,l);let o={children:["",{children:["dashboard",{children:["presentations",{children:["[id]",{children:["edit",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,65570)),"/Users/pro/Dev/gmp/src/app/dashboard/presentations/[id]/edit/page.tsx"]}]},{}]},{}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,63144)),"/Users/pro/Dev/gmp/src/app/dashboard/layout.tsx"],metadata:{icon:[async e=>(await Promise.resolve().then(s.bind(s,70440))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(s.bind(s,61137)),"/Users/pro/Dev/gmp/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,57398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(s.t.bind(s,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(s.t.bind(s,65284,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(s.bind(s,70440))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]}.children,c=["/Users/pro/Dev/gmp/src/app/dashboard/presentations/[id]/edit/page.tsx"],p={require:s,loadChunk:()=>Promise.resolve()},m=new r.AppPageRouteModule({definition:{kind:a.RouteKind.APP_PAGE,page:"/dashboard/presentations/[id]/edit/page",pathname:"/dashboard/presentations/[id]/edit",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:o}})},52579:(e,t,s)=>{"use strict";s.d(t,{A:()=>r});let r=(0,s(82614).A)("Loader",[["path",{d:"M12 2v4",key:"3427ic"}],["path",{d:"m16.2 7.8 2.9-2.9",key:"r700ao"}],["path",{d:"M18 12h4",key:"wj9ykh"}],["path",{d:"m16.2 16.2 2.9 2.9",key:"1bxg5t"}],["path",{d:"M12 18v4",key:"jadmvz"}],["path",{d:"m4.9 19.1 2.9-2.9",key:"bwix9q"}],["path",{d:"M2 12h4",key:"j09sii"}],["path",{d:"m4.9 4.9 2.9 2.9",key:"giyufr"}]])},55817:(e,t,s)=>{"use strict";s.d(t,{A:()=>r});let r=(0,s(82614).A)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},65570:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});let r=(0,s(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/pro/Dev/gmp/src/app/dashboard/presentations/[id]/edit/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/pro/Dev/gmp/src/app/dashboard/presentations/[id]/edit/page.tsx","default")},71669:(e,t,s)=>{"use strict";s.d(t,{C5:()=>v,MJ:()=>f,Rr:()=>j,eI:()=>h,lR:()=>u,lV:()=>o,zB:()=>p});var r=s(60687),a=s(43210),n=s(8730),i=s(27605),d=s(4780),l=s(80013);let o=i.Op,c=a.createContext({}),p=({...e})=>(0,r.jsx)(c.Provider,{value:{name:e.name},children:(0,r.jsx)(i.xI,{...e})}),m=()=>{let e=a.useContext(c),t=a.useContext(x),{getFieldState:s,formState:r}=(0,i.xW)(),n=s(e.name,r);if(!e)throw Error("useFormField should be used within <FormField>");let{id:d}=t;return{id:d,name:e.name,formItemId:`${d}-form-item`,formDescriptionId:`${d}-form-item-description`,formMessageId:`${d}-form-item-message`,...n}},x=a.createContext({}),h=a.forwardRef(({className:e,...t},s)=>{let n=a.useId();return(0,r.jsx)(x.Provider,{value:{id:n},children:(0,r.jsx)("div",{ref:s,className:(0,d.cn)("space-y-2",e),...t})})});h.displayName="FormItem";let u=a.forwardRef(({className:e,...t},s)=>{let{error:a,formItemId:n}=m();return(0,r.jsx)(l.J,{ref:s,className:(0,d.cn)(a&&"text-destructive",e),htmlFor:n,...t})});u.displayName="FormLabel";let f=a.forwardRef(({...e},t)=>{let{error:s,formItemId:a,formDescriptionId:i,formMessageId:d}=m();return(0,r.jsx)(n.DX,{ref:t,id:a,"aria-describedby":s?`${i} ${d}`:`${i}`,"aria-invalid":!!s,...e})});f.displayName="FormControl";let j=a.forwardRef(({className:e,...t},s)=>{let{formDescriptionId:a}=m();return(0,r.jsx)("p",{ref:s,id:a,className:(0,d.cn)("text-[0.8rem] text-muted-foreground",e),...t})});j.displayName="FormDescription";let v=a.forwardRef(({className:e,children:t,...s},a)=>{let{error:n,formMessageId:i}=m(),l=n?String(n?.message):t;return l?(0,r.jsx)("p",{ref:a,id:i,className:(0,d.cn)("text-[0.8rem] font-medium text-destructive",e),...s,children:l}):null});v.displayName="FormMessage"},79551:e=>{"use strict";e.exports=require("url")},80013:(e,t,s)=>{"use strict";s.d(t,{J:()=>o});var r=s(60687),a=s(43210),n=s(78148),i=s(24224),d=s(4780);let l=(0,i.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),o=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)(n.b,{ref:s,className:(0,d.cn)(l(),e),...t}));o.displayName=n.b.displayName},89390:(e,t,s)=>{Promise.resolve().then(s.bind(s,6488))}};var t=require("../../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[4447,163,5767,7210,6460,8749,9882,1758,2729,6282,4030],()=>s(47369));module.exports=r})();