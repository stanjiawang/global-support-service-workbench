export interface MockAutomationTrigger {
  triggerId: string;
  name: string;
  condition: string;
  enabled: boolean;
}

export interface MockAutomationMacro {
  macroId: string;
  name: string;
  actions: string[];
}

export interface MockAutomationTemplate {
  templateId: string;
  name: string;
  channel: "email" | "chat" | "sms";
  bodyPreview: string;
}

export interface MockAutomationRule {
  ruleId: string;
  type: "auto-assign" | "escalation";
  description: string;
  target: string;
  enabled: boolean;
}

export interface MockAutomationSnapshot {
  fetchedAt: string;
  triggers: MockAutomationTrigger[];
  macros: MockAutomationMacro[];
  templates: MockAutomationTemplate[];
  rules: MockAutomationRule[];
}

export async function fetchMockWorkflowAutomation(signal?: AbortSignal): Promise<MockAutomationSnapshot> {
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, 140);
    if (!signal) return;
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });

  return {
    fetchedAt: "2026-02-26T19:38:00Z",
    triggers: [
      { triggerId: "trg-1", name: "SLA at risk", condition: "remainingMinutes < 45", enabled: true },
      { triggerId: "trg-2", name: "VIP escalation", condition: "customerTier == vip", enabled: true },
      { triggerId: "trg-3", name: "No response", condition: "noAgentReply > 15m", enabled: false }
    ],
    macros: [
      { macroId: "mac-1", name: "Refund approved", actions: ["set status pending", "tag refund", "send template"] },
      { macroId: "mac-2", name: "Escalate to L2", actions: ["assign queue l2", "set priority high", "notify lead"] }
    ],
    templates: [
      { templateId: "tpl-1", name: "First response", channel: "email", bodyPreview: "Thank you for contacting Apple Support..." },
      { templateId: "tpl-2", name: "Escalation notice", channel: "chat", bodyPreview: "We are escalating your request..." },
      { templateId: "tpl-3", name: "Resolution follow-up", channel: "sms", bodyPreview: "Your case has been resolved..." }
    ],
    rules: [
      { ruleId: "rule-1", type: "auto-assign", description: "Assign billing to Billing Priority queue", target: "queue-billing", enabled: true },
      { ruleId: "rule-2", type: "escalation", description: "Escalate VIP unresolved > 4h", target: "queue-vip-escalation", enabled: true }
    ]
  };
}
