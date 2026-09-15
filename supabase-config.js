const SUPABASE_URL = 'https://blfafyzvbbvlgqwjoflb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_F1Sm3YhWOZcnII4OZGOuqQ_kYBhDL8c';
const ADMIN_UID = '920d87c4-2373-45dc-90b6-c17b0d881fd0';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

window.ATDB = {
  client: sb,
  adminUid: ADMIN_UID,

  async session() {
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async login(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user || data.user.id !== ADMIN_UID) {
      await sb.auth.signOut();
      throw new Error('Esta cuenta no tiene permisos de administración.');
    }
    return data;
  },

  async logout() {
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  },

  async getBlockedDates(property) {
    const { data, error } = await sb
      .from('blocked_dates')
      .select('blocked_date')
      .eq('property', property)
      .order('blocked_date');
    if (error) throw error;
    return (data || []).map(r => r.blocked_date);
  },

  async addBlockedDates(property, dates) {
    const rows = dates.map(blocked_date => ({ property, blocked_date }));
    if (!rows.length) return;
    const { error } = await sb.from('blocked_dates').upsert(rows, { onConflict: 'property,blocked_date', ignoreDuplicates: true });
    if (error) throw error;
  },

  async removeBlockedDates(property, dates) {
    if (!dates.length) return;
    const { error } = await sb
      .from('blocked_dates')
      .delete()
      .eq('property', property)
      .in('blocked_date', dates);
    if (error) throw error;
  },

  async addLead({ nombre, email, whatsapp, acepta_promociones }) {
    const { error } = await sb.from('leads').insert({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp?.trim() || null,
      acepta_promociones: !!acepta_promociones,
    });
    if (error) throw error;
  },

  async getLeads() {
    const { data, error } = await sb
      .from('leads')
      .select('id,nombre,email,whatsapp,acepta_promociones,created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async deleteLead(id) {
    const { error } = await sb.from('leads').delete().eq('id', id);
    if (error) throw error;
  },
};
