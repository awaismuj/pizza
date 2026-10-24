import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaQrcode, FaRedo, FaTimes, FaWhatsapp } from "react-icons/fa";
import {
  getCampaignWhatsAppProvider,
  getCampaignLinkedWhatsAppStatus,
  getWhatsAppCampaigns,
  getRecentWhatsAppCampaignMessages,
  retryCampaignLinkedWhatsApp,
  unlinkCampaignLinkedWhatsApp,
} from "../../https";

const buttonClass = "inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50";
const defaultMessageTemplate = "Hi {{1}}! 🍕 Enjoy a special treat from our pizza shop!\\n\\nYour exclusive discount: {{2}}% OFF\\nCoupon Code: {{3}}\\nMinimum Order: Rs. {{4}}\\nValid Until: {{5}}\\n\\nOrder now and enjoy your pizza!";
const statusColor = {
  queued: "text-amber-300",
  sending: "text-amber-300",
  sent: "text-sky-300",
  delivered: "text-emerald-300",
  failed: "text-red-300",
  skipped: "text-[#999]",
};

const WhatsAppCampaignMonitor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [messageStatus, setMessageStatus] = useState("all");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const statusQuery = useQuery({
    queryKey: ["whatsappStatus"],
    queryFn: getCampaignLinkedWhatsAppStatus,
    enabled: isOpen,
    refetchInterval: isOpen ? 2000 : false,
  });
  const providerQuery = useQuery({
    queryKey: ["wa-campaign-provider"],
    queryFn: getCampaignWhatsAppProvider,
    enabled: isOpen,
  });
  const campaignsQuery = useQuery({
    queryKey: ["wa-campaign-monitor-campaigns"],
    queryFn: () => getWhatsAppCampaigns({ page: 1, limit: 100 }),
    enabled: isOpen,
  });
  const messagesQuery = useQuery({
    queryKey: ["wa-campaign-recent-messages", selectedCampaignId, messageStatus, page],
    queryFn: () => getRecentWhatsAppCampaignMessages({
      campaignId: selectedCampaignId,
      status: messageStatus,
      page,
      limit: 50,
    }),
    enabled: isOpen && Boolean(selectedCampaignId),
    refetchInterval: isOpen ? 2500 : false,
  });
  const linkMutation = useMutation({
    mutationFn: retryCampaignLinkedWhatsApp,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["whatsappStatus"] }),
  });
  const unlinkMutation = useMutation({
    mutationFn: unlinkCampaignLinkedWhatsApp,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["whatsappStatus"] }),
  });

  const status = statusQuery.data?.data?.data;
  const providerStatus = providerQuery.data?.data?.data;
  const campaigns = campaignsQuery.data?.data?.data || [];
  const messages = messagesQuery.data?.data?.data || [];
  const pagination = messagesQuery.data?.data?.pagination;
  const campaignStats = messagesQuery.data?.data?.stats;
  const selectedCampaign = campaigns.find((campaign) => campaign._id === selectedCampaignId);
  const linkError = linkMutation.error || unlinkMutation.error;
  const messageTemplate = providerQuery.data?.data?.data?.templatePreviewText || defaultMessageTemplate;
  const errorMessage = (error) => error?.response?.data?.message || error?.message || "Request failed.";
  const statusOptions = ["all", "queued", "sending", "sent", "delivered", "failed", "skipped"];

  useEffect(() => {
    if (!selectedCampaignId && campaigns.length) {
      setSelectedCampaignId(campaigns[0]._id);
    }
  }, [campaigns, selectedCampaignId]);

  const renderMessageText = (message) => {
    const campaign = message.campaignId || {};
    const expiry = campaign.expiresAt
      ? new Intl.DateTimeFormat("en-PK", { timeZone: campaign.timezone || "Asia/Karachi", dateStyle: "medium" }).format(new Date(campaign.expiresAt))
      : "";
    return messageTemplate
      .replaceAll("\\n", "\n")
      .replaceAll("{{1}}", String(message.customerName || ""))
      .replaceAll("{{2}}", String(message.discountPercentage || ""))
      .replaceAll("{{3}}", String(message.couponCode || ""))
      .replaceAll("{{4}}", String(campaign.minimumOrderAmount || ""))
      .replaceAll("{{5}}", expiry);
  };

  return (
    <>
      <button
        type="button"
        className={`${buttonClass} border border-[#31573c] bg-[#1c291f] text-[#d7ffe0]`}
        onClick={() => setIsOpen(true)}
      >
        <FaWhatsapp className="text-[#25d366]" /> WhatsApp link &amp; activity
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-3"
          onClick={() => setIsOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="WhatsApp link and campaign activity"
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-[#383838] bg-[#191919] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-[#333] px-4 py-3">
              <h2 className="flex items-center gap-2 font-semibold text-white">
                <FaWhatsapp className="text-[#25d366]" /> WhatsApp connection &amp; activity
              </h2>
              <button
                type="button"
                className="rounded p-2 text-xl text-[#aaa] hover:bg-[#333]"
                aria-label="Close WhatsApp activity"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </header>

            <div className="space-y-4 overflow-y-auto p-4">
              <section className="rounded border border-[#31573c] bg-[#1c291f] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-white">
                      <FaQrcode className="text-[#25d366]" /> Link WhatsApp
                    </h3>
                    <p className="mt-1 text-sm text-[#bbb]">
                      Status: <b className={status?.status === "ready" ? "text-emerald-300" : "text-amber-300"}>{status?.status || (statusQuery.isError ? "unavailable" : "checking")}</b>
                      {status?.linkedNumber && ` · +${status.linkedNumber}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {status?.status === "ready" ? (
                      <button
                        type="button"
                        className={`${buttonClass} bg-[#353535] text-white`}
                        onClick={() => unlinkMutation.mutate()}
                        disabled={unlinkMutation.isPending}
                      >
                        <FaTimes /> {unlinkMutation.isPending ? "Unlinking…" : "Unlink"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`${buttonClass} bg-[#353535] text-white`}
                        onClick={() => linkMutation.mutate()}
                        disabled={linkMutation.isPending || status?.status === "initializing"}
                      >
                        <FaRedo /> {linkMutation.isPending ? "Starting…" : status?.status === "qr" ? "Refresh QR" : "Show QR"}
                      </button>
                    )}
                  </div>
                </div>
                {status?.qrDataUrl && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <img src={status.qrDataUrl} alt="WhatsApp linked-device QR code" className="h-44 w-44 rounded bg-white p-1" />
                    <p className="max-w-xs text-sm text-[#bbb]">On your phone, open WhatsApp → Linked Devices → Link a Device, then scan this QR.</p>
                  </div>
                )}
                {status?.status === "ready" && (
                  <p className="mt-3 text-sm text-emerald-200">Connected. Coupon campaign messages are sent from this WhatsApp account.</p>
                )}
                {providerStatus?.provider === "mock" && (
                  <p className="mt-3 text-sm text-amber-200">Mock provider is active; campaign activity is simulated and no WhatsApp messages are delivered.</p>
                )}
                {status?.lastError && (
                  <div className="mt-3 space-y-2 text-sm text-red-200">
                    <p className="break-words">{status.lastError}</p>
                    {status.status === "init_failed" && (
                      <p className="rounded bg-black/20 p-2 text-xs text-[#ddd]">
                        On the Ubuntu backend host, install Chromium’s missing library and retry:
                        <code className="mt-1 block select-all">sudo apt-get update &amp;&amp; sudo apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2 libpangocairo-1.0-0 libxss1 libgtk-3-0</code>
                      </p>
                    )}
                  </div>
                )}
                {statusQuery.isError && <p className="mt-2 text-sm text-red-300">{errorMessage(statusQuery.error)}</p>}
                {linkError && <p className="mt-2 text-sm text-red-300">{errorMessage(linkError)}</p>}
                <p className="mt-3 text-xs text-amber-200">
                  Linked-device automation is not Meta’s official Business API and may risk WhatsApp account restrictions. Message only customers who opted in.
                </p>
              </section>

              <section>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-white">Campaign live sending records</h3>
                  <span className="text-xs text-[#999]">Live updates every 2.5 seconds</span>
                </div>
                {campaignsQuery.isError ? (
                  <p className="text-sm text-red-300">{errorMessage(campaignsQuery.error)}</p>
                ) : campaignsQuery.isLoading ? (
                  <p className="text-sm text-[#999]">Loading campaigns…</p>
                ) : !campaigns.length ? (
                  <p className="rounded border border-[#333] bg-[#202020] p-3 text-sm text-[#999]">No campaigns yet. Create and launch a coupon campaign to see each recipient’s live status here.</p>
                ) : (
                  <>
                    <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                      <label className="text-xs text-[#aaa]">
                        Campaign
                        <select
                          className="mt-1 w-full rounded border border-[#444] bg-[#202020] px-3 py-2 text-sm text-white"
                          value={selectedCampaignId}
                          onChange={(event) => {
                            setSelectedCampaignId(event.target.value);
                            setPage(1);
                          }}
                        >
                          {campaigns.map((campaign) => (
                            <option key={campaign._id} value={campaign._id}>{campaign.name} · {campaign.status}</option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs text-[#aaa]">
                        Recipient status
                        <select
                          className="mt-1 w-full rounded border border-[#444] bg-[#202020] px-3 py-2 text-sm text-white"
                          value={messageStatus}
                          onChange={(event) => {
                            setMessageStatus(event.target.value);
                            setPage(1);
                          }}
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>{option === "all" ? "All recipients" : option[0].toUpperCase() + option.slice(1)}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    {campaignStats && (
                      <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {[
                          ["Queued", campaignStats.queued],
                          ["Sending", campaignStats.sending],
                          ["Sent", campaignStats.sent],
                          ["Delivered", campaignStats.delivered],
                          ["Failed", campaignStats.failed],
                          ["Skipped", campaignStats.skipped],
                        ].map(([label, count]) => (
                          <div key={label} className="rounded border border-[#333] bg-[#202020] p-2">
                            <span className="block text-xs text-[#999]">{label}</span>
                            <b className="text-white">{Number(count || 0).toLocaleString()}</b>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
                {campaigns.length > 0 && messagesQuery.isLoading ? (
                  <p className="text-sm text-[#999]">Loading message activity…</p>
                ) : campaigns.length > 0 && messagesQuery.isError ? (
                  <p className="text-sm text-red-300">{errorMessage(messagesQuery.error)}</p>
                ) : campaigns.length > 0 && messages.length ? (
                  <ul className="space-y-2">
                    {messages.map((message) => (
                      <li key={message._id} className="rounded border border-[#333] bg-[#202020] p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-white">{message.customerName || "Customer"} <span className="font-mono text-xs text-[#aaa]">{message.phone || ""}</span></p>
                            <p className="mt-1 text-xs text-[#aaa]">{message.campaignId?.name || "Coupon campaign"}</p>
                          </div>
                          <span className={`capitalize ${statusColor[message.status] || "text-white"}`}>{message.status}</span>
                        </div>
                        <p className="mt-2 text-sm text-[#ddd]">
                          {message.discountPercentage ? `${message.discountPercentage}% off` : "Coupon"}{message.couponCode ? ` · Code ${message.couponCode}` : ""}
                          {message.campaignId?.minimumOrderAmount ? ` · Minimum Rs ${Number(message.campaignId.minimumOrderAmount).toLocaleString()}` : ""}
                        </p>
                        <p className="mt-2 whitespace-pre-line rounded bg-[#171717] p-2 text-xs text-[#bbb]">{renderMessageText(message)}</p>
                        {message.lastError && <p className="mt-1 text-xs text-red-300">{message.lastError}</p>}
                        <p className="mt-1 text-xs text-[#888]">
                          {message.sentAt ? `Sent ${new Date(message.sentAt).toLocaleString()}` : `Last updated ${new Date(message.updatedAt).toLocaleString()}`}
                          {message.deliveredAt ? ` · Delivered ${new Date(message.deliveredAt).toLocaleString()}` : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : campaigns.length > 0 && !messagesQuery.isLoading && !messagesQuery.isError ? (
                  <p className="rounded border border-[#333] bg-[#202020] p-3 text-sm text-[#999]">This campaign has no recipients to show.</p>
                ) : null}
                {pagination?.pages > 1 && (
                  <div className="mt-3 flex items-center justify-between text-xs text-[#999]">
                    <span>{pagination.total.toLocaleString()} recipients</span>
                    <div className="flex items-center gap-3">
                      <button type="button" className="disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
                      <span>{pagination.page} / {pagination.pages}</span>
                      <button type="button" className="disabled:opacity-40" disabled={page >= pagination.pages} onClick={() => setPage((current) => current + 1)}>Next</button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default WhatsAppCampaignMonitor;
