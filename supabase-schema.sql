-- =====================================================
-- ATIMO PROJECT SRL - Schema baza de date Supabase
-- Rulati acest cod in Supabase > SQL Editor
-- =====================================================

-- 1. Tabela profiles (utilizatori cu roluri)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'office' CHECK (role IN ('admin', 'office', 'technician')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creare automata profil la inregistrare user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 'office');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Tabela clients
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  cnp TEXT,
  id_series TEXT,
  id_number TEXT,
  address TEXT,
  city TEXT,
  county TEXT,
  subscriber_code TEXT,
  consumption_code TEXT,
  next_viu_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela jobs
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  date DATE NOT NULL,
  technician TEXT,
  status TEXT DEFAULT 'Programat' CHECK (status IN ('Programat', 'In progres', 'Finalizat', 'Anulat')),
  price NUMERIC,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela contracts
CREATE TABLE contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  number TEXT,
  date DATE,
  total_price NUMERIC,
  payment_method TEXT,
  duration TEXT,
  services JSONB,
  client_sig TEXT,
  technician_sig TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela reports (ViU / RiU)
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('ViU', 'RiU')),
  number TEXT,
  date DATE,
  consumption_address TEXT,
  contract_number TEXT,
  last_verification_date DATE,
  due_date DATE,
  inspection_type TEXT,
  installation_type TEXT,
  checklist JSONB,
  checklist_obs JSONB,
  defects TEXT,
  actions TEXT,
  conclusion TEXT,
  technical_conditions TEXT,
  client_sig TEXT,
  technician_sig TEXT,
  -- Campuri specifice RiU
  meter_protocol_number TEXT,
  meter_protocol_date DATE,
  revision_reason TEXT,
  pressure_resistance NUMERIC,
  pressure_tightness NUMERIC,
  pressure_regime NUMERIC,
  installation_material TEXT,
  installation_location TEXT,
  test_result TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- POLITICI DE SECURITATE (Row Level Security)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles: fiecare user isi vede profilul propriu
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Clients: toti utilizatorii autentificati pot accesa
CREATE POLICY "Authenticated users can view clients"
  ON clients FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert clients"
  ON clients FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
  ON clients FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete clients"
  ON clients FOR DELETE TO authenticated USING (true);

-- Jobs
CREATE POLICY "Authenticated users can view jobs"
  ON jobs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert jobs"
  ON jobs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update jobs"
  ON jobs FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete jobs"
  ON jobs FOR DELETE TO authenticated USING (true);

-- Contracts
CREATE POLICY "Authenticated users can view contracts"
  ON contracts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert contracts"
  ON contracts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update contracts"
  ON contracts FOR UPDATE TO authenticated USING (true);

-- Reports
CREATE POLICY "Authenticated users can view reports"
  ON reports FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert reports"
  ON reports FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update reports"
  ON reports FOR UPDATE TO authenticated USING (true);

-- =====================================================
-- DATE DE TEST (optional - stergeti dupa ce testati)
-- =====================================================

-- Nota: Utilizatorii se creeaza din Supabase > Authentication > Users
-- NU din SQL. Dupa ce creati userul din interfata,
-- actualizati rolul cu comanda de mai jos:

-- UPDATE profiles SET role = 'admin', name = 'Admin Atimo' WHERE id = 'UUID-DIN-SUPABASE';
