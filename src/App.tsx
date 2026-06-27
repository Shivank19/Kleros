import React, { useState, useRef } from 'react';
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

import theme from './theme';
import { MOCK_CLINICAL_NOTE, MOCK_AUDIT_RESULT } from './mockData';
import type { AuditResult, RequirementStatus, MissingSeverity, AuditTrailNode } from './types';

const BILLING_CODES = [
  'CPT 99281 – ED Visit, Level 1',
  'CPT 99282 – ED Visit, Level 2',
  'CPT 99283 – ED Visit, Level 3',
  'CPT 99284 – ED Visit, Level 4',
  'CPT 99285 – ED Visit, Level 5',
  'CPT 99291 – Critical Care, first 30–74 min',
  'CPT 99232 – Subsequent Hospital Care',
  'ICD-10 J44.1 – COPD Acute Exacerbation',
];

const POLICIES = [
  'LCD L34559 – Emergency Medicine',
  'LCD L33822 – Critical Care Services',
  'NCD 20.5 – Respiratory Assist Devices',
  'LCD L34806 – Pulmonary Rehabilitation',
  'CMS IOM Ch.12 §30.6.12',
];

const ICON_MAP: Record<string, React.ReactElement> = {
  Upload: <UploadIcon sx={{ fontSize: 14 }} />,
  Psychology: <PsychologyIcon sx={{ fontSize: 14 }} />,
  Policy: <PolicyIcon sx={{ fontSize: 14 }} />,
  Rule: <RuleIcon sx={{ fontSize: 14 }} />,
  FindInPage: <FindInPageIcon sx={{ fontSize: 14 }} />,
  Verified: <VerifiedIcon sx={{ fontSize: 14 }} />,
  Gavel: <GavelIcon sx={{ fontSize: 14 }} />,
};

function RequirementStatusChip({ status }: { status: RequirementStatus }) {
  const config: Record<RequirementStatus, { color: string; bg: string; border: string; icon: React.ReactElement }> = {
    Met: {
      color: '#00E676',
      bg: 'rgba(0, 230, 118, 0.08)',
      border: 'rgba(0, 230, 118, 0.25)',
      icon: <CheckIcon sx={{ fontSize: 11 }} />,
    },
    'Not Met': {
      color: '#FF5252',
      bg: 'rgba(255, 82, 82, 0.08)',
      border: 'rgba(255, 82, 82, 0.25)',
      icon: <CancelIcon sx={{ fontSize: 11 }} />,
    },
    Ambiguous: {
      color: '#FFB300',
      bg: 'rgba(255, 179, 0, 0.08)',
      border: 'rgba(255, 179, 0, 0.25)',
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
      {status}
    </Box>
  );
}

function SeverityChip({ severity }: { severity: MissingSeverity }) {
  const config: Record<MissingSeverity, { color: string; bg: string }> = {
    High: { color: '#FF5252', bg: 'rgba(255, 82, 82, 0.1)' },
    Medium: { color: '#FFB300', bg: 'rgba(255, 179, 0, 0.1)' },
    Low: { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.08)' },
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
      {severity}
    </Box>
  );
}

function AuditTrailStatusChip({ status }: { status: AuditTrailNode['status'] }) {
  const config = {
    Complete: { color: '#00E676', bg: 'rgba(0, 230, 118, 0.08)', border: 'rgba(0, 230, 118, 0.2)' },
    Running: { color: '#4FC3F7', bg: 'rgba(79, 195, 247, 0.08)', border: 'rgba(79, 195, 247, 0.2)' },
    Pending: { color: '#475569', bg: 'rgba(71, 85, 105, 0.1)', border: 'rgba(71, 85, 105, 0.2)' },
    Warning: { color: '#FFB300', bg: 'rgba(255, 179, 0, 0.08)', border: 'rgba(255, 179, 0, 0.2)' },
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
      {status}
    </Box>
  );
}

function VerdictCard({ result }: { result: AuditResult }) {
  const verdictConfig = {
    Supported: {
      color: '#00E676',
      bg: 'rgba(0, 230, 118, 0.06)',
      border: 'rgba(0, 230, 118, 0.2)',
      progressColor: '#00E676',
    },
    'Not Supported': {
      color: '#FF5252',
      bg: 'rgba(255, 82, 82, 0.06)',
      border: 'rgba(255, 82, 82, 0.2)',
      progressColor: '#FF5252',
    },
    'Needs Human Review': {
      color: '#FFB300',
      bg: 'rgba(255, 179, 0, 0.06)',
      border: 'rgba(255, 179, 0, 0.2)',
      progressColor: '#FFB300',
    },
  };
  const vc = verdictConfig[result.verdict];

  return (
    <Paper
      sx={{
        p: 3,
        border: `1px solid ${vc.border}`,
        bgcolor: vc.bg,
        background: `linear-gradient(135deg, ${vc.bg} 0%, rgba(17, 24, 39, 0.95) 100%)`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
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
            <Typography variant="h4" sx={{ color: vc.color, fontFamily: 'monospace', fontWeight: 700 }}>
              {result.verdict.toUpperCase()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Run ID
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontFamily: 'monospace', color: 'text.secondary', letterSpacing: '0.05em' }}
          >
            run_8f2a1b3c4d5e6f7a
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Confidence Score
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontFamily: 'monospace', fontWeight: 700, color: vc.color }}
          >
            {result.confidence}%
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', height: 8, borderRadius: 4, bgcolor: 'rgba(148, 163, 184, 0.1)', overflow: 'hidden' }}>
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
              bgcolor: 'rgba(148, 163, 184, 0.3)',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.625rem' }}>
            Approval threshold: 80%
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.08)', mb: 2 }} />

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Billing Code', value: result.billingCode },
          { label: 'Policy Reference', value: result.policyRef },
          { label: 'Audit Time', value: new Date(result.runAt).toLocaleTimeString() },
        ].map(({ label, value }) => (
          <Box key={label}>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.25 }}>
              {label}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.75rem' }}>
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
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="overline" color="text.secondary">
            Policy Requirements
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['Met', 'Ambiguous', 'Not Met'] as RequirementStatus[]).map((s) => {
              const count = result.policyRequirements.filter((r) => r.status === s).length;
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

      {result.policyRequirements.map((req, idx) => (
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
              '&:hover': { bgcolor: 'rgba(148, 163, 184, 0.04)' },
              borderBottom: idx < result.policyRequirements.length - 1 ? '1px solid rgba(148, 163, 184, 0.06)' : 'none',
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
                {req.label}
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
                bgcolor: 'rgba(148, 163, 184, 0.03)',
                borderBottom: '1px solid rgba(148, 163, 184, 0.06)',
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
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(148, 163, 184, 0.08)', display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon sx={{ fontSize: 16, color: 'warning.main' }} />
        <Typography variant="overline" color="text.secondary">
          Missing Documentation
        </Typography>
        <Chip
          label={result.missingDocumentation.length}
          size="small"
          sx={{ height: 18, fontSize: '0.625rem', bgcolor: 'rgba(255, 179, 0, 0.1)', color: 'warning.main', ml: 'auto' }}
        />
      </Box>

      {result.missingDocumentation.map((item, idx) => (
        <Box
          key={item.id}
          sx={{
            px: 3,
            py: 2,
            borderBottom: idx < result.missingDocumentation.length - 1 ? '1px solid rgba(148, 163, 184, 0.06)' : 'none',
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
            {item.item}
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
          '&:hover': { bgcolor: 'rgba(148, 163, 184, 0.03)' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScienceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="overline" color="text.secondary">
            Extracted Clinical Facts
          </Typography>
          <Chip
            label={`${result.clinicalFacts.length} entities`}
            size="small"
            sx={{ height: 18, fontSize: '0.625rem', bgcolor: 'rgba(79, 195, 247, 0.1)', color: 'primary.light', ml: 1 }}
          />
        </Box>
        {open ? (
          <ExpandLessIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
        )}
      </Box>

      <Collapse in={open}>
        <Box sx={{ borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0,
            }}
          >
            {result.clinicalFacts.map((fact, idx) => (
              <Box
                key={fact.label}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderBottom: idx < result.clinicalFacts.length - 2 ? '1px solid rgba(148, 163, 184, 0.06)' : 'none',
                  borderRight: idx % 2 === 0 ? '1px solid rgba(148, 163, 184, 0.06)' : 'none',
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

function AuditTrailPanel({ nodes }: { nodes: AuditTrailNode[] }) {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(JSON.stringify(MOCK_AUDIT_RESULT.rawAgentOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper sx={{ p: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(148, 163, 184, 0.08)', display: 'flex', alignItems: 'center', gap: 1 }}>
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
            bgcolor: 'rgba(0, 230, 118, 0.08)',
            border: '1px solid rgba(0, 230, 118, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'success.main', boxShadow: '0 0 5px #00E676' }} />
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
                    bgcolor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(0, 230, 118, 0.35)',
                    boxShadow: '0 0 8px rgba(0, 230, 118, 0.15)',
                    color: 'success.main',
                  }}
                >
                  {ICON_MAP[node.icon] ?? <CheckIcon sx={{ fontSize: 14 }} />}
                </TimelineDot>
                {idx < nodes.length - 1 && (
                  <TimelineConnector
                    sx={{ bgcolor: 'rgba(148, 163, 184, 0.1)', width: 1 }}
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
                    {node.action}
                  </Typography>
                  <AuditTrailStatusChip status={node.status} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.primary', fontSize: '0.8rem', lineHeight: 1.4, mb: 0.5 }}
                >
                  {node.label}
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
                    {node.timestamp}
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

      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.08)' }} />

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
            border: '1px solid rgba(148, 163, 184, 0.1)',
            bgcolor: 'rgba(148, 163, 184, 0.03)',
            '&:hover': { bgcolor: 'rgba(148, 163, 184, 0.06)', borderColor: 'rgba(148, 163, 184, 0.2)' },
            transition: 'all 0.15s',
          }}
        >
          <Box
            sx={{
              px: 0.75,
              py: 0.2,
              borderRadius: 0.5,
              bgcolor: 'rgba(79, 195, 247, 0.1)',
              border: '1px solid rgba(79, 195, 247, 0.2)',
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
                bgcolor: '#080C14',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                overflow: 'auto',
                maxHeight: 320,
                m: 0,
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                lineHeight: 1.7,
                color: 'text.secondary',
                '& .json-key': { color: '#4FC3F7' },
                '& .json-string': { color: '#A5D6A7' },
                '& .json-number': { color: '#FFB74D' },
                '& .json-bool': { color: '#CE93D8' },
              }}
            >
              {JSON.stringify(MOCK_AUDIT_RESULT.rawAgentOutput, null, 2)}
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
        border: '1px solid rgba(79, 195, 247, 0.15)',
        bgcolor: 'rgba(79, 195, 247, 0.03)',
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
            bgcolor: 'rgba(79, 195, 247, 0.1)',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'primary.main',
              boxShadow: '0 0 8px rgba(79, 195, 247, 0.5)',
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

export default function App() {
  const [clinicalNote, setClinicalNote] = useState(MOCK_CLINICAL_NOTE);
  const [billingCode, setBillingCode] = useState('CPT 99285 – ED Visit, Level 5');
  const [policy, setPolicy] = useState('LCD L34559 – Emergency Medicine');
  const [phase, setPhase] = useState<'input' | 'loading' | 'results'>('input');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [visibleTrailNodes, setVisibleTrailNodes] = useState<number>(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleRunAudit = () => {
    setPhase('loading');
    setLoadingProgress(0);
    setVisibleTrailNodes(0);

    const start = Date.now();
    const duration = 2800;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setLoadingProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setPhase('results');
        // Reveal timeline nodes one-by-one
        MOCK_AUDIT_RESULT.auditTrail.forEach((_, idx) => {
          setTimeout(() => {
            setVisibleTrailNodes(idx + 1);
          }, idx * 180);
        });
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    };
    requestAnimationFrame(tick);
  };

  return (
    <ThemeProvider theme={theme}>
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
            background: 'radial-gradient(circle, rgba(79, 195, 247, 0.06) 0%, transparent 65%)',
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
            background: 'radial-gradient(circle, rgba(38, 198, 218, 0.05) 0%, transparent 65%)',
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
              'linear-gradient(rgba(148, 163, 184, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.04) 1px, transparent 1px)',
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
            background: 'linear-gradient(to bottom, transparent, rgba(79, 195, 247, 0.025), transparent)',
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
            borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
            bgcolor: 'rgba(10, 13, 20, 0.95)',
            backdropFilter: 'blur(8px)',
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
                    boxShadow: '0 0 12px rgba(79, 195, 247, 0.4)',
                  }}
                >
                  <ShieldIcon sx={{ fontSize: 16, color: '#0A0D14' }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    ClaimTrust
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.6rem', letterSpacing: '0.08em', display: 'block', lineHeight: 1 }}>
                    CLAIM AUDIT
                  </Typography>
                </Box>
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

              {/* POC chip */}
              <Chip
                label="POC · Synthetic Data Only"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 179, 0, 0.08)',
                  color: 'warning.main',
                  border: '1px solid rgba(255, 179, 0, 0.2)',
                  fontFamily: 'monospace',
                  fontSize: '0.625rem',
                  letterSpacing: '0.06em',
                  height: 22,
                  flexShrink: 0,
                }}
              />
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Phase 1 – Input */}
          <Grid container spacing={3}>
            {/* Column 1: Clinical Note */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper sx={{ p: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(148, 163, 184, 0.08)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  <Typography variant="overline" color="text.secondary">
                    Clinical Note
                  </Typography>
                  <Chip
                    label="Plain-text / EHR export"
                    size="small"
                    sx={{ ml: 'auto', height: 18, fontSize: '0.625rem', bgcolor: 'transparent', border: '1px solid rgba(148, 163, 184, 0.15)', color: 'text.disabled' }}
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
                        bgcolor: 'rgba(8, 12, 20, 0.5)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
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
                    borderTop: '1px solid rgba(148, 163, 184, 0.06)',
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
                      bgcolor: 'rgba(0, 230, 118, 0.06)',
                      border: '1px solid rgba(0, 230, 118, 0.15)',
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
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(148, 163, 184, 0.08)', display: 'flex', alignItems: 'center', gap: 1 }}>
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
                        bgcolor: 'rgba(8, 12, 20, 0.4)',
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
                        bgcolor: 'rgba(8, 12, 20, 0.4)',
                      }}
                    >
                      {POLICIES.map((p) => (
                        <MenuItem key={p} value={p} sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                          {p}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.08)' }} />

                  <Box>
                    <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1 }}>
                      Audit Configuration
                    </Typography>
                    {[
                      { label: 'Extraction Model', value: 'claim-audit-v2.1' },
                      { label: 'Policy Engine', value: 'LCD-eval-1.0' },
                      { label: 'Scoring Method', value: 'Weighted MDM' },
                    ].map(({ label, value }) => (
                      <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid rgba(148, 163, 184, 0.05)' }}>
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
                        bgcolor: 'rgba(79, 195, 247, 0.04)',
                        border: '1px solid rgba(79, 195, 247, 0.1)',
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
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(148, 163, 184, 0.08)', display: 'flex', alignItems: 'center', gap: 1 }}>
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
                          bgcolor: 'rgba(148, 163, 184, 0.06)',
                          border: '1px solid rgba(148, 163, 184, 0.12)',
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

                <Box sx={{ p: 3, pt: 2, borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}>
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
                      color: '#0A0D14',
                      boxShadow: '0 0 20px rgba(79, 195, 247, 0.25)',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        boxShadow: '0 0 28px rgba(79, 195, 247, 0.4)',
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(79, 195, 247, 0.15)',
                        color: 'rgba(79, 195, 247, 0.4)',
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
          {phase === 'results' && (
            <Box ref={resultsRef} sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ height: 1, flex: 1, bgcolor: 'rgba(148, 163, 184, 0.08)' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', boxShadow: '0 0 6px #00E676' }} />
                  <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '0.12em' }}>
                    Audit Results
                  </Typography>
                </Box>
                <Box sx={{ height: 1, flex: 1, bgcolor: 'rgba(148, 163, 184, 0.08)' }} />
              </Box>

              <Grid container spacing={3}>
                {/* Left Column — 65% */}
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <VerdictCard result={MOCK_AUDIT_RESULT} />
                    <PolicyRequirementsPanel result={MOCK_AUDIT_RESULT} />
                    <MissingDocPanel result={MOCK_AUDIT_RESULT} />
                    <ClinicalFactsPanel result={MOCK_AUDIT_RESULT} />
                  </Box>
                </Grid>

                {/* Right Column — 35% */}
                <Grid size={{ xs: 12, lg: 4 }}>
                  <AuditTrailPanel nodes={MOCK_AUDIT_RESULT.auditTrail.slice(0, visibleTrailNodes)} />
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: 8,
            py: 3,
            borderTop: '1px solid rgba(148, 163, 184, 0.08)',
            bgcolor: 'rgba(10, 13, 20, 0.8)',
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShieldIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                  ClaimTrust — AI-Powered Claim Auditing Assistant
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
                    border: '1px solid rgba(148, 163, 184, 0.12)',
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
