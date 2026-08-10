import type { TimeWindow, UncoveredGap } from "../lib/coverage";

export interface SkillTimelineMemberRow {
  id: string;
  label: string;
  /** e.g. "19s / 8s" — active interval / duration */
  freqLabel?: string;
  windows: TimeWindow[];
  scoreUp: number;
}

export interface SkillTimelineLabels {
  gapRow: string;
  gapDur: (sec: number) => string;
  activeTitle: (scoreUp: number) => string;
}

interface SkillTimelineChartProps {
  songLength: number;
  gaps: UncoveredGap[];
  members: SkillTimelineMemberRow[];
  labels: SkillTimelineLabels;
}

function pct(value: number, total: number): number {
  if (total <= 0) return 0;
  return (value / total) * 100;
}

function fmtSec(sec: number): string {
  const rounded = Math.round(sec * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}s` : `${rounded.toFixed(2)}s`;
}

export function SkillTimelineChart({
  songLength,
  gaps,
  members,
  labels,
}: SkillTimelineChartProps) {
  const tickStep = songLength >= 120 ? 10 : 5;

  return (
    <div className="skill-timeline-scroll">
      <div className="skill-timeline" aria-hidden>
        <div className="skill-timeline-axis">
          {Array.from({ length: Math.floor(songLength / tickStep) + 1 }, (_, i) => {
            const t = i * tickStep;
            return (
              <span
                key={t}
                className="skill-timeline-tick"
                style={{ left: `${pct(t, songLength)}%` }}
              >
                <span className="skill-timeline-tick-mark" />
                <span className="skill-timeline-tick-label">{t}s</span>
              </span>
            );
          })}
        </div>

        <div className="skill-timeline-row skill-timeline-row--gap">
          <span className="skill-timeline-rowname">{labels.gapRow}</span>
          <div className="skill-timeline-lane">
            {gaps.map((gap, i) => {
              const dur = gap.end - gap.start;
              const left = pct(gap.start, songLength);
              const width = pct(dur, songLength);
              return (
                <span key={`gap-${i}`}>
                  <span
                    className="skill-timeline-bar skill-timeline-bar--gap"
                    style={{ left: `${left}%`, width: `${width}%` }}
                    title={labels.gapDur(dur)}
                  />
                  {width > 6 ? (
                    <span
                      className="skill-timeline-event skill-timeline-event--center"
                      style={{ left: `${left + width / 2}%` }}
                    >
                      {labels.gapDur(dur)}
                    </span>
                  ) : null}
                </span>
              );
            })}
          </div>
        </div>

        {members.map((member) => (
          <div key={member.id} className="skill-timeline-row skill-timeline-row--active">
            <span className="skill-timeline-rowname">
              {member.label}
              {member.freqLabel ? (
                <span className="skill-timeline-rowfreq">{member.freqLabel}</span>
              ) : null}
            </span>
            <div className="skill-timeline-lane">
              {member.windows.length === 0 ? (
                <span className="skill-timeline-empty">—</span>
              ) : null}
              {member.windows.map((win, i) => {
                const dur = win.end - win.start;
                const left = pct(win.start, songLength);
                const width = pct(dur, songLength);
                const labelLeft = Math.max(1.5, Math.min(98.5, left));
                return (
                  <span key={`${member.id}-${i}`}>
                    <span
                      className="skill-timeline-bar skill-timeline-bar--active"
                      style={{ left: `${left}%`, width: `${width}%` }}
                      title={labels.activeTitle(member.scoreUp)}
                    />
                    <span
                      className="skill-timeline-event"
                      style={{ left: `${labelLeft}%` }}
                    >
                      {fmtSec(win.start)}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
