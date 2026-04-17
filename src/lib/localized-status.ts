export type CopyFn = (en: string, vi: string) => string;

function normalizeStatus(status: string | undefined) {
  return (status ?? "").trim().toLowerCase();
}

export function localizeStatus(status: string | undefined, copy: CopyFn) {
  const normalized = normalizeStatus(status);

  if (!normalized) {
    return copy("Unknown", "Không xác định");
  }

  if (["pending", "queued", "waiting"].includes(normalized)) {
    return copy("Pending", "Đang chờ");
  }

  if (
    ["running", "processing", "in_progress", "started"].includes(normalized)
  ) {
    return copy("Running", "Đang xử lý");
  }

  if (normalized === "published") {
    return copy("Published", "Đã đăng");
  }

  if (["success", "succeeded", "completed", "done"].includes(normalized)) {
    return copy("Completed", "Hoàn tất");
  }

  if (["failed", "error"].includes(normalized)) {
    return copy("Failed", "Thất bại");
  }

  if (["cancelled", "canceled"].includes(normalized)) {
    return copy("Canceled", "Đã hủy");
  }

  if (normalized === "draft") {
    return copy("Draft", "Bản nháp");
  }

  if (normalized === "unknown") {
    return copy("Unknown", "Không xác định");
  }

  return status ?? copy("Unknown", "Không xác định");
}

export function localizePipelineEventType(
  type: "trend" | "content" | "publish",
  copy: CopyFn,
) {
  if (type === "trend") {
    return copy("Trend", "Xu hướng");
  }

  if (type === "content") {
    return copy("Content", "Nội dung");
  }

  return copy("Publish", "Đăng bài");
}

export function localizeHealthStatus(status: string | undefined, copy: CopyFn) {
  const normalized = normalizeStatus(status);

  if (["ok", "healthy", "up", "ready"].includes(normalized)) {
    return copy("Healthy", "Ổn định");
  }

  if (["degraded", "warning"].includes(normalized)) {
    return copy("Degraded", "Suy giảm");
  }

  if (["down", "failed", "error"].includes(normalized)) {
    return copy("Down", "Sự cố");
  }

  return localizeStatus(status, copy);
}
