import { AlertTriangle, Eye, ShieldCheck, Users, Wallet } from "lucide-react";

import {
  useUploadPostAccountQuery,
  useUploadPostHistoryQuery,
  useUploadPostProfilesQuery,
  useUploadPostTotalImpressionsQuery,
} from "@/api";
import {
  InlineQueryState,
  MetricCardsSkeleton,
  PanelRowsSkeleton,
} from "@/components/app-query-state";
import { MetricCard, PanelCard } from "@/components/app-section";
import { useBilingual } from "@/hooks/use-bilingual";
import { formatCompactNumber, formatDateTime } from "@/lib/insight-formatters";
import { FocusSectionHeader } from "@/pages/focus/components/FocusSectionHeader";
import { getQueryErrorMessage } from "@/lib/query-error";

export function FinanceControlPage() {
  const copy = useBilingual();

  const accountQuery = useUploadPostAccountQuery();
  const profilesQuery = useUploadPostProfilesQuery();
  const historyQuery = useUploadPostHistoryQuery({ page: 1, limit: 20 });

  const primaryProfile = profilesQuery.data?.profiles[0]?.username;

  const impressionsQuery = useUploadPostTotalImpressionsQuery({
    profileUsername: primaryProfile,
    enabled: Boolean(primaryProfile),
  });

  const anyLoading =
    accountQuery.isLoading || profilesQuery.isLoading || historyQuery.isLoading;

  const anyError =
    accountQuery.error ||
    profilesQuery.error ||
    historyQuery.error ||
    impressionsQuery.error;

  const totalImpressions = Object.values(
    impressionsQuery.data?.payload.metrics ?? {},
  ).reduce((sum, value) => sum + value, 0);

  return (
    <div className="grid gap-6">
      <FocusSectionHeader
        title={{ en: "Finance Control", vi: "Điều phối tài chính" }}
        description={{
          en: "Control plane for account readiness, profile scope, and visibility metrics before high-impact finance actions.",
          vi: "Bảng điều phối cho readiness của account, phạm vi profile và metric hiển thị trước các thao tác tài chính quan trọng.",
        }}
        badge={{ en: "Control Plane", vi: "Mặt phẳng điều khiển" }}
        icon={ShieldCheck}
      />

      {anyLoading ? <MetricCardsSkeleton /> : null}

      {anyError ? (
        <InlineQueryState
          state="error"
          message={getQueryErrorMessage(
            anyError,
            "Unable to load finance control data.",
          )}
        />
      ) : null}

      {!anyLoading && !anyError ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={copy("Account Status", "Trạng thái tài khoản")}
            value={
              accountQuery.data?.success
                ? copy("READY", "SẴN SÀNG")
                : copy("CHECK", "KIỂM TRA")
            }
            icon={<ShieldCheck className="size-5" />}
            detail={accountQuery.data?.email ?? "--"}
          />
          <MetricCard
            label={copy("Plan", "Gói dịch vụ")}
            value={(accountQuery.data?.plan ?? "free").toUpperCase()}
            icon={<Wallet className="size-5" />}
            detail={copy("Upload-Post account", "Tài khoản Upload-Post")}
          />
          <MetricCard
            label={copy("Profiles", "Profiles")}
            value={formatCompactNumber(
              profilesQuery.data?.profiles.length ?? 0,
            )}
            icon={<Users className="size-5" />}
            detail={copy(
              "Available publishing identities",
              "Danh tính có thể publish",
            )}
          />
          <MetricCard
            label={copy("Tracked Impressions", "Lượt hiển thị theo dõi")}
            value={formatCompactNumber(totalImpressions)}
            icon={<Eye className="size-5" />}
            detail={
              primaryProfile
                ? `${copy("Profile", "Profile")}: ${primaryProfile}`
                : copy("No profile selected", "Chưa có profile")
            }
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PanelCard
          title={copy("Profile Scope", "Phạm vi profile")}
          description={copy(
            "Use this list to verify which profile is active before generating JWT or publishing actions.",
            "Dùng danh sách này để xác nhận profile đang dùng trước khi tạo JWT hoặc thực hiện publish.",
          )}
        >
          {profilesQuery.isLoading ? (
            <PanelRowsSkeleton rows={4} />
          ) : (
            <div className="space-y-3">
              {(profilesQuery.data?.profiles ?? []).map((profile) => (
                <div
                  key={profile.username}
                  className="rounded-2xl border border-border/65 bg-background/65 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {profile.username}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy("Created", "Tạo lúc")}:{" "}
                    {profile.created_at
                      ? formatDateTime(profile.created_at)
                      : "--"}
                  </p>
                </div>
              ))}
              {(profilesQuery.data?.profiles.length ?? 0) === 0 ? (
                <InlineQueryState
                  state="empty"
                  message={copy(
                    "No profiles found. Create profile in Finance page before executing control actions.",
                    "Chưa có profile. Hãy tạo profile ở trang Finance trước khi chạy tác vụ điều phối.",
                  )}
                />
              ) : null}
            </div>
          )}
        </PanelCard>

        <PanelCard
          title={copy("Recent Finance Warnings", "Cảnh báo tài chính gần đây")}
          description={copy(
            "Action-focused reminders to reduce wrong submissions and scope mismatch.",
            "Các nhắc nhở tập trung thao tác để giảm submit sai và lệch scope.",
          )}
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <AlertTriangle className="size-4" />
                {copy("Scope Validation", "Xác thực phạm vi")}
              </p>
              <p className="mt-1.5">
                {copy(
                  "Always confirm username and platform scope before account/JWT submission.",
                  "Luôn xác nhận username và scope platform trước khi submit account/JWT.",
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">
                {copy("History Snapshot", "Ảnh chụp lịch sử")}
              </p>
              <p className="mt-1.5">
                {copy("Recent requests", "Số request gần đây")}:{" "}
                {historyQuery.data?.payload.history.length ?? 0}
              </p>
              <p className="mt-1.5">
                {copy(
                  "Use history traces to diagnose rejected finance operations.",
                  "Dùng lịch sử request để chẩn đoán thao tác tài chính bị từ chối.",
                )}
              </p>
            </div>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
