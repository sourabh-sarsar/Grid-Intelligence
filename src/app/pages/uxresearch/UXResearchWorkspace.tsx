import React from 'react';
import { UXBrief } from './UXBrief';
import { UXOverview } from './UXOverview';
import { UXResearchPlan } from './UXResearchPlan';
import { UXInterviews } from './UXInterviews';
import { UXSurvey } from './UXSurvey';
import { UXEmpathy } from './UXEmpathy';
import { UXPersonas } from './UXPersonas';
import { UXJourney } from './UXJourney';
import { UXInsights } from './UXInsights';
import { UXIA } from './UXIA';
import { UXImpact } from './UXImpact';

interface Props { activePage: string; }

export function UXResearchWorkspace({ activePage }: Props) {
  switch (activePage) {
    case 'ux-brief':      return <UXBrief />;
    case 'ux-plan':       return <UXResearchPlan />;
    case 'ux-interviews': return <UXInterviews />;
    case 'ux-survey':     return <UXSurvey />;
    case 'ux-empathy':    return <UXEmpathy />;
    case 'ux-personas':   return <UXPersonas />;
    case 'ux-journey':    return <UXJourney />;
    case 'ux-insights':   return <UXInsights />;
    case 'ux-ia':         return <UXIA />;
    case 'ux-impact':     return <UXImpact />;
    default:              return <UXOverview />;
  }
}