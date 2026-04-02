import { PanelCard } from "@/components/app-section";

export function RoiPredictorPanel() {
  return (
    <PanelCard title="ROI Predictor" description="6-Month Strategic Projection">
      <div className="flex flex-col gap-4 rounded-2xl bg-muted/30 p-4">
        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary" /> Suggested
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-muted-foreground" />{" "}
            Baseline
          </span>
        </div>
        <svg viewBox="0 0 520 260" className="h-64 w-full">
          <defs>
            <linearGradient id="roiLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4a7c59" />
              <stop offset="100%" stopColor="#705c30" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="520" height="260" rx="24" fill="#f5f1ea" />
          <path
            d="M30 28 L490 28"
            stroke="rgba(0,0,0,0.06)"
            strokeDasharray="4 6"
          />
          <path
            d="M30 80 L490 80"
            stroke="rgba(0,0,0,0.06)"
            strokeDasharray="4 6"
          />
          <path
            d="M30 132 L490 132"
            stroke="rgba(0,0,0,0.06)"
            strokeDasharray="4 6"
          />
          <path
            d="M30 184 L490 184"
            stroke="rgba(0,0,0,0.06)"
            strokeDasharray="4 6"
          />
          <path
            d="M30 205 L110 180 L190 150 L270 140 L350 110 L430 92 L490 70"
            fill="none"
            stroke="rgba(74,124,89,0.2)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <path
            d="M30 260 L30 190 L110 168 L190 140 L270 124 L350 92 L430 80 L490 58 L490 260 Z"
            fill="rgba(74,124,89,0.12)"
          />
          <path
            d="M30 190 L110 168 L190 140 L270 124 L350 92 L430 80 L490 58"
            fill="none"
            stroke="url(#roiLine)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {[30, 110, 190, 270, 350, 430, 490].map((x, index) => (
            <circle
              key={index}
              cx={x}
              cy={[190, 168, 140, 124, 92, 80, 58][index]}
              r="4"
              fill="#4a7c59"
            />
          ))}
          <text x="28" y="228" fill="#7a7a7a" fontSize="11">
            JAN
          </text>
          <text x="108" y="228" fill="#7a7a7a" fontSize="11">
            FEB
          </text>
          <text x="188" y="228" fill="#7a7a7a" fontSize="11">
            MAR
          </text>
          <text x="268" y="228" fill="#7a7a7a" fontSize="11">
            APR
          </text>
          <text x="348" y="228" fill="#7a7a7a" fontSize="11">
            MAY
          </text>
          <text x="428" y="228" fill="#7a7a7a" fontSize="11">
            JUN
          </text>
          <text
            x="285"
            y="98"
            fill="#4a7c59"
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
          >
            +42% Peak Alpha
          </text>
        </svg>
      </div>
    </PanelCard>
  );
}
