(()=>{'use strict';
const endpoint='https://fp-1.info/api/nintei-consultation/';
const receipt=document.querySelector('#receipt-id');
if(receipt){const id=new URLSearchParams(location.search).get('id');if(id&&/^[a-f0-9]{32}$/.test(id))receipt.textContent='受付番号：'+id;}
const form=document.querySelector('#contact-form');if(!form)return;
const result=document.querySelector('#contact-result'),button=document.querySelector('#contact-submit');
let token='',tokenAt=0,requestId=crypto.randomUUID().replaceAll('-','');
async function prepare(){const response=await fetch(endpoint+'?action=token',{mode:'cors',cache:'no-store'});const data=await response.json();if(!response.ok||!data.token)throw Error('受付の準備ができませんでした。時間をおいて再度お試しください。');token=data.token;tokenAt=Date.now();}
const ready=prepare().catch(()=>{});
form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;button.disabled=true;button.textContent='送信しています…';result.className='';result.textContent='';try{await ready;if(!token||Date.now()-tokenAt>1500000)await prepare();const delay=2100-(Date.now()-tokenAt);if(delay>0)await new Promise(resolve=>setTimeout(resolve,delay));const fields=Object.fromEntries(new FormData(form));const response=await fetch(endpoint,{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({...fields,token,request_id:requestId})});const data=await response.json();if(!response.ok||!data.ok)throw Error(data.message||'送信できませんでした。入力内容はそのままで、再度お試しください。');location.assign('thanks.html?id='+encodeURIComponent(data.receipt));}catch(error){result.className='form-error';result.textContent=error.message||'通信できませんでした。時間をおいて再度お試しください。';result.setAttribute('tabindex','-1');result.focus();button.disabled=false;button.textContent='個別相談を申し込む';}});
button.disabled=false;
})();
