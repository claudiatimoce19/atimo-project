# ATIMO PROJECT SRL — Ghid de instalare
## Urmați pașii IN ORDINE. Nu săriți niciun pas.

---

## PASUL 1 — Configurați baza de date în Supabase

1. Intrați pe **supabase.com** → click pe proiectul **atimo**
2. În meniul din stânga click pe **"SQL Editor"**
3. Click pe **"New query"**
4. Deschideți fișierul **supabase-schema.sql** de pe calculatorul dvs.
5. Selectați TOT textul (Ctrl+A) și copiați-l (Ctrl+C)
6. Lipiți-l în SQL Editor din Supabase (Ctrl+V)
7. Click pe butonul **"Run"** (sau Ctrl+Enter)
8. Ar trebui să vedeți mesajul **"Success"**

---

## PASUL 2 — Creați conturile utilizatorilor

1. În Supabase, click pe **"Authentication"** în meniul din stânga
2. Click pe **"Users"**
3. Click pe **"Add user"** → **"Create new user"**
4. Creați 3 utilizatori:

| Email | Parolă | Rol |
|-------|--------|-----|
| admin@atimo.ro | (alegeți o parolă) | admin |
| office@atimo.ro | (alegeți o parolă) | office |
| tehnic@atimo.ro | (alegeți o parolă) | technician |

5. După ce creați fiecare user, copiați **UUID-ul** din coloana "User UID"
6. Mergeți la **"SQL Editor"** și rulați pentru fiecare user:

```sql
UPDATE profiles SET role = 'admin', name = 'Admin Atimo' WHERE id = 'LIPITI-UUID-AICI';
UPDATE profiles SET role = 'office', name = 'Maria Ionescu' WHERE id = 'LIPITI-UUID-AICI';
UPDATE profiles SET role = 'technician', name = 'Ion Popescu' WHERE id = 'LIPITI-UUID-AICI';
```

---

## PASUL 3 — Publicați aplicația pe Vercel

1. Mergeți pe **github.com**
2. Click pe **"+"** (dreapta sus) → **"New repository"**
3. Nume: **atimo-project**
4. Click **"Create repository"**
5. Pe pagina care apare, click pe **"uploading an existing file"**
6. Trageți TOATE fișierele din folderul **atimo-project** în pagina GitHub
   - Atenție: trageți și folderul **src** și folderul **public** cu tot ce conțin
7. Click **"Commit changes"**

### Acum pe Vercel:
1. Mergeți pe **vercel.com**
2. Click **"Add New Project"**
3. Click **"Import"** lângă **atimo-project**
4. Click **"Deploy"**
5. Așteptați ~2 minute

### Vercel vă va da un link de genul: `https://atimo-project.vercel.app`

Acesta este link-ul pe care îl accesează toți: dvs., biroul, tehnicianul de pe telefon.

---

## PASUL 4 — Testați aplicația

1. Accesați link-ul primit de la Vercel
2. Autentificați-vă cu `admin@atimo.ro` și parola setată
3. Adăugați un client de test
4. Adăugați o lucrare
5. Creați un raport ViU

---

## Întrebări frecvente

**Tehnicianul nu poate accesa de pe telefon?**
Trimiteți-i link-ul Vercel. Se deschide în orice browser (Chrome, Safari).

**Am uitat parola unui user?**
Supabase → Authentication → Users → click pe user → "Reset password"

**Vreau să adaug un utilizator nou?**
Supabase → Authentication → Users → "Add user", apoi actualizați rolul cu SQL.

**Aplicația nu pornește pe Vercel?**
Verificați că ați urcat și fișierul `package.json` și folderul `src` complet.
