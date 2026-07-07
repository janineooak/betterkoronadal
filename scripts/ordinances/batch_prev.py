import json, re, subprocess, os, sys
from pypdf import PdfReader
from PIL import Image

idx=json.load(open('ord_index.json'))
def yn(p):
    m=re.search(r'(20\d{2})-Ordinance\s*0*(\d+)\b', p['title'])
    if m: return (int(m.group(1)), int(m.group(2)))
    return None
work={}
for p in idx:
    k=yn(p)
    if not k: continue
    if k[0]==2025: continue  # already done
    cur=work.get(k)
    if cur is None or ('-1.pdf' in cur['url'] and '-1.pdf' not in p['url']):
        work[k]=p
work=[work[k]+({},) if False else dict(work[k], _k=k) for k in sorted(work)]
print(f"prev worklist: {len(work)} unique ordinances ({sorted(set(k[0] for k in (yn(p) for p in idx) if k and k[0]!=2025))})", file=sys.stderr)

ROLE_RE=re.compile(r'^(co[-\s]?authors?|authors?|co[-\s]?sponsors?|sponsors?)\b', re.I)
STOP_RE=re.compile(r'\b(WHEREAS|NOW,?\s*THEREFORE|BE IT ORDAINED|SECTION\s*1\b|ARTICLE\s)', re.I)
def ocr(png): return subprocess.run(['./ocr',png],capture_output=True,text=True,timeout=120).stdout

results=[]
for i,p in enumerate(work):
    yr,num=p['_k']; url=p['url']; fn='cur_prev.pdf'
    try:
        subprocess.run(['curl','-sS','--max-time','150',url,'-o',fn],check=False)
        reader=PdfReader(fn)
    except Exception as e:
        print(f"[{i+1}/{len(work)}] ERR {yr}-{num}: {e}", file=sys.stderr); continue
    lines=[]
    for pi in range(min(2,len(reader.pages))):
        try:
            imgs=list(reader.pages[pi].images)
        except Exception: imgs=[]
        if not imgs: continue
        im=imgs[0].image; w,h=im.size; s=min(1.0,1900/w)
        if s<1: im=im.resize((int(w*s),int(h*s)))
        im.convert('RGB').save('pp.png'); lines+=ocr('pp.png').splitlines()
    role=None; A=[];CO=[];SP=[];started=False
    for ln in lines:
        l=ln.strip()
        if not l: continue
        if STOP_RE.search(l) and started: role=None; continue
        m=ROLE_RE.match(l)
        if m:
            key=re.sub(r'[-\s]','',m.group(1).lower())
            role='co' if key.startswith('co') else ('sp' if 'sponsor' in key else 'au'); started=True
            l=l[m.end():].strip(' :.-')
            if not l: continue
        if role and 'Hon.' in l:
            names=[re.sub(r'\b(and)\b','',n).strip(' ,.') for n in re.split(r'Hon\.?\s*',l) if n.strip(' ,.and')]
            names=[n for n in names if len(n)>3]
            (A if role=='au' else CO if role=='co' else SP).extend(names)
    full="\n".join(lines)
    ms=re.search(r'AN ORDINANCE[^\n]*(?:\n[^\n]*){0,3}', full, re.I)
    subj=re.sub(r'\s+',' ',ms.group(0)).strip()[:260] if ms else None
    sess=re.search(r'(\d+(?:TH|ST|ND|RD))\s+SANGGUNIANG', full, re.I)
    results.append({'year':yr,'num':num,'url':url,'authors':A,'coauthors':CO,'sponsors':SP,'subject':subj,
                    'sanggunian': (sess.group(1) if sess else None)})
    print(f"[{i+1}/{len(work)}] {yr}-{num:02d} A={len(A)} CO={len(CO)} SP={len(SP)} subj={'Y' if subj else 'N'}", file=sys.stderr)
    if (i+1)%5==0:
        json.dump(results, open('ord_authors_prev.json','w'), indent=1, ensure_ascii=False)
json.dump(results, open('ord_authors_prev.json','w'), indent=1, ensure_ascii=False)
print(f"DONE -> ord_authors_prev.json ({len(results)})", file=sys.stderr)
