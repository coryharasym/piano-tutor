import {listener} from './listen.js';
// One private take at a time. Export explicitly; no audio goes into backups or uploads.
export function mountRecorder(root) {
 root.innerHTML='<p>Choose one listening question: clear melody, steady pulse, or clean releases. Record up to 90 seconds, listen, then try one change. Takes stay in this view until you download them; leaving discards the audio.</p><div class="lab-actions"><button class="btn" data-record>Start recording</button><button class="pill" data-stop-record disabled>Stop recording</button></div><p role="status" data-record-status></p><div data-take></div>';
 const start=root.querySelector('[data-record]'),stop=root.querySelector('[data-stop-record]'),status=root.querySelector('[data-record-status]');
 let recorder,stream,owned=false,url,timer,disposed=false,request=0;
 const release=()=>{if(owned)stream?.getTracks().forEach(t=>t.stop());stream=null;owned=false;};
 const stopTake=()=>{clearTimeout(timer);if(recorder?.state==='recording')recorder.stop();};
 start.onclick=async()=>{
  if(!globalThis.MediaRecorder||!navigator.mediaDevices?.getUserMedia){status.textContent='Recording is unavailable in this browser. Use your phone’s recorder, then return to your practice note.';return;}
  const token=++request;start.disabled=true;status.textContent='Requesting microphone…';
  try {
   const shared=listener.active&&listener.stream;
   const input=shared||await navigator.mediaDevices.getUserMedia({audio:true});
   if(disposed||token!==request){if(!shared)input.getTracks().forEach(t=>t.stop());return;}
   stream=input;owned=!shared;const parts=[];
   const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(m=>MediaRecorder.isTypeSupported?.(m));
   recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
   recorder.ondataavailable=e=>{if(e.data.size)parts.push(e.data);};
   recorder.onstop=()=>{
    clearTimeout(timer);release();if(disposed)return;
    start.disabled=false;stop.disabled=true;
    if(!parts.length){status.textContent='No audio captured. Try again.';return;}
    if(url)URL.revokeObjectURL(url);const blob=new Blob(parts,{type:recorder.mimeType||parts[0].type});url=URL.createObjectURL(blob);
    const take=root.querySelector('[data-take]');take.replaceChildren();const audio=document.createElement('audio');audio.controls=true;audio.src=url;audio.setAttribute('aria-label','Your recorded take');
    const download=document.createElement('a');download.href=url;download.download='piano-practice.'+(blob.type.includes('mp4')?'m4a':'webm');download.textContent='Download this take';download.className='pill';take.append(audio,download);
    status.textContent='Listen once for your question. Choose one repair before another take.';
   };
   recorder.onerror=()=>{stopTake();release();start.disabled=false;stop.disabled=true;status.textContent='Recording failed. Try your phone’s recorder.';};
   recorder.start();stop.disabled=false;status.textContent='Recording… play your piano. Automatic stop after 90 seconds.';timer=setTimeout(stopTake,90000);
  } catch {release();if(!disposed){start.disabled=false;stop.disabled=true;status.textContent='Could not record. Check microphone permission, or use your phone’s recorder.';}}
 };
 stop.onclick=stopTake;
 return()=>{disposed=true;request++;stopTake();release();if(url)URL.revokeObjectURL(url);};
}
