import React, { useEffect, useState } from 'react';
import { listInquiries, createInquiry } from '../../services/inquiryApi';
import InquiryList from '../../components/Workspace/InquiryList';

export default function WorkspaceInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await listInquiries({ page: 1, limit: 50 });
      setInquiries(res.items || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Inquiries</h2>
      <InquiryList items={inquiries} loading={loading} onRefresh={load} />
    </div>
  );
}
