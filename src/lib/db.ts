import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type DomainData = {
  id: string;
  domain: string;
  last_scan: string;
  scan_count: number;
  industry_type?: string;
  healthcare_type?: string;
  created_at: string;
};

export type AIModelPerception = {
  model: 'ChatGPT' | 'Gemini' | 'Claude' | 'Perplexity' | 'Grok';
  signals_detected: string[];
  signals_missing: string[];
  confidence: 'Strong' | 'Medium' | 'Weak';
};

export type VisibilityOpportunity = {
  missed_searches: number;
  estimated_lift_percentage: number;
};

export type ConversationalQuery = {
  question: string;
  intent: 'Informational' | 'Commercial' | 'Comparison' | 'Recovery' | 'Candidacy' | 'General';
  potential_value: 'High' | 'Medium' | 'Low';
};

export type EntityData = {
  detected: string[];
  missing: string[];
};

export type ReportData = {
  id?: string;
  domain_id?: string;
  url: string;
  
  // New Psychological Scores
  ai_discoverability_risk: 'HIGH' | 'MEDIUM' | 'LOW';
  google_entity_authority: 'STRONG' | 'MEDIUM' | 'WEAK';
  chatgpt_understanding: 'STRONG' | 'MEDIUM' | 'WEAK';
  healthcare_knowledge_graph: 'STRONG' | 'MEDIUM' | 'WEAK';
  ai_ecosystem_readiness: 'STRONG' | 'MEDIUM' | 'WEAK';
  
  // Legacy numeric scores
  overall_score: number;
  seo_score: number;
  geo_score: number;
  geo_opportunity_score: number;
  ai_visibility_score: number;
  authority_score: number;
  trust_score: number;
  
  // Evidence-based Data
  ai_model_perception?: AIModelPerception[];
  conversational_queries?: ConversationalQuery[];
  visibility_opportunity?: VisibilityOpportunity;
  entities?: EntityData;

  raw_extracted_data: any;
  pdf_report_data?: PDFReportData;
  client_name?: string;
  client_location?: string;
  created_at?: string;
  recommendations?: RecommendationData[];
  competitors?: CompetitorData[];
};

export type PDFReportData = {
  brand_positioning: number;
  technical_infrastructure: number;
  entity_authority: number;
  geo_readiness: number;
  ai_citation_potential: number;
  knowledge_graph: number;
  target_90_days: number;
  target_180_days: number;
  estimated_potential: string;
  visibility_recommendations: 'Low' | 'Moderate' | 'High';
  likelihood_of_being_cited: 'Low' | 'Moderate' | 'High';
  knowledge_graph_strength: 'Low' | 'Moderate' | 'High';
  authority_recognition: 'Low' | 'Moderate' | 'High';
};

export type RecommendationData = {
  id?: string;
  report_id: string;
  severity: 'High' | 'Medium' | 'Low';
  type: 'Schema' | 'Content' | 'Authority' | 'Technical' | 'GEO';
  title: string;
  description: string;
  potential_impact?: string[];
  estimated_lift?: string;
  confidence_score: number; // 0-100
  evidence: string[]; // Strict exact facts
  created_at?: string;
};

export type CompetitorData = {
  name: string;
  reasons_outperforming: string[];
  overall_score: number; // Used to sort, but maybe obfuscated in UI
};

export type LeadData = {
  id: string;
  report_id: string;
  first_name: string;
  last_name: string;
  email: string;
  followup_sent?: boolean;
  created_at: string;
};

// Mock storage for development without real Supabase credentials
const mockStore = {
  domains: {} as Record<string, DomainData>,
  reports: {} as Record<string, ReportData>,
  recommendations: {} as Record<string, RecommendationData[]>,
  leads: {} as Record<string, LeadData>
};

export async function saveLead(reportId: string, firstName: string, lastName: string, email: string): Promise<string> {
  if (supabaseUrl === 'https://placeholder-url.supabase.co') {
    const id = crypto.randomUUID();
    mockStore.leads[id] = {
      id,
      report_id: reportId,
      first_name: firstName,
      last_name: lastName,
      email,
      followup_sent: false,
      created_at: new Date().toISOString()
    };
    (global as any).__mockStore = mockStore;
    return id;
  }

  const { data, error } = await supabase.from('leads').insert([{
    report_id: reportId,
    first_name: firstName,
    last_name: lastName,
    email,
    followup_sent: false
  }]).select('id').single();

  if (error) throw error;
  return data.id;
}

export async function saveReportData(url: string, report: Omit<ReportData, 'id' | 'domain_id' | 'created_at'>, recommendations: Omit<RecommendationData, 'id' | 'report_id'>[]): Promise<string> {
  const domainName = new URL(url).hostname.replace('www.', '');

  if (supabaseUrl === 'https://placeholder-url.supabase.co') {
    // MOCK IMPLEMENTATION
    let domainId = Object.values(mockStore.domains).find(d => d.domain === domainName)?.id;
    if (!domainId) {
      domainId = crypto.randomUUID();
      mockStore.domains[domainId] = {
        id: domainId,
        domain: domainName,
        last_scan: new Date().toISOString(),
        scan_count: 1,
        created_at: new Date().toISOString()
      };
    } else {
      mockStore.domains[domainId].scan_count++;
      mockStore.domains[domainId].last_scan = new Date().toISOString();
    }

    const reportId = crypto.randomUUID();
    mockStore.reports[reportId] = {
      ...report,
      id: reportId,
      domain_id: domainId,
      created_at: new Date().toISOString()
    };

    mockStore.recommendations[reportId] = recommendations.map(r => ({
      ...r,
      id: crypto.randomUUID(),
      report_id: reportId,
      created_at: new Date().toISOString()
    }));

    (global as any).__mockStore = mockStore; // Persist in global for Next.js hot reloads
    return reportId;
  }

  // REAL SUPABASE IMPLEMENTATION
  let { data: domainRecord } = await supabase.from('domains').select('id, scan_count').eq('domain', domainName).single();
  
  if (!domainRecord) {
    const { data: newDomain, error } = await supabase.from('domains').insert([{
      domain: domainName,
      last_scan: new Date().toISOString(),
      scan_count: 1
    }]).select('id, scan_count').single();
    if (error) throw error;
    domainRecord = newDomain;
  } else {
    await supabase.from('domains').update({
      last_scan: new Date().toISOString(),
      scan_count: domainRecord.scan_count + 1
    }).eq('id', domainRecord.id);
  }

  const { competitors, recommendations: _, ...reportInsertPayload } = report as any;

  const { data: reportResult, error: reportError } = await supabase.from('reports').insert([{
    ...reportInsertPayload,
    domain_id: domainRecord.id
  }]).select('id').single();

  if (reportError) throw reportError;

  const recsToInsert = recommendations.map(r => ({ ...r, report_id: reportResult.id }));
  if (recsToInsert.length > 0) {
    await supabase.from('recommendations').insert(recsToInsert);
  }

  return reportResult.id;
}

export async function getReportData(id: string): Promise<ReportData | null> {
  if (supabaseUrl === 'https://placeholder-url.supabase.co') {
    const store = (global as any).__mockStore || mockStore;
    const report = store.reports[id];
    if (!report) return null;
    return {
      ...report,
      recommendations: store.recommendations[id] || []
    };
  }

  const { data: report, error } = await supabase.from('reports').select('*').eq('id', id).single();
  if (error || !report) return null;

  const { data: recommendations } = await supabase.from('recommendations').select('*').eq('report_id', id);

  return {
    ...report,
    recommendations: recommendations || []
  };
}

export async function updateReportClientInfo(reportId: string, clientName: string, clientLocation: string): Promise<void> {
  if (supabaseUrl === 'https://placeholder-url.supabase.co') {
    const store = (global as any).__mockStore || mockStore;
    if (store.reports[reportId]) {
      store.reports[reportId].client_name = clientName;
      store.reports[reportId].client_location = clientLocation;
      (global as any).__mockStore = store;
    }
    return;
  }

  const { error } = await supabase
    .from('reports')
    .update({ client_name: clientName, client_location: clientLocation })
    .eq('id', reportId);

  if (error) throw error;
}

export type LeadWithUrl = LeadData & {
  url?: string;
};

export async function getReportsList(): Promise<Omit<ReportData, 'recommendations' | 'competitors'>[]> {
  if (supabaseUrl === 'https://placeholder-url.supabase.co') {
    const store = (global as any).__mockStore || mockStore;
    return (Object.values(store.reports) as ReportData[]).sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
  }

  const { data, error } = await supabase
    .from('reports')
    .select('id, url, overall_score, ai_discoverability_risk, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reports list:', error);
    return [];
  }

  return (data || []) as Omit<ReportData, 'recommendations' | 'competitors'>[];
}

export async function getLeadsList(): Promise<LeadWithUrl[]> {
  if (supabaseUrl === 'https://placeholder-url.supabase.co') {
    const store = (global as any).__mockStore || mockStore;
    return (Object.values(store.leads) as LeadData[])
      .map(lead => ({
        ...lead,
        url: store.reports[lead.report_id]?.url
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const { data, error } = await supabase
    .from('leads')
    .select('id, report_id, first_name, last_name, email, created_at, reports(url)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads list:', error);
    return [];
  }

  return (data || []).map((lead: any) => ({
    id: lead.id,
    report_id: lead.report_id,
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    created_at: lead.created_at,
    url: lead.reports?.url
  }));
}

export async function getPendingFollowups(): Promise<any[]> {
  if (supabaseUrl === 'https://placeholder-url.supabase.co') {
    const store = (global as any).__mockStore || mockStore;
    const now = new Date();
    return Object.values(store.leads).filter((lead: any) => {
      if (lead.followup_sent) return false;
      const created = new Date(lead.created_at);
      const hoursAgo = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
      return hoursAgo >= 5 && hoursAgo <= 24;
    }).map((lead: any) => ({
      ...lead,
      reports: store.reports[lead.report_id]
    }));
  }

  const now = new Date();
  const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('leads')
    .select('id, first_name, last_name, email, created_at, report_id, reports(url, client_name, client_location, overall_score)')
    .eq('followup_sent', false)
    .gte('created_at', twentyFourHoursAgo)
    .lte('created_at', fiveHoursAgo);

  if (error) {
    console.error('Error fetching pending followups:', error);
    return [];
  }

  return data || [];
}

export async function markFollowupSent(leadId: string): Promise<void> {
  if (supabaseUrl === 'https://placeholder-url.supabase.co') {
    const store = (global as any).__mockStore || mockStore;
    if (store.leads[leadId]) {
      store.leads[leadId].followup_sent = true;
      (global as any).__mockStore = store;
    }
    return;
  }

  const { error } = await supabase
    .from('leads')
    .update({ followup_sent: true })
    .eq('id', leadId);

  if (error) throw error;
}


