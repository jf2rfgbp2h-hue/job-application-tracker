(function(){
var KEY='giftJobApplicationsV1';
var apps=[];

var demoApps=[
{
id:'demo1',
company:'NovaTech Solutions',
role:'Junior Software Developer',
location:'Johannesburg, Gauteng',
status:'Applied',
date:'2026-09-15',
followup:'2026-09-29',
salary:'R20,000/month',
url:'',
notes:'Submitted tailored CV and application.'
},
{
id:'demo2',
company:'ByteWave Technologies',
role:'Graduate Software Developer',
location:'Pretoria, Gauteng',
status:'Interview',
date:'2026-09-08',
followup:'2026-09-24',
salary:'R22,000/month',
url:'',
notes:'Invited to first-round technical interview.'
},
{
id:'demo3',
company:'CodeSphere Africa',
role:'Junior Backend Developer',
location:'Johannesburg, Gauteng',
status:'Offer',
date:'2026-08-25',
followup:'',
salary:'R24,000/month',
url:'',
notes:'Received employment offer after final interview.'
},
{
id:'demo4',
company:'Vertex Digital',
role:'Junior Full-Stack Developer',
location:'Remote',
status:'Rejected',
date:'2026-08-18',
followup:'',
salary:'R21,000/month',
url:'',
notes:'Application unsuccessful after initial screening.'
}
];

function el(id){
return document.getElementById(id)
}

function load(){
try{
var stored=localStorage.getItem(KEY);

if(stored===null){
apps=demoApps;
localStorage.setItem(KEY,JSON.stringify(apps));
}else{
apps=JSON.parse(stored);
}
}catch(e){
apps=demoApps;
}
render()
}

function save(){
localStorage.setItem(KEY,JSON.stringify(apps));
render()
}

function esc(s){
var d=document.createElement('div');
d.appendChild(document.createTextNode(s||''));
return d.innerHTML
}

function render(){
var q=el('search').value.toLowerCase(),f=el('filter').value;

var list=apps.filter(function(a){
return(!f||a.status===f)&&
((a.company+' '+a.role+' '+a.location).toLowerCase().indexOf(q)>-1)
});

el('total').innerHTML=apps.length;
el('applied').innerHTML=apps.filter(function(a){return a.status==='Applied'}).length;
el('interview').innerHTML=apps.filter(function(a){return a.status==='Interview'}).length;
el('offer').innerHTML=apps.filter(function(a){return a.status==='Offer'}).length;

el('empty').className=list.length?'empty hidden':'empty';

var html='';

list.sort(function(a,b){
return(b.date||'').localeCompare(a.date||'')
}).forEach(function(a){

html+='<article class="card">'+
'<span class="badge">'+esc(a.status)+'</span>'+
'<h3>'+esc(a.role)+'</h3>'+
'<div class="muted">'+esc(a.company)+(a.location?' · '+esc(a.location):'')+'</div>'+
'<div class="meta">'+
(a.date?'<b>Applied:</b> '+esc(a.date)+'<br>':'')+
(a.followup?'<b>Follow up:</b> '+esc(a.followup)+'<br>':'')+
(a.salary?'<b>Salary:</b> '+esc(a.salary)+'<br>':'')+
(a.notes?'<b>Notes:</b> '+esc(a.notes):'')+
'</div>'+
'<div class="cardActions">'+
'<button onclick="window.editApp(\''+a.id+'\')">Edit</button>'+
'<button class="danger" onclick="window.deleteApp(\''+a.id+'\')">Delete</button>'+
(a.url?'<button class="secondary" onclick="window.open(\''+
a.url.replace(/'/g,'')+'\',\'_blank\')">Job Link</button>':'')+
'</div></article>'
});

el('cards').innerHTML=html
}

function openForm(a){
el('form').reset();
el('id').value=a?a.id:'';

['company','role','location','status','date','followup','salary','url','notes']
.forEach(function(k){
if(a&&a[k]!=null)el(k).value=a[k]
});

el('formTitle').innerHTML=a?'Edit Application':'Add Application';
el('modal').className='modal'
}

function close(){
el('modal').className='modal hidden'
}

el('addBtn').onclick=function(){
openForm(null)
};

el('closeBtn').onclick=close;
el('cancelBtn').onclick=close;
el('search').onkeyup=render;
el('filter').onchange=render;

el('form').onsubmit=function(e){
e.preventDefault();

var a={
id:el('id').value||('a'+new Date().getTime()),
company:el('company').value.trim(),
role:el('role').value.trim(),
location:el('location').value.trim(),
status:el('status').value,
date:el('date').value,
followup:el('followup').value,
salary:el('salary').value.trim(),
url:el('url').value.trim(),
notes:el('notes').value.trim()
};

var found=false;

apps=apps.map(function(x){
if(x.id===a.id){
found=true;
return a
}
return x
});

if(!found)apps.push(a);

save();
close()
};

window.editApp=function(id){
for(var i=0;i<apps.length;i++)
if(apps[i].id===id)return openForm(apps[i])
};

window.deleteApp=function(id){
if(confirm('Delete this application?')){
apps=apps.filter(function(a){
return a.id!==id
});
save()
}
};

el('exportBtn').onclick=function(){
var blob=new Blob(
[JSON.stringify(apps,null,2)],
{type:'application/json'}
);

var u=URL.createObjectURL(blob),
a=document.createElement('a');

a.href=u;
a.download='job-applications-backup.json';
a.click();

setTimeout(function(){
URL.revokeObjectURL(u)
},1000)
};

el('importFile').onchange=function(e){
var file=e.target.files[0];

if(!file)return;

var r=new FileReader();

r.onload=function(){
try{
var data=JSON.parse(r.result);

if(!(data instanceof Array))throw 0;

if(confirm('Replace current tracker data with this backup?')){
apps=data;
save()
}
}catch(x){
alert('That file is not a valid tracker backup.')
}
};

r.readAsText(file)
};

load()
})();
