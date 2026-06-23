import json, re, os

# ---- load both datasets, normalize to common record shape ----
recs=[]
for r in json.load(open('ord_authors.json')):  # 2025
    m=re.search(r'No\.\s*(\d+)', r['label']); 
    if not m: continue
    recs.append({'year':2025,'num':int(m.group(1)),'url':r['url'],'subject':r.get('subject'),
                 'authors':r['authors'],'coauthors':r['coauthors'],'sponsors':r['sponsors']})
for r in json.load(open('ord_authors_prev.json')):  # 2021-2024
    recs.append({'year':r['year'],'num':r['num'],'url':r['url'],'subject':r.get('subject'),
                 'authors':r['authors'],'coauthors':r['coauthors'],'sponsors':r['sponsors']})

ROSTER=[
 (('cator',),'ma-ester-catorce'),(('subere','albios'),'ellen-grace-subere-albios'),
 (('rodrigue','rodigue'),'john-rey-rodriguez'),(('hinay',),'bernardo-hinay'),
 (('jumilla',),'charene-jumilla-pama'),(('lapidez','lapide'),'mark-lapidez'),
 (('cadellino','cubilo'),'handel-cadellino-cubilo'),(('bascon',),'maylene-bascon-de-guzman'),
 (('abris',),'edwin-abris'),(('subaldo',),'margarita-subaldo'),
 (('trinidad',),'charles-trinidad'),(('gumbao',),'marvin-gumbao'),
]
def match(name):
    s=re.sub(r'[^a-z]','',name.lower())
    for keys,slug in ROSTER:
        if any(k in s for k in keys): return slug
    return None

SMALL={'a','an','the','of','in','to','and','or','for','on','by','with','as','at','its'}
def tc(s):
    s=s.strip()
    if not s: return s
    words=s.split(); out=[]
    for i,w in enumerate(words):
        lw=w.lower()
        if re.fullmatch(r'i{1,3}|iv|v|vi{0,3}|ix|x', lw):
            out.append(w.upper())
        elif i and lw in SMALL:
            out.append(lw)
        else:
            out.append(w if (any(c.islower() for c in w) and not w.isupper()) else w.capitalize())
    res=' '.join(out)
    # capitalize a letter immediately after an opening quote
    res=re.sub(r'([“"\'])([a-z])', lambda m: m.group(1)+m.group(2).upper(), res)
    return res

# curated 2025 nice titles (number -> (title, summary))
NICE={2:('Kadiwa ng Pangulo','Institutionalizes the Kadiwa ng Pangulo program in the City of Koronadal.'),
4:('Outstanding Model IP Family Search','Institutionalizes the annual search for the Most Outstanding Model Indigenous Peoples Family.'),
5:('Kababaihan Festival','Institutionalizes the City of Koronadal “Kababaihan Festival” every March and provides funds for it.'),
6:('Civil Registry Month','Institutionalizes the Civil Registry Month celebration every February.'),
7:('Library & Information Services Month','Institutionalizes library advocacy initiatives every November for Library and Information Services Month.'),
8:('LGBTQIA+ Pride Month','Declares June of every year as LGBTQIA+ Pride Month and appropriates funds.'),
10:('Hinugyaw Festival','Institutionalizes the “Siyudad sang Koronadal Hinugyaw Festival” every January and provides funds.'),
11:('City of Koronadal Tourism Code','Establishes the City of Koronadal Tourism Code.'),
12:('Koronadal Culture and Arts Council (amendment)','Amends the 2019 ordinance that created the Koronadal Culture and Arts Council.'),
15:('Free School Supplies Program','Institutionalizes a free school supplies program for all qualified learners and provides funds.'),
16:('City Sports Development Council','Establishes the City of Koronadal Sports Development Council of 2025 and appropriates funds.'),
17:('Integrated Legislative Management System','Institutionalizes the Integrated Legislative Management System of the City of Koronadal.'),
18:('2025 E-Governance Code','Establishes the 2025 E-Governance Code of the City of Koronadal.')}

def derive(subject):
    s=(subject or '').strip()
    s=re.sub(r'^\s*an ordinance\s*','',s,flags=re.I)
    s=re.sub(r'\s+',' ',s).strip().strip('".,')
    s=re.sub(r'\s+(Be it enacted|Truly yours|Sirs/Mesdames).*$','',s,flags=re.I)
    if not s: return None,None
    short=s if len(s)<=64 else s[:64].rsplit(' ',1)[0]+'…'
    summ=s if len(s)<=190 else s[:190].rsplit(' ',1)[0]+'…'
    return tc(short), tc(summ)+('.' if not summ.endswith('…') and not summ.endswith('.') else '')

rank={'authored':0,'sponsored':1,'co-authored':2}
per={}  # slug -> {(year,num): (role, year, num, title, summary, url)}
for r in recs:
    blocks=[('authored',r['authors']),('co-authored',r['coauthors']),('sponsored',r['sponsors'])]
    if not r.get('subject') and not (r['year']==2025 and r['num'] in NICE):
        continue  # need a label
    for role,names in blocks:
        if len(names)>6: continue
        for nm in names:
            slug=match(nm)
            if not slug: continue
            if r['year']==2025 and r['num'] in NICE:
                short,summ=NICE[r['num']]
                title=f"Ordinance No. {r['num']:02d}, S. 2025 — {short}"
            else:
                short,summ=derive(r['subject'])
                if not short: continue
                title=f"Ordinance No. {r['num']:02d}, S. {r['year']} — {short}"
            key=(r['year'],r['num'])
            cur=per.setdefault(slug,{}).get(key)
            cand=(role,r['year'],r['num'],title,summ,r['url'])
            if cur is None or rank[role]<rank[cur[0]]:
                per[slug][key]=cand

# curated non-PDF entries
CUR={
'ma-ester-catorce':[('authored',2025,19,'Ordinance No. 19, S. 2025 — School-Based Disaster Preparedness Program','Establishes a localized school-based disaster preparedness program (CKSDPP) for the City of Koronadal.','https://koronadal.gov.ph/2025/11/25/sangguniang-panlungsod-enacts-landmark-disaster-preparedness-ordinances/','City of Koronadal — SP enacts landmark disaster-preparedness ordinances'),
 ('authored',2025,22,'Ordinance No. 22, S. 2025 — Incident Command System (ICS)','Institutionalizes the city’s Incident Command System for disaster and emergency response.','https://koronadal.gov.ph/2025/11/25/sangguniang-panlungsod-enacts-landmark-disaster-preparedness-ordinances/','City of Koronadal — SP enacts landmark disaster-preparedness ordinances')],
'ellen-grace-subere-albios':[('authored',2026,1,'Comprehensive Livelihood Program Code of the City of Koronadal','Institutionalizes a comprehensive livelihood program for the city.','https://koronadal.gov.ph/2026/01/29/city-of-koronadal-institutionalizes-comprehensive-livelihood-program-code/','City of Koronadal — City institutionalizes Comprehensive Livelihood Program Code')],
'charene-jumilla-pama':[('sponsored',2025,0,'Local Economic Enterprise (LEE) Code of the City of Koronadal','Codifies the operation of the city’s local economic enterprises. Advanced by the Committee on Commerce, Trade, and Industry, which she chairs.','https://koronadal.gov.ph/2025/03/25/sp-koronadal-approves-landmark-local-economic-enterprise-code/','City of Koronadal — SP-Koronadal approves landmark Local Economic Enterprise Code')],
'bernardo-hinay':[('co-authored',2025,0,'Local Economic Enterprise (LEE) Code of the City of Koronadal','Member of the Committee on Commerce, Trade, and Industry that crafted and advanced the LEE Code.','https://koronadal.gov.ph/2025/03/25/sp-koronadal-approves-landmark-local-economic-enterprise-code/','City of Koronadal — SP-Koronadal approves landmark Local Economic Enterprise Code')],
'john-rey-rodriguez':[('co-authored',2025,0,'Local Economic Enterprise (LEE) Code of the City of Koronadal','Member of the Committee on Commerce, Trade, and Industry that crafted and advanced the LEE Code.','https://koronadal.gov.ph/2025/03/25/sp-koronadal-approves-landmark-local-economic-enterprise-code/','City of Koronadal — SP-Koronadal approves landmark Local Economic Enterprise Code')],
}

def esc(s): return s.replace('\\','\\\\').replace("'","\\'")
out=["// AUTO-GENERATED from official Koronadal ordinance PDFs (koronadal.gov.ph,",
"// 2021–2025) via macOS Vision OCR of each ordinance's 'Author / Co-Authors /",
"// Sponsors' block, filtered to current officials and excluding whole-council",
"// measures. Curated non-PDF entries (LEE Code, Livelihood Code, disaster",
"// ordinances) are merged in. Verified June 2026. Used by src/data/officials.ts.",
"import type { Legislation } from './provincialOfficials';","",
"export const cityOrdinances: Record<string, Legislation[]> = {"]

# order slugs by total count desc for readability
def all_entries(slug):
    items=list(per.get(slug,{}).values())+ [ (c[0],c[1],c[2],c[3],c[4],c[5],c[6]) for c in CUR.get(slug,[]) ]
    return items
slugs=sorted(set(list(per)+list(CUR)))
total=0
for slug in slugs:
    items=[]
    for v in per.get(slug,{}).values():
        items.append({'role':v[0],'y':v[1],'n':v[2],'title':v[3],'summary':v[4],'url':v[5],'label':f"Ordinance No. {v[2]:02d}, S. {v[1]} (PDF)"})
    for c in CUR.get(slug,[]):
        items.append({'role':c[0],'y':c[1],'n':c[2],'title':c[3],'summary':c[4],'url':c[5],'label':c[6]})
    items.sort(key=lambda e:(-e['y'],-e['n']))
    if not items: continue
    total+=len(items)
    out.append(f"  '{slug}': [")
    for e in items:
        out.append("    {")
        out.append(f"      title: '{esc(e['title'])}',")
        out.append(f"      role: '{e['role']}',")
        out.append(f"      summary: '{esc(e['summary'])}',")
        out.append(f"      status: 'Enacted ({e['y']})',")
        out.append("      sources: [")
        out.append("        {")
        out.append(f"          label: '{esc(e['label'])}',")
        out.append(f"          href: '{e['url']}',")
        out.append("        },")
        out.append("      ],")
        out.append("    },")
    out.append("  ],")
out.append("};")
open(os.path.join(os.path.dirname(__file__),'..','..','src','data','cityOrdinances.ts'),'w').write("\n".join(out)+"\n")
print("slugs:",len(slugs),"total entries:",total)
for s in slugs: print(f"  {s}: {len(per.get(s,{}))+len(CUR.get(s,[]))}")
