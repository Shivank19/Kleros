import React, { useMemo, useState, useRef } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import GlobalStyles from '@mui/material/GlobalStyles';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import UploadIcon from '@mui/icons-material/Upload';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PolicyIcon from '@mui/icons-material/Policy';
import RuleIcon from '@mui/icons-material/Rule';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import VerifiedIcon from '@mui/icons-material/Verified';
import GavelIcon from '@mui/icons-material/Gavel';
import ShieldIcon from '@mui/icons-material/Shield';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckIcon from '@mui/icons-material/Check';
import ScienceIcon from '@mui/icons-material/Science';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import FactCheckIcon from '@mui/icons-material/FactCheck';

import { createAppTheme, type ThemeMode } from './theme';
import { MOCK_CLINICAL_NOTE } from './mockData';
import type { AuditResult, RequirementStatus, MissingDocumentation, AuditTrailStep } from './types';

import { createTimedMockAuditResult, runLiveAudit } from './services/auditService';

const BILLING_CODES = [
  'CPT 99281 – ED Visit, Level 1',
  'CPT 99282 – ED Visit, Level 2',
  'CPT 99283 – ED Visit, Level 3',
  'CPT 99284 – ED Visit, Level 4',
  'CPT 99285 – ED Visit, Level 5',
  'CPT 99291 – Critical Care, first 30–74 min',
  'CPT 99232 – Subsequent Hospital Care',
  'NCD 20.5 – Respiratory Assist Devices',
  'LCD L34806 – Pulmonary Rehabilitation',
  'ICD-10 J44.1 – COPD Acute Exacerbation',
];

const POLICIES = [
  'LCD L34559 – Emergency Medicine',
  'LCD L33822 – Critical Care Services',
  'NCD 20.5 – Respiratory Assist Devices',
  'LCD L34806 – Pulmonary Rehabilitation',
  'CMS IOM Ch.12 §30.6.12',
];

const POLICY_REQUIREMENTS: Record<string, string[]> = {
  'LCD L34559 – Emergency Medicine': [
    'Chief complaint must be documented.',
    'History and examination must support the selected emergency department visit level.',
    'Medical decision making must support the billed level of service.',
    'Clinical severity, risk, or complexity must be documented.',
    'Treatment plan or disposition must be documented.',
  ],
  'LCD L33822 – Critical Care Services': [
    'Critical illness or injury must be documented.',
    'High-complexity decision making must be documented.',
    'Total critical care time must be documented.',
    'Provider must document direct management of life-threatening condition.',
  ],
  'NCD 20.5 – Respiratory Assist Devices': [
    'Respiratory diagnosis must be documented.',
    'Medical necessity for respiratory support must be documented.',
    'Relevant oxygen saturation or pulmonary function findings must be documented.',
  ],
  'LCD L34806 – Pulmonary Rehabilitation': [
    'Qualifying pulmonary diagnosis must be documented.',
    'Functional limitation or clinical need must be documented.',
    'Treatment plan must be documented.',
  ],
  'CMS IOM Ch.12 §30.6.12': [
    'Service level must be supported by documented history, examination, or medical decision making.',
    'Documentation must support medical necessity.',
    'Time-based billing must include total time when applicable.',
  ],
};

type AppPage = 'audit' | 'samples' | 'about';

const SAMPLE_NOTES = [
  {
    id: 'ed-copd',
    title: 'ED COPD Exacerbation',
    code: 'CPT 99285 – ED Visit, Level 5',
    policy: 'LCD L34559 – Emergency Medicine',
    note: MOCK_CLINICAL_NOTE,
  },
  {
    id: 'critical-care-missing-time',
    title: 'Critical Care - Missing Time',
    code: 'CPT 99291 – Critical Care, first 30–74 min',
    policy: 'LCD L33822 – Critical Care Services',
    note: `Patient is a 72-year-old female brought to the ED in severe respiratory distress with oxygen saturation of 78% on room air, altered mentation, and accessory muscle use. Physician remained at bedside directing airway support, noninvasive ventilation, IV steroids, continuous bronchodilator therapy, magnesium, serial reassessments, and ICU consultation. ABG showed pH 7.21 and PaCO2 71. Chest imaging was reviewed and showed hyperinflation without focal infiltrate. Patient improved on BiPAP and was admitted to ICU for ongoing management. Total critical care time is not documented.`,
  },
  {
    id: 'moderate-ed-supported',
    title: 'Moderate ED Visit',
    code: 'CPT 99284 – ED Visit, Level 4',
    policy: 'CMS IOM Ch.12 §30.6.12',
    note: `Patient is a 45-year-old male presenting with right flank pain, nausea, and hematuria for one day. Vitals stable. Exam notable for right CVA tenderness without peritoneal signs. Urinalysis showed blood without infection. CT abdomen/pelvis demonstrated a 4 mm distal ureteral stone without hydronephrosis. Physician reviewed imaging report, ordered IV ketorolac and ondansetron, and discharged patient with tamsulosin, oral analgesics, hydration instructions, and urology follow-up. Return precautions were reviewed.`,
  },
  {
    id: 'minimal-bandage-99285',
    title: 'Minimal Bandage vs ED Level 5',
    code: 'CPT 99285 – ED Visit, Level 5',
    policy: 'LCD L34559 – Emergency Medicine',
    note: `Patient came in with a small cut on the left index finger. Wound was cleaned and bandaged. No severe symptoms documented. No diagnostic testing ordered. Patient left in stable condition.`,
  },
  {
    id: 'respiratory-assist-missing-objective',
    title: 'Respiratory Assist - Missing Objective Findings',
    code: 'NCD 20.5 – Respiratory Assist Devices',
    policy: 'NCD 20.5 – Respiratory Assist Devices',
    note: `Patient has chronic shortness of breath and reports difficulty sleeping. Provider discussed possible respiratory assist device use. The note mentions COPD history but does not include oxygen saturation, arterial blood gas results, pulmonary function testing, or sleep study findings.`,
  },
  {
    id: 'pulmonary-rehab-missing-plan',
    title: 'Pulmonary Rehab - Missing Treatment Plan',
    code: 'LCD L34806 – Pulmonary Rehabilitation',
    policy: 'LCD L34806 – Pulmonary Rehabilitation',
    note: `Patient has COPD and reports reduced exercise tolerance. Provider discussed pulmonary rehabilitation as a possible option. The note does not include a structured rehabilitation plan, session frequency, goals, or documented functional baseline.`,
  },
];

const ICON_MAP: Record<string, React.ReactElement> = {
  CLAIM_INGESTED: <UploadIcon sx={{ fontSize: 14 }} />,
  NLP_EXTRACTION: <PsychologyIcon sx={{ fontSize: 14 }} />,
  POLICY_LOOKUP: <PolicyIcon sx={{ fontSize: 14 }} />,
  REQUIREMENT_EVAL: <RuleIcon sx={{ fontSize: 14 }} />,
  DOCUMENTATION_GAP_ANALYSIS: <FindInPageIcon sx={{ fontSize: 14 }} />,
  CONFIDENCE_SCORING: <VerifiedIcon sx={{ fontSize: 14 }} />,
  VERDICT_ISSUED: <GavelIcon sx={{ fontSize: 14 }} />,
};

function formatAuditClockTime(value: string, options: { milliseconds?: boolean } = {}) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });

  if (!options.milliseconds) {
    return time;
  }

  return `${time}.${date.getMilliseconds().toString().padStart(3, '0')}`;
}

function RequirementStatusChip({ status }: { status: RequirementStatus }) {
  const config: Record<
    RequirementStatus,
    {
      label: string;
      color: string;
      bg: string;
      border: string;
      icon: React.ReactElement;
    }
  > = {
    MET: {
      label: 'Met',
      color: '#16A34A',
      bg: 'rgba(22, 163, 74, 0.1)',
      border: 'rgba(22, 163, 74, 0.28)',
      icon: <CheckIcon sx={{ fontSize: 11 }} />,
    },
    NOT_MET: {
      label: 'Not Met',
      color: '#DC2626',
      bg: 'rgba(220, 38, 38, 0.1)',
      border: 'rgba(220, 38, 38, 0.28)',
      icon: <CancelIcon sx={{ fontSize: 11 }} />,
    },
    AMBIGUOUS: {
      label: 'Ambiguous',
      color: '#D97706',
      bg: 'rgba(217, 119, 6, 0.12)',
      border: 'rgba(217, 119, 6, 0.3)',
      icon: <HelpIcon sx={{ fontSize: 11 }} />,
    },
    NOT_DOCUMENTED: {
      label: 'Not Documented',
      color: '#2563EB',
      bg: 'rgba(37, 99, 235, 0.1)',
      border: 'rgba(37, 99, 235, 0.28)',
      icon: <HelpIcon sx={{ fontSize: 11 }} />,
    },
  };

  const c = config[status];

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.25,
        borderRadius: 1,
        border: `1px solid ${c.border}`,
        bgcolor: c.bg,
        color: c.color,
        fontSize: '0.6875rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
      }}
    >
      {c.icon}
      {c.label}
    </Box>
  );
}
function SeverityChip({ severity }: { severity: MissingDocumentation['severity'] }) {
  const config: Record<MissingDocumentation['severity'], { label: string; color: string; bg: string }> = {
    HIGH: { label: 'High', color: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)' },
    MEDIUM: { label: 'Medium', color: '#D97706', bg: 'rgba(217, 119, 6, 0.12)' },
    LOW: { label: 'Low', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.08)' },
  };

  const c = config[severity];

  return (
    <Box
      sx={{
        px: 0.75,
        py: 0.2,
        borderRadius: 0.75,
        bgcolor: c.bg,
        color: c.color,
        fontSize: '0.625rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        display: 'inline-block',
      }}
    >
      {c.label}
    </Box>
  );
}

function AuditTrailStatusChip({ status }: { status: AuditTrailStep['status'] }) {
  const config: Record<
    AuditTrailStep['status'],
    { label: string; color: string; bg: string; border: string }
  > = {
    COMPLETE: {
      label: 'Complete',
      color: '#16A34A',
      bg: 'rgba(22, 163, 74, 0.1)',
      border: 'rgba(22, 163, 74, 0.24)',
    },
    RUNNING: {
      label: 'Running',
      color: '#2563EB',
      bg: 'rgba(37, 99, 235, 0.1)',
      border: 'rgba(37, 99, 235, 0.24)',
    },
    PENDING: {
      label: 'Pending',
      color: '#725F88',
      bg: 'rgba(114, 95, 136, 0.1)',
      border: 'rgba(114, 95, 136, 0.2)',
    },
    WARNING: {
      label: 'Warning',
      color: '#D97706',
      bg: 'rgba(217, 119, 6, 0.12)',
      border: 'rgba(217, 119, 6, 0.26)',
    },
  };

  const c = config[status];

  return (
    <Box
      sx={{
        px: 0.75,
        py: 0.15,
        borderRadius: 0.5,
        border: `1px solid ${c.border}`,
        bgcolor: c.bg,
        color: c.color,
        fontSize: '0.6rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {c.label}
    </Box>
  );
}
function VerdictCard({ result }: { result: AuditResult }) {
  const verdictConfig: Record<
    AuditResult['decision'],
    {
      label: string;
      color: string;
      bg: string;
      border: string;
      progressColor: string;
    }
  > = {
    SUPPORTED: {
      label: 'Supported',
      color: '#16A34A',
      bg: 'rgba(22, 163, 74, 0.06)',
      border: 'rgba(22, 163, 74, 0.22)',
      progressColor: '#16A34A',
    },
    NOT_SUPPORTED: {
      label: 'Not Supported',
      color: '#DC2626',
      bg: 'rgba(220, 38, 38, 0.06)',
      border: 'rgba(220, 38, 38, 0.22)',
      progressColor: '#DC2626',
    },
    NEEDS_HUMAN_REVIEW: {
      label: 'Needs Human Review',
      color: '#D97706',
      bg: 'rgba(217, 119, 6, 0.08)',
      border: 'rgba(217, 119, 6, 0.26)',
      progressColor: '#D97706',
    },
  };

  const vc = verdictConfig[result.decision];

  return (
    <Paper
      sx={{
        p: 3,
        border: `1px solid ${vc.border}`,
        bgcolor: 'background.paper',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${vc.bg} 0%, rgba(14, 9, 22, 0.95) 100%)`
            : `linear-gradient(135deg, ${vc.bg} 0%, ${theme.palette.background.paper} 68%, rgba(248, 247, 251, 0.92) 100%)`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: 'block', mb: 0.5 }}
          >
            Audit Verdict
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: vc.color,
                boxShadow: `0 0 8px ${vc.color}`,
                flexShrink: 0,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                color: vc.color,
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              {vc.label.toUpperCase()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: 'block', mb: 0.5 }}
          >
            Run ID
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              color: 'text.secondary',
              letterSpacing: '0.05em',
            }}
          >
            {result.rawAgentOutput &&
            typeof result.rawAgentOutput === 'object' &&
            'runId' in result.rawAgentOutput
              ? String(result.rawAgentOutput.runId)
              : 'run_live_audit'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Confidence Score
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              color: vc.color,
            }}
          >
            {result.confidence}%
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            height: 8,
            borderRadius: 4,
            bgcolor: 'rgba(120, 113, 128, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${result.confidence}%`,
              borderRadius: 4,
              bgcolor: vc.color,
              boxShadow: `0 0 10px ${vc.color}66`,
              transition: 'width 1s ease-out',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              left: '80%',
              top: 0,
              height: '100%',
              width: 1,
              bgcolor: 'rgba(168, 85, 247, 0.3)',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              fontSize: '0.625rem',
            }}
          >
            Approval threshold: 80%
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(120, 113, 128, 0.08)', mb: 2 }} />

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Billing Code', value: result.billingCode },
          { label: 'Policy Reference', value: result.policyReference },
          {
            label: 'Audit Time',
            value: formatAuditClockTime(result.runAt),
          },
        ].map(({ label, value }) => (
          <Box key={label}>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                mb: 0.25,
              }}
            >
              {label}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

function PolicyRequirementsPanel({ result }: { result: AuditResult }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Paper sx={{ p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(120, 113, 128, 0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="overline" color="text.secondary">
            Policy Requirements
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['MET', 'AMBIGUOUS', 'NOT_DOCUMENTED', 'NOT_MET'] as RequirementStatus[]).map((s) => {
              const count = result.requirementChecks.filter((r) => r.status === s).length;
              return (
                <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <RequirementStatusChip status={s} />
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.7rem' }}>
                    {count}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {result.requirementChecks.map((req, idx) => (
        <Box key={req.id}>
          <Box
            onClick={() => setExpanded(expanded === req.id ? null : req.id)}
            sx={{
              px: 3,
              py: 1.75,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              cursor: 'pointer',
              transition: 'background 0.15s',
              '&:hover': { bgcolor: 'rgba(120, 113, 128, 0.045)' },
              borderBottom: idx < result.requirementChecks.length - 1 ? '1px solid rgba(120, 113, 128, 0.06)' : 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{ fontFamily: 'monospace', color: 'text.disabled', flexShrink: 0, fontSize: '0.6875rem' }}
              >
                {req.id}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.8125rem', lineHeight: 1.4 }}>
                {req.requirement}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <RequirementStatusChip status={req.status} />
              {expanded === req.id ? (
                <ExpandLessIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              )}
            </Box>
          </Box>
          <Collapse in={expanded === req.id}>
            <Box
              sx={{
                px: 3,
                py: 1.5,
                bgcolor: 'rgba(120, 113, 128, 0.035)',
                borderBottom: '1px solid rgba(120, 113, 128, 0.06)',
              }}
            >
              <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
                Supporting Evidence
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.6 }}>
                {req.evidence}
              </Typography>
            </Box>
          </Collapse>
        </Box>
      ))}
    </Paper>
  );
}

function MissingDocPanel({ result }: { result: AuditResult }) {
  return (
    <Paper sx={{ p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(120, 113, 128, 0.08)', display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon sx={{ fontSize: 16, color: 'warning.main' }} />
        <Typography variant="overline" color="text.secondary">
          Missing Documentation
        </Typography>
        <Chip
          label={result.missingDocumentation.length}
          size="small"
          sx={{ height: 18, fontSize: '0.625rem', bgcolor: 'rgba(217, 119, 6, 0.1)', color: 'warning.main', ml: 'auto' }}
        />
      </Box>

      {result.missingDocumentation.map((item, idx) => (
        <Box
          key={item.id}
          sx={{
            px: 3,
            py: 2,
            borderBottom: idx < result.missingDocumentation.length - 1 ? '1px solid rgba(120, 113, 128, 0.06)' : 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.disabled', fontSize: '0.6875rem' }}>
                {item.id}
              </Typography>
              <SeverityChip severity={item.severity} />
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.75, fontSize: '0.8125rem', fontWeight: 500 }}>
            {item.title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            {item.recommendation}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}

function ClinicalFactsPanel({ result }: { result: AuditResult }) {
  const [open, setOpen] = useState(false);

  return (
    <Paper sx={{ p: 0, overflow: 'hidden' }}>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(120, 113, 128, 0.035)' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScienceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="overline" color="text.secondary">
            Extracted Clinical Facts
          </Typography>
          <Chip
            label={`${result.extractedFacts.length} entities`}
            size="small"
            sx={{ height: 18, fontSize: '0.625rem', bgcolor: 'rgba(120, 113, 128, 0.1)', color: 'primary.light', ml: 1 }}
          />
        </Box>
        {open ? (
          <ExpandLessIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
        )}
      </Box>

      <Collapse in={open}>
        <Box sx={{ borderTop: '1px solid rgba(120, 113, 128, 0.08)' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0,
            }}
          >
            {result.extractedFacts.map((fact, idx) => (
              <Box
                key={fact.label}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderBottom: idx < result.extractedFacts.length - 2 ? '1px solid rgba(120, 113, 128, 0.06)' : 'none',
                  borderRight: idx % 2 === 0 ? '1px solid rgba(120, 113, 128, 0.06)' : 'none',
                }}
              >
                <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', mb: 0.25, fontSize: '0.625rem' }}>
                  {fact.label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  {fact.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}

function AuditTrailPanel({nodes, rawAgentOutput,}: { nodes: AuditTrailStep[]; rawAgentOutput: unknown;
}) {  
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // void navigator.clipboard.writeText(JSON.stringify(MOCK_AUDIT_RESULT.rawAgentOutput, null, 2));
    void navigator.clipboard.writeText(JSON.stringify(rawAgentOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper sx={{ p: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(120, 113, 128, 0.08)', display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountTreeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="overline" color="text.secondary">
          Audit Trail
        </Typography>
        <Box
          sx={{
            ml: 'auto',
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: 'rgba(22, 163, 74, 0.1)',
            border: '1px solid rgba(22, 163, 74, 0.24)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'success.main', boxShadow: '0 0 5px #16A34A' }} />
          <Typography variant="caption" sx={{ color: 'success.main', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em' }}>
            ALL COMPLETE
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <Timeline
          sx={{
            p: 0,
            m: 0,
            [`& .MuiTimelineItem-root:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {nodes.map((node, idx) => (
            <TimelineItem key={node.id}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    m: 0,
                    p: '5px',
                    bgcolor: 'rgba(14, 9, 22, 0.95)',
                    border: '1px solid rgba(22, 163, 74, 0.3)',
                    boxShadow: '0 0 8px rgba(22, 163, 74, 0.16)',
                    color: 'success.main',
                  }}
                >
                  {ICON_MAP[node.label] ?? <CheckIcon sx={{ fontSize: 14 }} />}
                </TimelineDot>
                {idx < nodes.length - 1 && (
                  <TimelineConnector
                    sx={{ bgcolor: 'rgba(120, 113, 128, 0.1)', width: 1 }}
                  />
                )}
              </TimelineSeparator>
              <TimelineContent sx={{ py: '6px', px: 2, pb: idx < nodes.length - 1 ? 2 : '6px' }}>
                <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: 'primary.light',
                      fontSize: '0.7rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {node.label}
                  </Typography>
                  <AuditTrailStatusChip status={node.status} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.primary', fontSize: '0.8rem', lineHeight: 1.4, mb: 0.5 }}
                >
                  {node.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      color: 'text.disabled',
                      fontSize: '0.6875rem',
                    }}
                  >
                    {formatAuditClockTime(node.timestamp, { milliseconds: true })}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                  >
                    {node.detail}
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>

      <Divider sx={{ borderColor: 'rgba(120, 113, 128, 0.08)' }} />

      <Box sx={{ px: 3, py: 2 }}>
        <Box
          onClick={() => setShowJson(!showJson)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            p: 1.25,
            borderRadius: 1,
            border: '1px solid rgba(120, 113, 128, 0.1)',
            bgcolor: 'rgba(120, 113, 128, 0.035)',
            '&:hover': { bgcolor: 'rgba(120, 113, 128, 0.06)', borderColor: 'rgba(120, 113, 128, 0.2)' },
            transition: 'all 0.15s',
          }}
        >
          <Box
            sx={{
              px: 0.75,
              py: 0.2,
              borderRadius: 0.5,
              bgcolor: 'rgba(120, 113, 128, 0.1)',
              border: '1px solid rgba(120, 113, 128, 0.2)',
              color: 'primary.main',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              fontFamily: 'monospace',
            }}
          >
            JSON
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1 }}>
            Raw Agent Output
          </Typography>
          {showJson ? (
            <ExpandLessIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          )}
        </Box>

        <Collapse in={showJson}>
          <Box sx={{ mt: 1.5, position: 'relative' }}>
            <Tooltip title={copied ? 'Copied!' : 'Copy JSON'}>
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  color: copied ? 'success.main' : 'text.disabled',
                  '&:hover': { color: 'text.secondary' },
                }}
              >
                {copied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
              </IconButton>
            </Tooltip>
            <Box
              component="pre"
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0B0A10' : '#F3F0F8',
                border: '1px solid rgba(120, 113, 128, 0.1)',
                overflow: 'auto',
                maxHeight: 320,
                m: 0,
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                lineHeight: 1.7,
                color: 'text.secondary',
                '& .json-key': { color: '#A855F7' },
                '& .json-string': { color: '#16A34A' },
                '& .json-number': { color: '#F0ABFC' },
                '& .json-bool': { color: '#E879F9' },
              }}
            >
              {/* {JSON.stringify(MOCK_AUDIT_RESULT.rawAgentOutput, null, 2)} */}
              {JSON.stringify(rawAgentOutput, null, 2)}
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
}

function LoadingState({ progress }: { progress: number }) {
  const steps = [
    'Ingesting clinical note...',
    'Running NLP entity extraction...',
    'Fetching policy requirements...',
    'Evaluating requirements...',
    'Analyzing documentation gaps...',
    'Computing confidence score...',
    'Finalizing audit verdict...',
  ];
  const currentStep = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);

  return (
    <Paper
      sx={{
        p: 4,
        mt: 4,
        border: '1px solid rgba(120, 113, 128, 0.15)',
        bgcolor: 'rgba(120, 113, 128, 0.035)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <CircularProgress size={20} thickness={4} sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle2" sx={{ color: 'primary.light', fontFamily: 'monospace' }}>
          AUDIT IN PROGRESS
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 3,
            bgcolor: 'rgba(120, 113, 128, 0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'primary.main',
              boxShadow: '0 0 8px rgba(168, 85, 247, 0.5)',
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {steps.slice(0, currentStep + 1).map((step, idx) => (
          <Box
            key={step}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              opacity: idx === currentStep ? 1 : 0.4,
            }}
          >
            {idx < currentStep ? (
              <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main', flexShrink: 0 }} />
            ) : (
              <CircularProgress size={12} thickness={5} sx={{ color: 'primary.main', flexShrink: 0 }} />
            )}
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: idx === currentStep ? 'primary.light' : 'text.secondary',
                fontSize: '0.75rem',
              }}
            >
              {step}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

function SampleNotesPage({
  onLoadNote,
}: {
  onLoadNote: (sample: (typeof SAMPLE_NOTES)[number]) => void;
}) {
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  const handleCopy = (sample: (typeof SAMPLE_NOTES)[number]) => {
    void navigator.clipboard.writeText(sample.note);
    setCopiedNoteId(sample.id);
    setTimeout(() => setCopiedNoteId(null), 1800);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" color="text.secondary">
          Sample Notes
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.primary', mt: 0.5 }}>
          Synthetic clinical notes for audit testing
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {SAMPLE_NOTES.map((sample) => (
          <Grid key={sample.id} size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ p: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(120, 113, 128, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DescriptionIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                    {sample.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={sample.code} size="small" sx={{ height: 20, fontFamily: 'monospace', fontSize: '0.625rem' }} />
                  <Chip label={sample.policy} size="small" sx={{ height: 20, fontFamily: 'monospace', fontSize: '0.625rem' }} />
                </Box>
              </Box>

              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 3,
                  flex: 1,
                  minHeight: 280,
                  maxHeight: 360,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  lineHeight: 1.65,
                  color: 'text.secondary',
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0B0A10' : '#F3F0F8',
                  borderBottom: '1px solid rgba(120, 113, 128, 0.08)',
                }}
              >
                {sample.note}
              </Box>

              <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Tooltip title={copiedNoteId === sample.id ? 'Copied!' : 'Copy note'}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={copiedNoteId === sample.id ? <CheckIcon /> : <ContentCopyIcon />}
                    onClick={() => handleCopy(sample)}
                  >
                    {copiedNoteId === sample.id ? 'Copied' : 'Copy'}
                  </Button>
                </Tooltip>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ArticleIcon />}
                  onClick={() => onLoadNote(sample)}
                >
                  Load in audit
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function AboutPage() {
  const capabilities = [
    'Compares a clinical note against billing-code and policy requirements.',
    'Surfaces met, ambiguous, missing, and unsupported documentation elements.',
    'Produces an audit trail and raw agent output for reviewer traceability.',
  ];

  const guardrails = [
    'Synthetic-data proof of concept.',
    'AI-generated recommendation only.',
    'Human review remains the source of final payment integrity judgment.',
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <ShieldIcon sx={{ color: 'primary.main' }} />
              <Typography variant="overline" color="text.secondary">
                About Kleros
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: 'text.primary', mb: 2 }}>
              Claim auditing support for payment integrity review
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, maxWidth: 760 }}>
              Kleros is an AI-assisted claim auditing proof of concept for reviewing whether clinical
              documentation supports a selected billing code and payer policy. It is designed to make
              requirement checks, missing documentation, confidence scoring, and audit evidence easier
              to inspect in one workspace.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 0, overflow: 'hidden', height: '100%' }}>
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(120, 113, 128, 0.08)', display: 'flex', gap: 1, alignItems: 'center' }}>
              <FactCheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="overline" color="text.secondary">
                What It Does
              </Typography>
            </Box>
            {capabilities.map((item, idx) => (
              <Box key={item} sx={{ px: 3, py: 2, borderBottom: idx < capabilities.length - 1 ? '1px solid rgba(120, 113, 128, 0.06)' : 'none' }}>
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(120, 113, 128, 0.08)', display: 'flex', gap: 1, alignItems: 'center' }}>
              <WarningAmberIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              <Typography variant="overline" color="text.secondary">
                Review Guardrails
              </Typography>
            </Box>
            <Grid container>
              {guardrails.map((item, idx) => (
                <Grid key={item} size={{ xs: 12, md: 4 }}>
                  <Box sx={{ px: 3, py: 2.5, borderRight: { md: idx < guardrails.length - 1 ? '1px solid rgba(120, 113, 128, 0.06)' : 'none' }, borderBottom: { xs: idx < guardrails.length - 1 ? '1px solid rgba(120, 113, 128, 0.06)' : 'none', md: 'none' } }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.disabled', display: 'block', mb: 0.5 }}>
                      0{idx + 1}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                      {item}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [activePage, setActivePage] = useState<AppPage>('audit');
  const [clinicalNote, setClinicalNote] = useState(MOCK_CLINICAL_NOTE);
  const [billingCode, setBillingCode] = useState('CPT 99285 – ED Visit, Level 5');
  const [policy, setPolicy] = useState('LCD L34559 – Emergency Medicine');
  const [phase, setPhase] = useState<'input' | 'loading' | 'results'>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [visibleTrailNodes, setVisibleTrailNodes] = useState<number>(0);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const appTheme = useMemo(() => createAppTheme(themeMode), [themeMode]);
  const isDarkMode = themeMode === 'dark';
  const navItems: { id: AppPage; label: string }[] = [
    { id: 'audit', label: 'Audit' },
    { id: 'samples', label: 'Sample Notes' },
    { id: 'about', label: 'About' },
  ];

  // const handleRunAudit = () => {
  //   setPhase('loading');
  //   setLoadingProgress(0);
  //   setVisibleTrailNodes(0);

  //   const start = Date.now();
  //   const duration = 2800;

  //   const tick = () => {
  //     const elapsed = Date.now() - start;
  //     const pct = Math.min((elapsed / duration) * 100, 100);
  //     setLoadingProgress(pct);

  //     if (pct < 100) {
  //       requestAnimationFrame(tick);
  //     } else {
  //       setPhase('results');
  //       // Reveal timeline nodes one-by-one
  //       MOCK_AUDIT_RESULT.auditTrail.forEach((_, idx) => {
  //         setTimeout(() => {
  //           setVisibleTrailNodes(idx + 1);
  //         }, idx * 180);
  //       });
  //       setTimeout(() => {
  //         resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       }, 200);
  //     }
  //   };
  //   requestAnimationFrame(tick);
  // };

  const animateLoading = (duration = 2800) => {
    return new Promise<void>((resolve) => {
      const start = Date.now();

      const tick = () => {
        const elapsed = Date.now() - start; 
        const pct = Math.min((elapsed / duration) * 100, 100);
        setLoadingProgress(pct);

        if (pct < 100) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
  };

  const revealTrialNodes = (result: AuditResult) => {
    setVisibleTrailNodes(0);

    result.auditTrail.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleTrailNodes(idx + 1);
      }, idx * 180);
    });
  }

  const handleRunAudit = async () => {
    setPhase('loading');
    setLoadingProgress(0);
    setVisibleTrailNodes(0);
    setAuditResult(null);

    const selectedPolicyDocuments = POLICY_REQUIREMENTS[policy] ?? ['Documentation must support the selected billing code.'];

    try{
      const auditPromise = runLiveAudit({
        clinicalNote, billingCode, 
        policyId: policy.split(' – ')[0]?.trim() || policy,
        policyTitle: policy,
        policyRequirements: selectedPolicyDocuments,
      });

      const [result] = await Promise.all([auditPromise, animateLoading(2800)]);
    
      setAuditResult(result);
      setPhase('results');
      revealTrialNodes(result);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (error) {
        console.error('Error running audit:', error);
        // Fallback for demo
        const fallbackResult = createTimedMockAuditResult();
        setAuditResult(fallbackResult);
        setPhase('results');
      
        revealTrialNodes(fallbackResult);

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    }
  }

  const handleLoadSampleNote = (sample: (typeof SAMPLE_NOTES)[number]) => {
    setClinicalNote(sample.note);
    setBillingCode(sample.code);
    setPolicy(sample.policy);
    setActivePage('audit');
    setPhase('input');
    setAuditResult(null);
    setVisibleTrailNodes(0);
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={`
          @keyframes ctDrift1 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            50% { transform: translate(40px, -30px) scale(1.08); opacity: 0.7; }
          }
          @keyframes ctDrift2 {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            50% { transform: translate(-50px, 40px) scale(1.12); opacity: 0.6; }
          }
          @keyframes ctScan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          @keyframes ctGridPulse {
            0%, 100% { opacity: 0.025; }
            50% { opacity: 0.05; }
          }
        `}
      />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle drifting radial glows */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'fixed',
            top: '-15%',
            left: '-10%',
            width: '55vw',
            height: '55vw',
            borderRadius: '50%',
            background: (theme) => `radial-gradient(circle, ${theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.045)' : 'rgba(109, 40, 217, 0.035)'} 0%, transparent 65%)`,
            animation: 'ctDrift1 22s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <Box
          aria-hidden="true"
          sx={{
            position: 'fixed',
            bottom: '-20%',
            right: '-10%',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background: (theme) => `radial-gradient(circle, ${theme.palette.mode === 'dark' ? 'rgba(167, 139, 250, 0.035)' : 'rgba(124, 58, 237, 0.028)'} 0%, transparent 65%)`,
            animation: 'ctDrift2 28s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Faint grid overlay */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'fixed',
            inset: 0,
            backgroundImage:
              (theme) => `linear-gradient(${theme.palette.mode === 'dark' ? 'rgba(167, 160, 184, 0.035)' : 'rgba(68, 56, 85, 0.032)'} 1px, transparent 1px), linear-gradient(90deg, ${theme.palette.mode === 'dark' ? 'rgba(167, 160, 184, 0.035)' : 'rgba(68, 56, 85, 0.032)'} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            animation: 'ctGridPulse 8s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Slow scanline sweep */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            height: '120px',
            background: (theme) => `linear-gradient(to bottom, transparent, ${theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.018)' : 'rgba(109, 40, 217, 0.014)'}, transparent)`,
            animation: 'ctScan 14s linear infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box
          component="header"
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(7, 7, 11, 0.92)' : 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 'appBar',
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1.5,
                gap: 2,
              }}
            >
              {/* Wordmark */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 1,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: (theme) => `0 0 14px ${theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.32)' : 'rgba(109, 40, 217, 0.18)'}`,
                  }}
                >
                  <ShieldIcon sx={{ fontSize: 16, color: 'background.default' }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #F4F1FA 0%, #A7A0B8 100%)'
                        : 'linear-gradient(135deg, #171421 0%, #6D28D9 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Kleros
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.6rem', letterSpacing: '0.08em', display: 'block', lineHeight: 1 }}>
                    CLAIM AUDIT
                  </Typography>
                </Box>
              </Box>

              <Box
                component="nav"
                aria-label="Primary navigation"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  p: 0.4,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(17, 16, 24, 0.78)' : 'rgba(248, 247, 251, 0.88)',
                }}
              >
                {navItems.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <Button
                      key={item.id}
                      size="small"
                      variant={isActive ? 'contained' : 'text'}
                      onClick={() => setActivePage(item.id)}
                      sx={{
                        minHeight: 28,
                        px: { xs: 1, sm: 1.5 },
                        fontSize: '0.72rem',
                        color: isActive ? '#FFFFFF' : 'text.secondary',
                        bgcolor: isActive ? 'primary.main' : 'transparent',
                        '&:hover': {
                          bgcolor: isActive ? 'primary.dark' : 'rgba(120, 113, 128, 0.08)',
                          color: isActive ? '#FFFFFF' : 'text.primary',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>

              {/* Tagline */}
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  letterSpacing: '0.04em',
                  display: { xs: 'none', md: 'block' },
                  textAlign: 'center',
                  fontSize: '0.75rem',
                }}
              >
                AI-Powered Claim Auditing for Healthcare Payment Integrity
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                <Chip
                  label="POC - Synthetic Data Only"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(217, 119, 6, 0.1)',
                    color: 'warning.main',
                    border: '1px solid rgba(217, 119, 6, 0.22)',
                    fontFamily: 'monospace',
                    fontSize: '0.625rem',
                    letterSpacing: '0.06em',
                    height: 22,
                    flexShrink: 0,
                  }}
                />
                <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                  <IconButton
                    aria-label="Toggle color mode"
                    size="small"
                    onClick={() => setThemeMode(isDarkMode ? 'light' : 'dark')}
                    sx={{
                      width: 32,
                      height: 32,
                      border: '1px solid',
                      borderColor: 'divider',
                      color: 'text.secondary',
                      bgcolor: 'background.paper',
                      boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 0 18px rgba(139, 92, 246, 0.08)'
                        : '0 10px 24px rgba(42, 32, 64, 0.08)',
                      '&:hover': {
                        color: 'primary.main',
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    {isDarkMode ? <LightModeIcon sx={{ fontSize: 16 }} /> : <DarkModeIcon sx={{ fontSize: 16 }} />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Container>
        </Box>

        {activePage === 'audit' ? (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Phase 1 – Input */}
          <Grid container spacing={3}>
            {/* Column 1: Clinical Note */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper sx={{ p: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(120, 113, 128, 0.08)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  <Typography variant="overline" color="text.secondary">
                    Clinical Note
                  </Typography>
                  <Chip
                    label="Plain-text / EHR export"
                    size="small"
                    sx={{ ml: 'auto', height: 18, fontSize: '0.625rem', bgcolor: 'transparent', border: '1px solid rgba(120, 113, 128, 0.15)', color: 'text.disabled' }}
                  />
                </Box>
                <Box sx={{ p: 2, flex: 1 }}>
                  <TextField
                    multiline
                    fullWidth
                    minRows={14}
                    value={clinicalNote}
                    onChange={(e) => setClinicalNote(e.target.value)}
                    placeholder="Paste or type clinical note here..."
                    sx={{
                      '& .MuiInputBase-root': {
                        fontFamily: 'monospace',
                        fontSize: '0.8125rem',
                        lineHeight: 1.7,
                        bgcolor: 'background.default',
                        border: '1px solid rgba(120, 113, 128, 0.1)',
                        borderRadius: 1,
                        color: 'text.secondary',
                        p: 1.5,
                      },
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    px: 3,
                    py: 1.25,
                    borderTop: '1px solid rgba(120, 113, 128, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.disabled', fontSize: '0.7rem' }}>
                    {clinicalNote.split(/\s+/).filter(Boolean).length} tokens
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 0.5,
                      bgcolor: 'rgba(22, 163, 74, 0.06)',
                      border: '1px solid rgba(22, 163, 74, 0.16)',
                      color: 'success.main',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      fontFamily: 'monospace',
                    }}
                  >
                    READY
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Column 2: Billing Code + Policy */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper sx={{ p: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(120, 113, 128, 0.08)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                  <Typography variant="overline" color="text.secondary">
                    Billing &amp; Policy
                  </Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>Billing Code</InputLabel>
                    <Select
                      value={billingCode}
                      label="Billing Code"
                      onChange={(e) => setBillingCode(e.target.value)}
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.8125rem',
                        color: 'text.primary',
                        bgcolor: 'background.default',
                      }}
                    >
                      {BILLING_CODES.map((code) => (
                        <MenuItem key={code} value={code} sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                          {code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>Policy / LCD</InputLabel>
                    <Select
                      value={policy}
                      label="Policy / LCD"
                      onChange={(e) => setPolicy(e.target.value)}
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.8125rem',
                        color: 'text.primary',
                        bgcolor: 'background.default',
                      }}
                    >
                      {POLICIES.map((p) => (
                        <MenuItem key={p} value={p} sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                          {p}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Divider sx={{ borderColor: 'rgba(120, 113, 128, 0.08)' }} />

                  <Box>
                    <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1 }}>
                      Audit Configuration
                    </Typography>
                    {[
                      { label: 'Extraction Model', value: 'claim-audit-v2.1' },
                      { label: 'Policy Engine', value: 'LCD-eval-1.0' },
                      { label: 'Scoring Method', value: 'Weighted MDM' },
                    ].map(({ label, value }) => (
                      <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid rgba(120, 113, 128, 0.055)' }}>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                          {label}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.7rem' }}>
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ mt: 'auto' }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'rgba(120, 113, 128, 0.045)',
                        border: '1px solid rgba(120, 113, 128, 0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                        <HealthAndSafetyIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                        <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          Selected Policy
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.7rem', display: 'block' }}>
                        {policy}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Column 3: How It Works + CTA */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(120, 113, 128, 0.08)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#CE93D8' }} />
                  <Typography variant="overline" color="text.secondary">
                    How It Works
                  </Typography>
                </Box>

                <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {[
                    {
                      step: '01',
                      icon: <UploadIcon sx={{ fontSize: 15 }} />,
                      title: 'Ingest',
                      desc: 'Clinical note is parsed and tokenized. NLP extracts diagnoses, procedures, vitals, and clinical indicators.',
                    },
                    {
                      step: '02',
                      icon: <PolicyIcon sx={{ fontSize: 15 }} />,
                      title: 'Policy Match',
                      desc: 'Billing code is mapped to the selected Local Coverage Determination (LCD) and its documentation requirements.',
                    },
                    {
                      step: '03',
                      icon: <RuleIcon sx={{ fontSize: 15 }} />,
                      title: 'Evaluate',
                      desc: 'Each policy requirement is checked against extracted clinical facts. Results are marked Met, Not Met, or Ambiguous.',
                    },
                    {
                      step: '04',
                      icon: <GavelIcon sx={{ fontSize: 15 }} />,
                      title: 'Verdict',
                      desc: 'A confidence-weighted verdict is issued. Gaps and missing documentation are surfaced for human review.',
                    },
                  ].map(({ step, icon, title, desc }) => (
                    <Box key={step} sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          bgcolor: 'rgba(120, 113, 128, 0.06)',
                          border: '1px solid rgba(120, 113, 128, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: 'text.secondary',
                        }}
                      >
                        {icon}
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.25 }}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.disabled', fontSize: '0.6rem' }}>
                            {step}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontSize: '0.8125rem', color: 'text.primary' }}>
                            {title}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', lineHeight: 1.6, display: 'block' }}>
                          {desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ p: 3, pt: 2, borderTop: '1px solid rgba(120, 113, 128, 0.08)' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={phase === 'loading' || !clinicalNote.trim()}
                    onClick={handleRunAudit}
                    startIcon={phase === 'loading' ? <CircularProgress size={16} thickness={4} /> : <PlayArrowIcon />}
                    sx={{
                      py: 1.5,
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      bgcolor: 'primary.main',
                      color: 'background.default',
                      boxShadow: '0 0 20px rgba(168, 85, 247, 0.25)',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        boxShadow: '0 0 28px rgba(168, 85, 247, 0.4)',
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(120, 113, 128, 0.15)',
                        color: 'rgba(168, 85, 247, 0.4)',
                      },
                    }}
                  >
                    {phase === 'loading' ? 'Running Audit...' : 'Run Audit'}
                  </Button>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mt: 1.25 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem', textAlign: 'center' }}>
                      AI-generated recommendation. For human review only.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Loading State */}
          {phase === 'loading' && <LoadingState progress={loadingProgress} />}

          {/* Phase 2 – Results */}
          {phase === 'results' && auditResult && (
            <Box ref={resultsRef} sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ height: 1, flex: 1, bgcolor: 'rgba(120, 113, 128, 0.08)' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', boxShadow: '0 0 6px #16A34A' }} />
                  <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '0.12em' }}>
                    Audit Results
                  </Typography>
                </Box>
                <Box sx={{ height: 1, flex: 1, bgcolor: 'rgba(120, 113, 128, 0.08)' }} />
              </Box>

              <Grid container spacing={3}>
                {/* Left Column — 65% */}
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <VerdictCard result={auditResult} />
                    <PolicyRequirementsPanel result={auditResult} />
                    <MissingDocPanel result={auditResult} />
                    <ClinicalFactsPanel result={auditResult} />
                  </Box>
                </Grid>

                {/* Right Column — 35% */}
                <Grid size={{ xs: 12, lg: 4 }}>
                  <AuditTrailPanel
                    nodes={auditResult.auditTrail.slice(0, visibleTrailNodes)}
                    rawAgentOutput={auditResult.rawAgentOutput}
                  />                
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
        ) : activePage === 'samples' ? (
          <SampleNotesPage onLoadNote={handleLoadSampleNote} />
        ) : (
          <AboutPage />
        )}

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: 8,
            py: 3,
            borderTop: '1px solid rgba(120, 113, 128, 0.08)',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(7, 7, 11, 0.82)' : 'rgba(255, 255, 255, 0.72)',
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShieldIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                  Kleros - AI-Powered Claim Auditing Assistant
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                  All data is synthetic. Not for production use.
                </Typography>
                <Chip
                  label="v0.1.0 POC"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    fontFamily: 'monospace',
                    bgcolor: 'transparent',
                    border: '1px solid rgba(120, 113, 128, 0.12)',
                    color: 'text.disabled',
                  }}
                />
              </Box>
            </Box>
          </Container>
        </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}



