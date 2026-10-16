import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  archiveStaffHrDocument,
  downloadStaffHrDocument,
  getStaffHrDocuments,
  linkEmployeeAccount,
  unlinkEmployeeAccount,
  uploadHrStaffDocument,
} from "../../https";

const categories = ["Contract", "Identity", "Certification", "Medical", "Tax", "Other"];
const errorMessage = (error) => error?.response?.data?.message || "The request failed. Please try again.";

const StaffHrDocumentsPanel = ({ staff }) => {
  const queryClient = useQueryClient();
  const [linkedUser, setLinkedUser] = useState(staff.linkedUser || null);
  const [accountEmail, setAccountEmail] = useState(staff.linkedUser?.email || "");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Other");
  const [visibility, setVisibility] = useState("EmployeeAndHR");
  const queryKey = ["staffHrDocuments", staff._id];
  const documentsQuery = useQuery({ queryKey, queryFn: () => getStaffHrDocuments(staff._id) });
  const documents = documentsQuery.data?.data?.data || [];

  const onError = (error) => enqueueSnackbar(errorMessage(error), { variant: "error" });
  const linkMutation = useMutation({
    mutationFn: linkEmployeeAccount,
    onSuccess: (response) => {
      setLinkedUser(response.data?.data?.linkedUser || null);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      enqueueSnackbar("Employee self-service account linked.", { variant: "success" });
    },
    onError,
  });
  const unlinkMutation = useMutation({
    mutationFn: unlinkEmployeeAccount,
    onSuccess: () => {
      setLinkedUser(null);
      setAccountEmail("");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      enqueueSnackbar("Employee account unlinked.", { variant: "success" });
    },
    onError,
  });
  const uploadMutation = useMutation({
    mutationFn: uploadHrStaffDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setFile(null);
      enqueueSnackbar("HR document uploaded securely.", { variant: "success" });
    },
    onError,
  });
  const archiveMutation = useMutation({
    mutationFn: archiveStaffHrDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError,
  });

  const download = async (document) => {
    try {
      const response = await downloadStaffHrDocument(document._id);
      const objectUrl = URL.createObjectURL(response.data);
      const anchor = window.document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = document.originalName;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <section className="space-y-3 rounded-lg border border-[#383838] p-3">
      <div>
        <h4 className="text-sm font-semibold text-white">Employee self-service account</h4>
        <p className="text-xs text-[#999]">
          {linkedUser
            ? `${linkedUser.email} · ${linkedUser.status}`
            : "No login account is linked."}
        </p>
      </div>
      {!linkedUser && (
        <div className="flex gap-2">
          <input
            type="email"
            value={accountEmail}
            onChange={(event) => setAccountEmail(event.target.value)}
            placeholder="Approved Employee account email"
            className="min-w-0 flex-1 rounded bg-[#262626] px-3 py-2 text-sm text-white outline-none"
          />
          <button
            type="button"
            disabled={linkMutation.isPending || !accountEmail.trim()}
            onClick={() => linkMutation.mutate({ staffId: staff._id, email: accountEmail })}
            className="rounded bg-[#383838] px-3 py-2 text-xs text-white disabled:opacity-50"
          >
            Link
          </button>
        </div>
      )}
      {linkedUser && (
        <button
          type="button"
          disabled={unlinkMutation.isPending}
          onClick={() => {
            if (window.confirm(`Unlink the employee account ${linkedUser.email}?`)) unlinkMutation.mutate(staff._id);
          }}
          className="rounded bg-[#383838] px-3 py-2 text-xs text-red-300 disabled:opacity-50"
        >
          Unlink account
        </button>
      )}

      <div className="border-t border-[#383838] pt-3">
        <h4 className="mb-2 text-sm font-semibold text-white">Private HR documents</h4>
        <div className="grid gap-2 sm:grid-cols-2">
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded bg-[#262626] px-3 py-2 text-sm text-white outline-none">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={visibility} onChange={(event) => setVisibility(event.target.value)} className="rounded bg-[#262626] px-3 py-2 text-sm text-white outline-none">
            <option value="EmployeeAndHR">Visible to employee and HR</option>
            <option value="HROnly">HR only</option>
          </select>
          <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} className="min-w-0 rounded bg-[#262626] px-2 py-2 text-xs text-white sm:col-span-2" />
          <button
            type="button"
            disabled={!file || uploadMutation.isPending}
            onClick={() => uploadMutation.mutate({ staffId: staff._id, file, category, visibility })}
            className="rounded bg-[#383838] px-3 py-2 text-xs text-white disabled:opacity-50 sm:col-span-2"
          >
            {uploadMutation.isPending ? "Uploading…" : "Upload document"}
          </button>
        </div>
        {documentsQuery.isError ? (
          <p role="alert" className="mt-2 text-xs text-red-300">{errorMessage(documentsQuery.error)}</p>
        ) : (
          <ul className="mt-2 divide-y divide-[#303030]">
            {documents.map((document) => (
              <li key={document._id} className="flex items-center justify-between gap-2 py-2 text-xs">
                <span className="min-w-0 truncate">{document.originalName} · {document.category} · {document.visibility}</span>
                <span className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => download(document)} className="text-yellow-300">Download</button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Archive ${document.originalName}?`)) archiveMutation.mutate(document._id);
                    }}
                    className="text-red-300"
                  >
                    Archive
                  </button>
                </span>
              </li>
            ))}
            {!documentsQuery.isLoading && documents.length === 0 && <li className="py-2 text-xs text-[#999]">No active documents.</li>}
          </ul>
        )}
      </div>
    </section>
  );
};

export default StaffHrDocumentsPanel;
