"""Convert the retained public-domain absolute-pitch LilyPond voices, not guessed melodies."""
import json,re,pathlib,hashlib
root=pathlib.Path(__file__).resolve().parents[1]
specs=[('eventide','Abide with Me','C','4/4',0,-3,1),('blessed_assurance','Blessed Assurance','C','9/8',1.5,-2,1),('woodworth','Just As I Am','C','6/4',1,-2,1),('nettleton','Come Thou Fount','D','3/4',1,-1,1),('villeduh','It Is Well with My Soul','C','4/4',1,-1,1),('Diademata','Crown Him with Many Crowns','C','4/4',0,9,.5)]
pcs={'c':0,'d':2,'e':4,'f':5,'g':7,'a':9,'b':11}; names=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B']
durs={4:'w',3:'h.',2:'h',1.5:'q.',1:'q',.75:'8.',.5:'8',.25:'16'}
def parse(text,shift,scale):
 text=text.replace('\\breve','0')
 text=re.sub(r'\\[a-zA-Z]+',' ',text)
 tokens=text.replace('(',' ').replace(')',' ').replace('|',' ').split(); out=[]; duration=1
 for token in tokens:
  m=re.fullmatch(r"([a-gsr])(is|es)?([',]*)(0|1|2|4|8|16)?(\.)?(?:\\fermata)?",token)
  if not m: continue
  letter,acc,octave,n,dot=m.groups()
  if n: duration=(8 if n=='0' else 4/int(n))*(1.5 if dot else 1)
  elif dot: duration*=1.5
  beats=duration*scale
  midi=None if letter in 'sr' else 48+pcs[letter]+(1 if acc=='is' else -1 if acc=='es' else 0)+12*(octave.count("'")-octave.count(','))+shift
  out.append({'midi':midi,'beats':beats})
 return out
result={}
for file,title,key,time,pickup,shift,scale in specs:
 path=root/'sources/intermediate'/f'{file}.ly'; text=path.read_text(); voices={}
 for name in ['Soprano','Alto','Tenor','Bass']:
  var=name if file!='Diademata' else {'Soprano':'sop','Alto':'alt','Tenor':'ten','Bass':'bass'}[name]
  m=re.search(r'^'+var+r'\s*=\s*(.*?)(?=\n(?:[A-Za-z]+\s*=|\s*\\score))',text,re.M|re.S)
  body=m.group(1)
  body=body.split('\\major',1)[-1] if '\\major' in body else body.split('\\voiceOne',1)[-1].split('\\voiceTwo',1)[-1]
  body=body.split('\\bar',1)[0]
  # Remove command arguments before note tokenization; retain explicit pitches.
  body=re.sub(r'\\transpose\s+[a-g][a-z]*[\',]*\s+[a-g][a-z]*[\',]*','',body)
  voices[name]=parse(body,shift-(12 if file=='Diademata' and name in ['Tenor','Bass'] else 0),scale)
 result[file]={'title':title,'key':key,'time':time,'pickup':pickup,'voices':voices,'source':f'https://github.com/MutopiaProject/MutopiaProject/blob/master/ftp/'+{'eventide':'MonkWH/eventide/eventide.ly','blessed_assurance':'KnappPP/blessed_assurance/blessed_assurance.ly','woodworth':'BradburyWB/woodworth/woodworth.ly','nettleton':'WyethJ/nettleton/nettleton.ly','villeduh':'BlissPP/villeduh/villeduh.ly','Diademata':'ElveyGJ/Diademata/Diademata.ly'}[file], 'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'rights':'Public Domain'}
 print(file,[(k,len(v),sum(n['beats'] for n in v)) for k,v in voices.items()])
(root/'js/lessons/intermediate-scores.js').write_text('// Generated from retained public-domain scores by scripts/convert-intermediate-scores.py.\nexport const SCORES = '+json.dumps(result,indent=2)+';\n')
