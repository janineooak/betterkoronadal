import json, re, subprocess, os, io, sys
from pypdf import PdfReader
from PIL import Image

idx=json.load(open('ord_index.json'))
# 2025 worklist, dedupe by extracted ordinance number
def ordnum(p):
    t=p['title']
    m=re.search(r'No\.?\s*0*(\d+),\s*Series of 2025',t)
    if m: return ('std', int(m.group(1)))
    m=re.search(r'2025-Ordinance\s*0*(\d+)',t)
    if m: return ('std', int(m.group(1)))
    if 'Tax Ordinance No. 1, Series of 2025' in t: return ('tax',1)
    return None
work={}
for p in idx:
    k=ordnum(p)
    if not k: continue
    # prefer non "-1" duplicate filename
    cur=work.get(k)
    if cur is None or ('-1.pdf' in cur['url'] and '-1.pdf' not in p['url']):
        work[k]=p
work=[work[k] for k in sorted(work)]
print(f"2025 worklist: {len(work)} ordinances", file=sys.stderr)

os.makedirs('ordwork', exist_ok=True)
results=[]
ROLE_RE=re.compile(r'^(co[-\s]?authors?|authors?|co[-\s]?sponsors?|sponsors?)\b', re.I)
STOP_RE=re.compile(r'\b(WHEREAS|NOW,?\s*THEREFORE|BE IT ORDAINED|SECTION\s*1\b|ARTICLE\s)', re.I)
def ocr(png):
    return subprocess.run(['./ocr',png],capture_output=True,text=True,timeout=120).stdout

for p in work:
    url=p['url']; fn='ordwork/cur.pdf'
    r=subprocess.run(['curl','-sS','--max-time','120',url,'-o',fn])
    try:
        reader=PdfReader(fn)
    except Exception as e:
        print("PDFERR",url,e,file=sys.stderr); continue
    text_lines=[]
    for pi in range(min(2,len(reader.pages))):
        imgs=list(reader.pages[pi].images)
        if not imgs: continue
        im=imgs[0].image; w,h=im.size; s=min(1.0,1900/w)
        if s<1: im=im.resize((int(w*s),int(h*s)))
        png=f'ordwork/p{pi}.png'; im.convert('RGB').save(png)
        text_lines += ocr(png).splitlines()
    # parse
    role=None; authors=[]; coauthors=[]; sponsors=[]; started=False
    for ln in text_lines:
        l=ln.strip()
        if not l: continue
        if STOP_RE.search(l) and started: 
            # still might capture names on same line before WHEREAS; but break role collection
            role=None
            continue
        m=ROLE_RE.match(l)
        if m:
            key=re.sub(r'[-\s]','',m.group(1).lower())
            role='co' if key.startswith('co') else ('sp' if 'sponsor' in key else 'au')
            started=True
            rest=l[m.end():]
            l=rest.strip(' :.-')
            if not l: continue
        if role and 'Hon.' in l:
            names=[n.strip(' ,.') for n in re.split(r'Hon\.?\s*', l) if n.strip(' ,.and')]
            names=[re.sub(r'\b(and)\b','',n).strip(' ,.') for n in names]
            names=[n for n in names if len(n)>3]
            tgt=authors if role=='au' else coauthors if role=='co' else sponsors
            tgt.extend(names)
    full="\n".join(text_lines)
    subj=None
    ms=re.search(r'AN ORDINANCE[^\n]*(?:\n[^\n]*){0,3}', full, re.I)
    if ms:
        subj=re.sub(r'\s+',' ',ms.group(0)).strip()[:260]
    label = (f"Ordinance No. {p_k[1]:02d}, S.2025" if (p_k:=ordnum(p))[0]=='std' else "Tax Ordinance No. 1, S.2025")
    results.append({'label':label,'title':p['title'],'url':url,
                    'authors':authors,'coauthors':coauthors,'sponsors':sponsors,'subject':subj})
    print(f"{label}: A={authors} CO={coauthors} SP={sponsors}", file=sys.stderr)

json.dump(results, open('ord_authors.json','w'), indent=1, ensure_ascii=False)
print(f"\nDONE -> ord_authors.json ({len(results)} records)", file=sys.stderr)
